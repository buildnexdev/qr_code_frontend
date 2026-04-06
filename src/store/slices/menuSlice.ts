import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

/** Matches qr-backend GET /api/menu (admin Menu) */
export interface FoodItem {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  /** false = unavailable in admin */
  status?: boolean;
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
        // Admin toggles availability → `status: false` hides item here
        const normalized = action.payload.filter((item) => item.status !== false);
        state.items = normalized;
        const fetchedCategories = Array.from(
          new Set(normalized.map((item) => item.category).filter(Boolean))
        );
        state.categories = fetchedCategories.length ? ['All', ...fetchedCategories] : ['All'];
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch menu';
      });
  },
});

export default menuSlice.reducer;
