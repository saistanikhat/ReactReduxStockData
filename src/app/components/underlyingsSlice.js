import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchUnderlyings } from './stocksAPI';
import {showQuote} from './quoteSlice';

const initialState = {
  entities: [],
  loading: false,
  errors: [],
};

export const getUnderlyingsAsync = createAsyncThunk(
  'stocks/fetchUnderlyings',
  async (_, thunkAPI) => {
    try {
    let response = await fetchUnderlyings();
    const {payload} = response;
    payload.forEach(item => {
      thunkAPI.dispatch(showQuote({token: item.token, underlying: item.underlying, symbol: item.symbol, origin:'underlying'}));
    })
    
    return response.payload;
    }catch(error) {
      return thunkAPI.rejectWithValue(error?.response?.payload || error)
    }
  }
);

export const underlyingsSlice = createSlice({
  name: 'underlyings',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUnderlyingsAsync.pending, (state) => {
        state.loading = true;
        state.errors = [];
      })
      .addCase(getUnderlyingsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.errors = [];
        state.entities = action.payload;
      })
      .addCase(getUnderlyingsAsync.rejected, (state, {payload}) => {
        state.loading = false;
        switch (payload?.response?.status) {
          case 401:
              state.errors.push({ error: "Access denied." }); break;
          case 403:
              state.errors.push({ error: "Forbidden." }); break;
          default:
              state.errors.push(payload); break;
        }
      });
  },
});

export const { usersSuccess, startLoading, hasError } = underlyingsSlice.actions;

export const selectCount = (state) => {
  return state.underlyings;
};

export const showDerivatives = () => (dispatch, getState) => {
  const currentValue = selectCount(getState());
};

export default underlyingsSlice.reducer;
