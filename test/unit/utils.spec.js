const path = require('path');

const { getPath } = require('../../src/utils');

describe('Utils', () => {
  it('getPath', () => {
    expect(getPath('Config.md')).toBe(path.join(__dirname, '../../Config.md'));
    expect(getPath('Configs.md')).toBe('');
  });
});