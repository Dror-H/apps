const groups = {
  interests: ['interests', 'interested_in'],
  demographics: [
    'industries',
    'family_statuses',
    'college_years',
    'education_majors',
    'education_schools',
    'education_statuses',
    'work_positions',
    'work_employers',
    'income',
    'friends_of_connections',
    'life_events',
    'relationship_statuses',
  ],
  behaviors: [
    'connections',
    'friends_of_connections',
    'custom_audiences',
    'behaviors',
    'home_value',
    'user_adclusters',
  ],
};

export interface TargetingRatio {
  interests: number;
  demographics: number;
  behaviors: number;

  [k: string]: number;
}

export function computeRatioInPercents(segmentRatio: { [k: string]: number }, total: number): { [k: string]: number } {
  return Object.entries(segmentRatio).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: Number(((value / total) * 100).toFixed(2)) }),
    {},
  );
}

export function ratioToPercents(segmentRatio: { [k: string]: number }): TargetingRatio {
  const total = getTotal(segmentRatio);
  const ratio = computeRatioInPercents(segmentRatio, total);
  const result = getResultFromRatio(ratio);
  const targetingRatio: TargetingRatio = {
    interests: Number(result.interests.toFixed(0)),
    demographics: Number(result.demographics.toFixed(0)),
    behaviors: Number(result.behaviors.toFixed(0)),
  };
  compensateTargetingRatio(targetingRatio);
  return targetingRatio;
}

export function getResultFromRatio(ratio: { [k: string]: number }): TargetingRatio {
  return Object.entries(ratio).reduce(
    (acc, entry: [string, number]) => {
      const [key, value] = entry;
      const targetingGroups = ['interests', 'demographics', 'behaviors'];
      targetingGroups.forEach((group) => {
        if (groups[group].includes(key)) {
          !isNaN(value) && (acc[group] += value);
        }
      });
      return acc;
    },
    {
      interests: 0,
      demographics: 0,
      behaviors: 0,
    },
  );
}

export function compensateTargetingRatio(targetingRatio: TargetingRatio, maxCompensations = 10): void {
  let targetingRatioTotal = getTotal(targetingRatio);
  if (targetingRatioTotal === 0 || targetingRatioTotal === 100) {
    return;
  }

  let compensationCount = 1;
  while (targetingRatioTotal !== 100) {
    compensatePercentage(targetingRatioTotal, targetingRatio);
    targetingRatioTotal = getTotal(targetingRatio);
    compensationCount++;
    if (compensationCount > maxCompensations) {
      throw new Error(`Exceeded maximum of ${maxCompensations} compensations`);
    }
  }
}

export function getTotal(targetingRatio: { [k: string]: number }): number {
  return Object.values(targetingRatio).reduce((a: number, c: number) => (a += c), 0);
}

export function compensatePercentage(total: number, targetingRatio: TargetingRatio): void {
  for (const key in targetingRatio) {
    if (total < 100) {
      targetingRatio[key]++;
      return;
    }
    if (total > 100 && targetingRatio[key] > 0) {
      targetingRatio[key]--;
      return;
    }
  }
}
