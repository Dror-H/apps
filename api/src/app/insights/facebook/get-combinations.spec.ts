import { buildCombinations } from './constants';
describe('commination', () => {
  it('should chunk rage', () => {
    const range = {
      start: new Date('2018-05-17'),
      end: new Date('2021-06-17'),
    };
    const commination = buildCombinations(range);
    expect(commination.length).toEqual(222);
  });
  it('should chunk rage', () => {
    const range = {
      start: new Date('2021-09-09'),
      end: new Date('2021-09-09'),
    };
    const commination = buildCombinations(range);
    console.log(commination);
    expect(commination.length).toEqual(6);
  });
  it('should chunk rage', () => {
    const range = {
      start: new Date('2021-09-08'),
      end: new Date('2021-09-09'),
    };
    const commination = buildCombinations(range);
    expect(commination.length).toEqual(6);
  });
});
