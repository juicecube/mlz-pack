import * as React from 'react';
import * as ReactDom from 'react-dom';

import { Test } from './testComponent';

import './index.scss';

export const enum A {
  a = '',
  b = 0,
  c,
}

const a:A = A.b;
console.log(a);
ReactDom.render(<Test />, document.getElementById('root'));
