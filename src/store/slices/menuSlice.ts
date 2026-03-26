import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

interface FoodItem {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

interface MenuState {
  items: FoodItem[];
  categories: string[];
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  items: [],
  categories: ['All', 'Starters', 'Main', 'Beverages', 'Desserts'],
  loading: false,
  error: null,
};

export const fetchMenu = createAsyncThunk('menu/fetchMenu', async () => {
  const response = await axios.get(`${API_BASE_URL}/menu`);
  return response.data;
});

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMenu.fulfilled, (state, action: PayloadAction<FoodItem[]>) => {
        state.loading = false;
        state.items = action.payload;
        // Dynamically update categories if needed, or keep the fixed list
        const fetchedCategories = Array.from(new Set(action.payload.map(item => item.category)));
        state.categories = ['All', ...fetchedCategories];
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch menu';
      });
  },
});

export default menuSlice.reducer;
