import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { fetchBrands } from '@/entities/part';

let controller;

export const loadBrands = createAsyncThunk(
  'brands/load',
  async (number, { rejectWithValue }) => {
    controller?.abort();
    controller = new AbortController();
    try {
      return await fetchBrands(number, controller.signal);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
  { condition: (number) => Boolean(number?.trim()) }
);

const initialState = {
  number: '',
  items: [],
  status: 'idle',
  error: null,
  requestId: null,
};

const slice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    reset: () => {
      controller?.abort();
      return initialState;
    },
  },
  extraReducers: (b) => {
    b.addCase(loadBrands.pending, (s, a) => {
      s.status = 'loading';
      s.error = null;
      s.number = a.meta.arg;
      s.requestId = a.meta.requestId;
    })
      .addCase(loadBrands.fulfilled, (s, a) => {
        if (s.requestId !== a.meta.requestId) return;
        s.status = 'succeeded';
        s.items = a.payload;
      })
      .addCase(loadBrands.rejected, (s, a) => {
        if (s.requestId !== a.meta.requestId) return;
        s.status = 'failed';
        s.items = [];
        s.error = a.payload ?? 'Неизвестная ошибка';
      });
  },
});

export const { reset: resetBrands } = slice.actions;
export const brandsReducer = slice.reducer;
