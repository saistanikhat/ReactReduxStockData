import { configureStore } from '@reduxjs/toolkit';
import underlyingsReducer from './components/underlyingsSlice';
import derivativesReducer from './components/derivativesSlice';
import quoteReducer from './components/quoteSlice';

export const store = configureStore({
  reducer: {
    underlyings: underlyingsReducer,
    derivatives: derivativesReducer,
    quote: quoteReducer,
  },
});
