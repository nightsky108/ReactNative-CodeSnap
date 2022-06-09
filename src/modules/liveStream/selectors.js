import { createSelector } from '@reduxjs/toolkit';

export const liveStream = state => state.liveStream;

export const liveStreamFilterSelector = createSelector(liveStream, data => data.filter || {});

export const liveStreamCategoryFilterSelector = createSelector(
  liveStreamFilterSelector,
  data => data?.categoryFilter || [],
);
export const liveStreamExperienceFilterSelector = createSelector(
  liveStreamFilterSelector,
  data => data.experienceFilter || [],
);
export const liveStreamStatusesFilterSelector = createSelector(
  liveStreamFilterSelector,
  data => data.statusesFilter || [],
);
