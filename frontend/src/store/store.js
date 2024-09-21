import { configureStore } from '@reduxjs/toolkit';
import homeReducer from '../features/homeSlice';
import loginReducer from '../features/loginSlice';

export const store = configureStore({
  reducer: {
    home: homeReducer,
    login: loginReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
