const fs = require('fs');
const path = require('path');

const deepCopy = (target) => {
  if (typeof target === 'object') {
    const cloneTarget = Array.isArray(target) ? [] : {};
    for (const key in target) {
      cloneTarget[key] = deepCopy(target[key]);
    }
    return cloneTarget;
  } else {
    return target;
  }
};

const getPath = (filename) => {
  let currDir = process.cwd() || __dirname;
  console.log('是否存在', filename, fs.existsSync(path.join(currDir, filename)));
  while (!fs.existsSync(path.join(currDir, filename))) {
    currDir = path.join(currDir, '../');

    // unix根目录为/， win32系统根目录为 C:\\格式的
    if (currDir === '/' || /^[a-zA-Z]:\\$/.test(currDir)) {
      return '';
    }
  }
  return path.join(currDir, filename);
};

module.exports = { deepCopy, getPath };
