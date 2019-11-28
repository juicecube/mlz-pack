import React, { useState } from 'react';

import svg from 'example/assets/test-svg.svg';
import './index.scss';

export function Test() {
  const [num, setNum] = useState(0);

  return (
    <div styleName="wrapper">
      <p styleName="color">{num}</p>
      <i styleName="icon"></i>
      <i styleName="icon-svg"></i>
      <img src={svg} alt=""/>
      <button onClick={() => setNum(num + 1)}>加一</button>
    </div>
  );
}