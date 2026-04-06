import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string;
  tableId: string;
  /** Number of guests (from QR flow step 1) */
  partySize: number;
}

const initialState: UserState = {
  name: localStorage.getItem('customerName') || '',
  tableId: localStorage.getItem('tableId') || 'General',
  partySize: Math.max(1, parseInt(localStorage.getItem('partySize') || '1', 10) || 1),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ name: string; tableId: string; partySize: number }>
    ) => {
      state.name = action.payload.name;
      state.tableId = action.payload.tableId;
      state.partySize = Math.max(1, action.payload.partySize || 1);
      localStorage.setItem('customerName', action.payload.name);
      localStorage.setItem('tableId', action.payload.tableId);
      localStorage.setItem('partySize', String(state.partySize));
    },
    clearUser: (state) => {
      state.name = '';
      state.tableId = 'General';
      state.partySize = 1;
      localStorage.removeItem('customerName');
      localStorage.removeItem('tableId');
      localStorage.removeItem('partySize');
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
