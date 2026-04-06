import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalQuantity: number;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<any>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      const price = Number(action.payload.price || 0);
      
      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.items.push({ ...action.payload, price, quantity: 1 });
      }
      state.totalQuantity++;
      state.totalAmount += price;
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      const existingItem = state.items.find((item) => item.id === action.payload);
      if (existingItem) {
        const price = Number(existingItem.price || 0);
        if (existingItem.quantity === 1) {
          state.items = state.items.filter((item) => item.id !== action.payload);
        } else {
          existingItem.quantity--;
        }
        state.totalQuantity--;
        state.totalAmount -= price;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
