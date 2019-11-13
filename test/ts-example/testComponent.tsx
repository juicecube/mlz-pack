import React, { useState } from 'react';

import './index.scss';

export function Test() {
  const [num, setNum] = useState(0);

  return (
    <div styleName="wrapper">
      <p styleName="color">{num}</p>
      <i styleName="icon"></i>
      <button onClick={() => setNum(num + 1)}>加一</button>
    </div>
  );
}