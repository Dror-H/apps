import { mockSearchResults } from '@audience-app/pages/audience-edit-page/mocks';
import { getAudiencesFlatValues } from '@audience-app/pages/audience-edit-page/utils/helpers/helpers.utils';

describe('audiences helpers utils', () => {
  describe('getAudiencesFlatValues', () => {
    it('should return empty array', () => {
      const topics = getAudiencesFlatValues([], 'topics');
      const userTags = getAudiencesFlatValues([], 'userTags');
      const undefinedResult = getAudiencesFlatValues(undefined, 'userTags');
      expect(topics).toEqual([]);
      expect(userTags).toEqual([]);
      expect(undefinedResult).toEqual([]);
    });

    it('should return flattened values', () => {
      const topics = getAudiencesFlatValues(mockSearchResults, 'topics');
      const userTags = getAudiencesFlatValues(mockSearchResults, 'userTags');
      expect(topics).toMatchSnapshot();
      expect(userTags).toMatchSnapshot();
    });
  });
});
