import fs from 'fs';
import path from 'path';

import { DeepCopyData } from './types';

export const deepCopy = (target:DeepCopyData) : DeepCopyData => {
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

export const getPath = (filename:string) : string => {
  let currDir:string = process.cwd() || __dirname;
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

export const filter = <T, K extends keyof T>(obj:T, func:(value:T[K], key?:K) => boolean) : Partial<T> => {
  const keys = Object.keys(obj);
  const newObj = {};

  keys.map((item) => {
    if (func(obj[item], item as any)) {
      newObj[item] = obj[item];
    }
  });

  return newObj;
};
