import * as React from 'react';
import * as ReactDom from 'react-dom';

import { Test } from 'example/testComponent';
import svg from 'example/assets/test-svg.svg';

import './index.scss';

export const enum A {
  a = '',
  b = 0,
  c,
}

const a:A = A.b;
console.log(a);
console.log(svg);
ReactDom.render(<Test />, document.getElementById('root'));