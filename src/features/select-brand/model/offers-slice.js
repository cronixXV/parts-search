import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { fetchOffers } from '@/entities/part';

let controller;

export const loadOffers = createAsyncThunk(
  'offers/load',
  async ({ number, brand }, { rejectWithValue }) => {
    controller?.abort();
    controller = new AbortController();
    try {
      return await fetchOffers(number, brand, controller.signal);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

const initialState = {
  brand: null,
  items: [],
  status: 'idle',
  error: null,
  requestId: null,
};

const slice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    reset: () => {
      controller?.abort();
      return initialState;
    },
  },
  extraReducers: (b) => {
    b.addCase(loadOffers.pending, (s, a) => {
      s.status = 'loading';
      s.error = null;
      s.brand = a.meta.arg.brand;
      s.requestId = a.meta.requestId;
    })
      .addCase(loadOffers.fulfilled, (s, a) => {
        if (s.requestId !== a.meta.requestId) return;
        s.status = 'succeeded';
        s.items = a.payload;
      })
      .addCase(loadOffers.rejected, (s, a) => {
        if (s.requestId !== a.meta.requestId) return;
        s.status = 'failed';
        s.items = [];
        s.error = a.payload ?? 'Неизвестная ошибка';
      });
  },
});

export const { reset: resetOffers } = slice.actions;
export const offersReducer = slice.reducer;
