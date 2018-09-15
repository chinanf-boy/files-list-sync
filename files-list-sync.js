const fs = require('fs');
const path = require('path');

// 0 check deep level
// 1. self check
// 1-1. if file, get absname, just one file
// 1-2. if dir, get dir/files array
// 1-3. if link, find real path {dir/file}
// action-2, add file path, action-1, readdir
// 2. children got , check each child
// 2-1. if file, get absname, just one file
// 2-2. if dir, get dir/files array
// 2-3. if link, find real path
// action-2, add file path, action-1, run deep

// options
const defaultOpts = {
  deep: 1,
  _currentDeep: 1,
};

function mergeOpts(opts) {
  return Object.assign(JSON.parse(JSON.stringify(defaultOpts)), opts);
}

const stopRun = opts => {
  if (opts.deep === 'all') {
    return false;
  }
  return +opts.deep < opts._currentDeep;
};

const upDeep = opts => {
  let n = Object.assign({}, opts);
  n._currentDeep++;
  return n;
};

/**
 * @description get path dir ,how deep childs dir, return all files
 * @param {pathString} pathDir
 * @param {Object} opts
 * @param {number|String} opts.deep {default 1 |'all'} how deep dir file what you want
 */
exports = module.exports = function fileListSync(pathDir, opts) {
  opts = mergeOpts(opts);

  let hadPath = {}; // break Infinite loop

  function symbolReal(p) {
    let real = fs.realpathSync(p);
    let t = fs.lstatSync(real);
    return { t, real };
  }

  function selfAndChild(path, options) {
    let { step, opts, output } = options;
    let input = [];
    if (!hadPath[path]) {
      // self
      let action = 0;
      let type = fs.lstatSync(path);
      if (type.isFile()) {
        // file
        // *-1
        action = 2;
      } else if (type.isDirectory()) {
        // *-2 dir
        action = 1;
      } else if (type.isSymbolicLink) {
        // *-3 link
        let { t, real } = symbolReal(path);
        if (t.isDirectory()) {
          // link dir
          path = real;
          action = 1;
        } else {
          // link file
          action = 2;
        }
      }

      if (action === 1) {
        if (step === 'self') {
          // self read dir get dir-/files
          input = fs.readdirSync(path, 'utf8');
          hadPath[path] = true; // had check self
        } else {
          // child go deep
          run(path, upDeep(opts), output); // children dir
        }
      } else if (action) {
        // Add file path
        output.push(path);
        hadPath[path] = true; // had check file self
      }

      return input;
    }
  }

  function run(pathDir, opts, output = []) {
    if (stopRun(opts)) {
      // 0
      return output;
    }
    let absPath = path.resolve(pathDir);
    let input = selfAndChild(absPath, { step: 'self', opts, output }) || []; // 1

    while (input.length) {
      //  children
      let path_string = input.shift();
      let absPath = path.join(pathDir, path_string);
      selfAndChild(absPath, { opts, output }); // 2
    }
    return output;
  }

  return run(pathDir, opts);
};
