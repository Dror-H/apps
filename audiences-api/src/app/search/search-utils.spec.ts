import { cloneDeep } from 'lodash';
import { SearchUtils } from './search-utils';
import { mockEmptyFlexSpecAndExclusions, mockSearchResults } from './test-data';

describe('search-utils', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('removeEmptyObjectsAndArraysFromTargeting', () => {
    it('should call removeEmptyObjectsAndArraysFromFlexibleSpecs and removeEmptyObjectsAndArraysFromExclusions for each audience with each audience', () => {
      const removeEmptyFlexSpecsSpy = jest
        .spyOn(SearchUtils, 'removeEmptyObjectsAndArraysFromFlexibleSpecs')
        .mockImplementation();
      const removeEmptyExclusionsSpy = jest
        .spyOn(SearchUtils, 'removeEmptyObjectsAndArraysFromExclusions')
        .mockImplementation();
      const mockAudiences = ['test 1', 'test 2', 'test 3'];
      SearchUtils.removeEmptyObjectsAndArraysFromTargeting(mockAudiences as any);
      mockAudiences.forEach((mockAud, i) => {
        expect(removeEmptyFlexSpecsSpy).toBeCalledWith(mockAudiences[i]);
        expect(removeEmptyExclusionsSpy).toBeCalledWith(mockAudiences[i]);
      });
    });

    it('should remove empty objects and arrays from flexible specs and exclusions', () => {
      SearchUtils.removeEmptyObjectsAndArraysFromTargeting([mockEmptyFlexSpecAndExclusions] as any);
      expect(mockEmptyFlexSpecAndExclusions).toMatchSnapshot();
    });
  });

  describe('removeInvalidTypeSegments', () => {
    it('should call removeInvalidTypesFlexSpec and removeInvalidTypesExclusion with each audience', () => {
      const audiencesMock = ['mock audience 1', 'mock audience 2'];
      const removeInvalidTypesFlexSpecSpy = jest.spyOn(SearchUtils, 'removeInvalidTypesFlexSpec').mockImplementation();
      const removeInvalidTypesExclusionSpy = jest
        .spyOn(SearchUtils, 'removeInvalidTypesExclusion')
        .mockImplementation();
      (SearchUtils as any).removeInvalidTypeSegments(audiencesMock);
      audiencesMock.forEach((audienceMock, i) => {
        expect(removeInvalidTypesFlexSpecSpy.mock.calls[i][0]).toBe(audienceMock);
        expect(removeInvalidTypesExclusionSpy.mock.calls[i][0]).toBe(audienceMock);
      });
    });
  });
  describe('removeInvalidTypesFlexSpec', () => {
    it('should remove audience.spec.targeting.flexible_spec at keys from argument', () => {
      const mockAudience = { spec: { targeting: { flexible_spec: [{ testKey: 'test' }] } } };
      (SearchUtils as any).removeInvalidTypesFlexSpec(mockAudience, ['testKey']);
      expect(mockAudience.spec.targeting.flexible_spec[0].testKey).toBeUndefined();
    });
  });
  describe('removeInvalidTypesExclusion', () => {
    it('should remove audience.spec.targeting.exclusions at keys from argument', () => {
      const mockAudience = { spec: { targeting: { exclusions: { testKey: 'test' } } } };
      (SearchUtils as any).removeInvalidTypesExclusion(mockAudience, ['testKey']);
      expect(mockAudience.spec.targeting.exclusions.testKey).toBeUndefined();
    });
  });

  describe('filterInvalidSegmentsFromFb', () => {
    it('should call removeInvalidFlexibleSpecFromFb and removeInvalidExclusionsFromFb for each with same arguments as given', () => {
      const args = [
        ['test 1', 'test 2'],
        ['validID 1', 'validID 2'],
      ];
      const removeInvalidFlexibleSpecFromFbSpy = jest
        .spyOn(SearchUtils, 'removeInvalidFlexibleSpecFromFb')
        .mockImplementation();
      const removeInvalidExclusionsFromFb = jest
        .spyOn(SearchUtils, 'removeInvalidExclusionsFromFb')
        .mockImplementation();
      (SearchUtils as any).filterInvalidSegmentsFromFb(...args);
      args[0].forEach((mockAud, i) => {
        expect(removeInvalidFlexibleSpecFromFbSpy).toBeCalledWith(args[0][i], args[1], ['demographics']);
        expect(removeInvalidExclusionsFromFb).toBeCalledWith(args[0][i], args[1], ['demographics']);
      });
    });
  });
  describe('removeInvalidFlexibleSpecFromFb', () => {
    it('should remove invalid segments from flexible spec', () => {
      const mockAudience = cloneDeep(mockSearchResults[0]);
      SearchUtils.removeInvalidFlexibleSpecFromFb(mockAudience as any, ['105703889464434'], ['demographics']);
      expect(mockAudience).toMatchSnapshot();
    });
  });
  describe('removeInvalidExclusionsFromFb', () => {
    it('should remove invalid segments from exclusions', () => {
      const mockAudience = cloneDeep(mockSearchResults[1]);
      (SearchUtils as any).removeInvalidExclusionsFromFb(mockAudience, ['6003109292833'], ['demographics']);
      expect(mockAudience).toMatchSnapshot();
    });
  });
});
