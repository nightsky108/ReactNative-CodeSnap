import { createSlice } from '@reduxjs/toolkit';

const initState = {
  filter: {
    categoryFilter: [],
  },
};

const productSlice = createSlice({
  name: 'product',
  initialState: initState,
  reducers: {
    clearProductCategoryFilter: (state, action) => {
      state.filter.categoryFilter = [];
    },

    setProductCategoryFilter: (state, action) => {
      const { categoryFilter } = action.payload;
      state.filter.categoryFilter = categoryFilter;
    },
  },
});

export const { clearProductCategoryFilter, setProductCategoryFilter } = productSlice.actions;

export default productSlice.reducer;
