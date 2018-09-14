# files-list-sync [![Build Status](https://travis-ci.org/chinanf-boy/files-list-sync.svg?branch=master)](https://travis-ci.org/chinanf-boy/files-list-sync)

「 get path dir/+child all file path 」

## Install

```
npm install files-list-sync
```

```
yarn add files-list-sync
```

## Usage

```js
const filesListSync = require('files-list-sync');

let results = filesListSync('./test.js');
//  ['.editorconfig',
//   '.gitattributes',
//   '.gitignore',
//   '.npmrc',
//   '.travis.yml',
//   '.yo-rc.json',
//   'files-list-sync.js',
//   'license',
//   'package.json',
//   'readme.md',
//   'test.js',
//   'yarn.lock' ]
```

## API

### filesListSync(path, [options])

#### path

| name: | path          |
| ----- | ------------- |
| Type: | `string`      |
| Desc: | path file/dir |

#### options

##### deep

| name:    | deep              |
| -------- | ----------------- |
| Type:    | `number`          | `string`{'all'} |
| Default: | `1`               |
| Desc:    | how deep you want |

### cancat

- [dirs-list](https://github.com/chinanf-boy/dirs-list) get dir path
- [files-list](https://github.com/chinanf-boy/files-list) async/await list of file

### Use by

- [translate-mds](https://github.com/chinanf-boy/translate-mds) translate your md files

## License

MIT © [chinanf-boy](http://llever.com)
