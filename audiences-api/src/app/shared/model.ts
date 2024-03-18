export interface SynonymsResponse {
  text: string;
  sense: string;
  results: Result[];
}

export interface Result {
  score: number;
  text: string;
  count: number;
}
export interface SearchResult<Spec = FacebookTargeting> {
  id: string;
  spec: Spec;
  topics: string[];
  userTags?: string[];
  rank: number;
  specRatio?: { [k: string]: number };
  createdByContributors?: boolean;
}

export interface FacebookTargeting {
  id: string;
  name: string;
  campaign?: Campaign;
  targeting: Targeting;
}

export interface Campaign {
  id: string;
  name: string;
}

export interface Segment {
  id: string;
  name: string;
  audience_size_lower_bound: number;
  audience_size_upper_bound: number;
  path: string[];
  size?: number;
  description: string;
  topic: string;
  type?: keyof FlexibleSpec | string;
  disambiguation_category?: string;
  valid?: boolean;
  relatedWords?: string[];
  status?: string;
  synonyms?: string[];
  datamuse?: string[];
}

export interface Targeting {
  age_max?: number;
  age_min?: number;
  locales?: number[];
  flexible_spec?: FlexibleSpec[];
  exclusions?: FlexibleSpec;
  geo_locations?: GeoLocations;
  device_platforms?: string[];
  facebook_positions?: string[];
  instagram_positions?: string[];
  publisher_platforms?: string[];
  targeting_optimization?: string;
}

export interface FlexibleSpec {
  relationship_statuses?: number[];
  college_years?: number[];
  education_statuses?: number[];
  demographics?: Segment[];
  connections?: Segment[];
  friends_of_connections?: Segment[];
  custom_audiences?: Segment[];
  interests?: Segment[];
  behaviors?: Segment[];
  education_majors?: Segment[];
  education_schools?: Segment[];
  family_statuses?: Segment[];
  home_value?: Segment[];
  interested_in?: Segment[];
  income?: Segment[];
  industries?: Segment[];
  life_events?: Segment[];
  user_adclusters?: Segment[];
  work_positions?: Segment[];
  work_employers?: Segment[];
}

export const GeoLocationsObjectKeys = ['cities', 'neighborhoods', 'places', 'regions'];
export const GeoLocationsStringKeys = ['countries', 'location_types'];
export interface GeoLocations {
  cities: City[];
  neighborhoods: Neighborhood[];
  places: Place[];
  regions: Region[];
  countries: string[];
  location_types: string[];
}
export interface Neighborhood {
  key: string;
  name: string;
  radius: number;
  region: string;
  country: string;
  region_id: string;
}

export interface City {
  key: string;
  name: string;
  radius: number;
  region: string;
  country: string;
  region_id: string;
  distance_unit: string;
}

export interface Place {
  key: string;
  name: string;
  radius: number;
  country: string;
  latitude: number;
  longitude: number;
  region_id: number;
  distance_unit: string;
  primary_city_id: number;
}

export interface Region {
  key: string;
  name: string;
  country: string;
}

export interface LdaTopic {
  term: string;
  probability: number;
}
