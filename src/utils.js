const fs = require('fs');
const path = require('path');

// 从根目录往上一级一级的找到filename的路径
const getPath = (filename) => {
  let currDir = process.cwd() || __dirname;
  while (!fs.existsSync(path.join(currDir, filename))) {
    currDir = path.join(currDir, '../');

    // unix根目录为/， win32系统根目录为 C:\\格式的
    if (currDir === '/' || /^[a-zA-Z]:\\$/.test(currDir)) {
      return '';
    }
  }
  return path.join(currDir, filename);
};

module.exports = { getPath };
