import { createSlice, createAction } from '@reduxjs/toolkit';
import Reactotron from 'reactotron-react-native';
import _ from 'lodash';

const initState = {
  filter: {
    categoryFilter: [],
    experienceFilter: [],
    statusesFilter: null,
  },
};

const liveStreamSlice = createSlice({
  name: 'liveStream',
  initialState: initState,
  reducers: {
    clearLiveStreamCategoryFilter: (state, action) => {
      state.filter.categoryFilter = [];
    },
    clearLiveStreamExperienceFilter: (state, action) => {
      state.filter.experienceFilter = [];
    },
    clearLiveStreamStatusFilter: (state, action) => {
      state.filter.statusesFilter = null;
    },
    updateLiveStreamCategoryFilter: (state, action) => {
      const { categoryId } = action.payload;
      const { categoryFilter } = state.filter;
      const existIndex = categoryFilter.findIndex(item => {
        return item === categoryId;
      });
      if (existIndex === -1) {
        // add new category filter
        state.filter.categoryFilter = _.concat(categoryFilter, categoryId);
      } else {
        // remove category filter
        state.filter.categoryFilter = _.filter(categoryFilter, item => item !== categoryId);
      }
    },
    updateLiveStreamStatusFilter: (state, action) => {
      state.filter.statusesFilter = action.payload;
    },

    updateLiveStreamExperienceFilter: (state, action) => {
      const { categoryId } = action.payload;
      const { experienceFilter } = state.filter;
      const existIndex = experienceFilter.findIndex(item => {
        return item === categoryId;
      });
      if (existIndex === -1) {
        // add new category filter
        state.filter.experienceFilter = _.concat(experienceFilter, categoryId);
      } else {
        // remove category filter
        state.filter.experienceFilter = _.filter(experienceFilter, item => item !== categoryId);
      }
    },
    setLiveStreamCategoryFilter: (state, action) => {
      const { categoryFilter } = action.payload;
      state.filter.categoryFilter = categoryFilter;
    },
    setLiveStreamExperienceFilter: (state, action) => {
      const { categoryFilter } = action.payload;
      state.filter.experienceFilter = categoryFilter;
    },
    resetLiveStreamFilter: state => initState,
  },
});

export const {
  clearLiveStreamCategoryFilter,
  clearLiveStreamExperienceFilter,
  updateLiveStreamCategoryFilter,
  updateLiveStreamExperienceFilter,
  setLiveStreamCategoryFilter,
  setLiveStreamExperienceFilter,
  resetLiveStreamFilter,
  updateLiveStreamStatusFilter,
  clearLiveStreamStatusFilter,
} = liveStreamSlice.actions;

export default liveStreamSlice.reducer;
