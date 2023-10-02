import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchDerivatives } from './stocksAPI';
import {showQuote} from './quoteSlice';

const initialState = {
  derivativesEntities: [],
  derivativesLoading: false,
};

export const getDerivativesAsync = createAsyncThunk(
  'stocks/fetchDerivatives',
  async (token, thunkAPI) => {
    try {
        let response = await fetchDerivatives(token);
        const {payload} = response;
        payload.forEach(item => {
          thunkAPI.dispatch(showQuote({token: item.token, underlying: item.underlying, symbol: item.symbol, origin:'derivatives'}));
        })
      return response.payload;
      }catch(error) {
        return thunkAPI.rejectWithValue(error?.response?.payload || error)
      }
  }
  
);

export const derivativesSlice = createSlice({
  name: 'derivatives',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDerivativesAsync.pending, (state) => {
        state.derivativesLoading = true;
      })
      .addCase(getDerivativesAsync.fulfilled, (state, action) => {
        state.derivativesLoading = false;
        state.derivativesEntities = action.payload;
      })
      .addCase(getDerivativesAsync.rejected, (state, action) => {
        state.derivativesLoading = false;
      });
  },
});

export const { } = derivativesSlice.actions;

export const selectDerivative = (state) => {
  return state.derivatives;
};

export const showDerivatives = (token) => (dispatch, getState) => {
  const currentValue = selectDerivative(getState());
};

export default derivativesSlice.reducer;
