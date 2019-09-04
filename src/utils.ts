import { DeepCopyData } from './types';
export const deepCopy = (source:DeepCopyData) : DeepCopyData => {
  const ret = {};

  for (const k in source) {
      ret[k] = typeof source[k] === 'object' ? deepCopy(source[k]) : source[k];
  }
  return ret;
};