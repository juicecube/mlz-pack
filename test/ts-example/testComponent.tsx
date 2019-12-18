import React, { useState } from 'react';

import TestSvg from 'example/assets/test-svg.svg';
import './index.scss';

console.log(TestSvg);
export function Test() {
  const [num, setNum] = useState(0);

  return (
    <div styleName="wrapper">
      <p styleName="color">{num}</p>
      <i styleName="icon"></i>
      <i styleName="icon-svg"></i>
      <TestSvg />
      <img src={require('./assets/test-svg.svg')}></img>
      <button onClick={() => setNum(num + 1)}>加一</button>
    </div>
  );
}