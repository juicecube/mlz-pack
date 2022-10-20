import React, { useState } from 'react';

import testSvgUrl from 'example/assets/test-svg.svg?url';
import TestSvg from 'example/assets/test-svg.svg';
// import CSSModules from 'react-css-modules';
import { a } from './utils';
import './index.scss';

export function Test() {
  const [num, setNum] = useState(0);
  a();
  console.log(a());
  return (
    <div styleName="wrapper">
      <p styleName="color">{num}</p>
      <i styleName="icon"></i>
      <i styleName="icon-svg"></i>
      <div styleName="base"></div>
      <TestSvg />
      <img src={testSvgUrl} />
      <img src={require('./assets/test-svg.svg?url')} />
      <button onClick={() => setNum(num + 1)}>加一</button>
    </div>
  );
}

// eslint-disable-next-line import/no-default-export
// export default CSSModules(Test, style);
