import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string;
  tableId: string;
}

const initialState: UserState = {
  name: localStorage.getItem('customerName') || '',
  tableId: localStorage.getItem('tableId') || 'General',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ name: string; tableId: string }>) => {
      state.name = action.payload.name;
      state.tableId = action.payload.tableId;
      localStorage.setItem('customerName', action.payload.name);
      localStorage.setItem('tableId', action.payload.tableId);
    },
    clearUser: (state) => {
      state.name = '';
      state.tableId = 'General';
      localStorage.removeItem('customerName');
      localStorage.removeItem('tableId');
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
