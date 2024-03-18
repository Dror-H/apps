import { getArrayFromParams } from './param-utils';

describe('getArrayFromParams', () => {
  it('should return empty array on no params', () => {
    expect(getArrayFromParams()).toEqual([]);
  });

  it('should return empty array on string params with 0 length', () => {
    expect(getArrayFromParams('')).toEqual([]);
  });

  it('should return empty array on array params with 0 length', () => {
    expect(getArrayFromParams([])).toEqual([]);
  });

  it('should return array with input value on string params', () => {
    expect(getArrayFromParams('test')).toEqual(['test']);
  });

  it('should return input', () => {
    const mockInput = ['test 1', 'test 2', 'test 3'];
    expect(getArrayFromParams(mockInput)).toEqual(mockInput);
  });
});
