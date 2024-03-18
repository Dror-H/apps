import { GetColorByMatchPipe } from '@audience-app/shared/pipes/get-color-by-match/get-color-by-match.pipe';

describe('getColorByMatch', () => {
  let pipe: GetColorByMatchPipe;
  beforeEach(() => {
    pipe = new GetColorByMatchPipe();
  });
  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should transform to null', () => {
    expect(pipe.transform(0)).toBeNull();
  });
  it('should transform to orange', () => {
    expect(pipe.transform(2)).toEqual('orange');
  });

  it('should transform to gold', () => {
    expect(pipe.transform(65)).toEqual('gold');
  });

  it('should transform to lime', () => {
    expect(pipe.transform(75)).toEqual('lime');
  });

  it('should transform to green', () => {
    expect(pipe.transform(88)).toEqual('green');
  });
});
