import * as funcs from './audience-rules.utils';
import { mockRegularTargeting, mockRegularTargetingWithLocation } from './test-data';

// todo - fix skipped tests

describe('audience rules utils', () => {
  describe('createRulesFromTargeting', () => {
    it('should return null if input is falsy', () => {
      expect(funcs.createRulesFromTargeting(null)).toBeNull();
    });

    it.skip('should call getRulesWithDetailedTargeting', () => {
      const spy = jest.spyOn(funcs, 'getRulesWithDetailedTargeting');
      funcs.createRulesFromTargeting(mockRegularTargeting);
      expect(spy).toBeCalledWith(mockRegularTargeting);
    });

    it('should create rules from targeting without location data', () => {
      const result = funcs.createRulesFromTargeting(mockRegularTargeting);
      expect(result).toMatchSnapshot();
    });

    it('should create rules from targeting with location data', () => {
      const result = funcs.createRulesFromTargeting(mockRegularTargetingWithLocation);
      expect(result).toMatchSnapshot();
    });
  });
  describe('getRulesWithDetailedTargeting', () => {
    it('should get rules with detailed targeting', () => {
      const result = funcs.getRulesWithDetailedTargeting(mockRegularTargeting);
      expect(result).toMatchSnapshot();
    });

    it.skip('should call getSelectedAudienceDetailedTargeting with input', () => {
      const spy = jest.spyOn(funcs, 'getSelectedAudienceDetailedTargeting');
      funcs.getRulesWithDetailedTargeting(mockRegularTargeting);
      expect(spy).toBeCalledWith(mockRegularTargeting);
    });
  });
  describe('getSelectedAudienceDetailedTargeting', () => {
    it('should get selected audience with detailed targeting', () => {
      const result = funcs.getRulesWithDetailedTargeting(mockRegularTargeting);
      expect(result).toMatchSnapshot();
    });
  });
});
