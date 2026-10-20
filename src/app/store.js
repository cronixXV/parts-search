import { configureStore } from '@reduxjs/toolkit';

import { brandsReducer } from '@/features/search-brands';
import { offersReducer } from '@/features/select-brand';

export const store = configureStore({
  reducer: {
    brands: brandsReducer,
    offers: offersReducer,
  },
});
