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
