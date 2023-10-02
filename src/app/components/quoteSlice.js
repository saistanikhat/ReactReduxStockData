import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchQuote } from './stocksAPI';

const initialState = {
    quoteUnderlying: [],
    quoteDerivatives: [],
    quoteLoading: false,
};

export const getQuoteAsync = createAsyncThunk(
  'stocks/fetchQuote',
  async (props, thunkAPI) => {
    let response = await fetchQuote(props.token);
    return {...response.payload, underlying: props.underlying, symbol: props.symbol, origin: props.origin};
  }
);

export const quoteSlice = createSlice({
  name: 'quote',
  initialState,
  reducers: {
    clearQuoteUnderlying: (state, action) => {
      state.quoteUnderlying = [];
    },
    clearQuoteDerivatives: (state, action) => {
      state.quoteDerivatives = [];
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(getQuoteAsync.pending, (state) => {
        state.quoteLoading = true;
      })
      .addCase(getQuoteAsync.fulfilled, (state, action) => {
        state.quoteLoading = false;
        if(action.payload.origin === 'underlying'){
          state.quoteUnderlying.push(action.payload);
        }
        if(action.payload.origin === 'derivatives'){
          state.quoteDerivatives.push(action.payload);
        }
      })
      .addCase(getQuoteAsync.rejected, (state, action) => {
        state.quoteLoading = false;
      });
  },
});

export const { clearQuoteUnderlying, clearQuoteDerivatives } = quoteSlice.actions;

export const selectQuote = (state) => {
  return {...state.quote, ...state.underlyings};
};

export const showQuote = (props) => (dispatch, getState) => {
    dispatch(getQuoteAsync(props));
  // const currentValue = selectQuote(getState());
};

export default quoteSlice.reducer;
