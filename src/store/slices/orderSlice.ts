import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

interface OrderState {
  currentOrder: any | null;
  status: 'Idle' | 'Submitting' | 'Preparing' | 'Error';
  progress: number;
}

const savedOrder = localStorage.getItem('currentOrder');
const initialState: OrderState = {
  currentOrder: savedOrder ? JSON.parse(savedOrder) : null,
  status: 'Idle',
  progress: 0,
};

export const submitOrder = createAsyncThunk('order/submitOrder', async (order: any) => {
  const response = await axios.post(`${API_BASE_URL}/orders`, order);
  return { ...order, ...response.data };
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    updateProgress: (state, action: PayloadAction<{ progress: number; statusText: string }>) => {
      state.progress = action.payload.progress;
      if (state.currentOrder) {
        state.currentOrder.status = action.payload.statusText;
        localStorage.setItem('currentOrder', JSON.stringify(state.currentOrder));
      }
    },
    setOrderStatus: (state, action: PayloadAction<string>) => {
      if (state.currentOrder) {
        state.currentOrder.status = action.payload;
        localStorage.setItem('currentOrder', JSON.stringify(state.currentOrder));
      }
    },
    clearOrder: (state) => {
      state.currentOrder = null;
      state.status = 'Idle';
      state.progress = 0;
      localStorage.removeItem('currentOrder');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.status = 'Submitting';
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.status = 'Preparing';
        state.progress = 10;
        localStorage.setItem('currentOrder', JSON.stringify(action.payload));
      })
      .addCase(submitOrder.rejected, (state) => {
        state.status = 'Error';
      });
  }
});

export const { updateProgress, clearOrder, setOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;
