// src/redux/slices/loginSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeLoginTab: 'Details', // Initial active tab
  formData: {
    name: '',
    address: '',
    ens: '',
  },
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setActiveLoginTab: (state, action) => {
      state.activeLoginTab = action.payload;
    },
    updateFormData: (state, action) => {
      state.formData = {
        ...state.formData,
        ...action.payload,
      };
    },
  },
});

export const { setActiveLoginTab, updateFormData } = loginSlice.actions;

export default loginSlice.reducer;
