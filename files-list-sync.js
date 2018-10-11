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
  ignore: ['.git', 'node_modules'],
};

function mergeOpts(opts) {
  return Object.assign(JSON.parse(JSON.stringify(defaultOpts)), opts);
}

const stopRun = opts => {
  if (opts.deep === 'all') {
    return false;
  }
  return Number(opts.deep) < opts._currentDeep;
};

const upDeep = opts => {
  const n = Object.assign({}, opts);
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

  const hadPath = {}; // Break Infinite loop

  function symbolReal(p) {
    const real = fs.realpathSync(p);

    const t = fs.lstatSync(real);

    return { t, real };
  }

  function selfAndChild(path, options) {
    const { step, opts, output } = options;
    let input = [];
    if (!hadPath[path]) {
      // Self
      let action = 0;
      try {
        const type = fs.lstatSync(path);
        if (type.isFile()) {
          // File
          // *-1
          action = 2;
        } else if (type.isDirectory()) {
          // *-2 dir
          action = 1;
        } else if (type.isSymbolicLink) {
          // *-3 link
          const { t, real } = symbolReal(path);
          if (t.isDirectory()) {
            // Link dir
            path = real;
            action = 1;
          } else {
            // Link file
            action = 2;
          }
        }
      } catch (err) {
        return input;
      }

      if (action === 1) {
        if (step === 'self') {
          // Self read dir get dir-/files
          input = fs
            .readdirSync(path, 'utf8')
            .filter(x => !opts.ignore.some(ig => ig === x));

          hadPath[path] = true; // Had check self
        } else {
          // Child go deep
          run(path, upDeep(opts), output); // Children dir
        }
      } else if (action) {
        // Add file path
        output.push(path);
        hadPath[path] = true; // Had check file self
      }

      return input;
    }
  }

  function run(pathDir, opts, output = []) {
    if (stopRun(opts)) {
      // 0
      return output;
    }
    const absPath = path.resolve(pathDir);
    const input = selfAndChild(absPath, { step: 'self', opts, output }) || []; // 1

    while (input.length) {
      //  Children
      const path_string = input.shift();
      const absPath = path.join(pathDir, path_string);
      selfAndChild(absPath, { opts, output }); // 2
    }
    return output;
  }

  return run(pathDir, opts);
};
