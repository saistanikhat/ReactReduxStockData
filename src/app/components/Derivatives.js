import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    getDerivativesAsync,
  } from './derivativesSlice';
  import {selectQuote, clearQuoteUnderlying, clearQuoteDerivatives} from './quoteSlice';
  import styles from './Underlyings.module.css';

export const Derivatives = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { quoteDerivatives } = useSelector(selectQuote);
  const [derivativesList, setDerivativesList] = useState([{}]);

  useEffect(()=>{
    dispatch(clearQuoteUnderlying());
  dispatch(clearQuoteDerivatives());
      dispatch(getDerivativesAsync(location.state.token));
  },[]);

  useEffect(()=>{
    let derivativesEntities = [];
    quoteDerivatives.forEach(eachItem=>{
      let result = derivativesEntities.filter(item => item.symbol === eachItem.symbol);
      if(result.length === 0){
        derivativesEntities.push(eachItem);
      }
    })
    setDerivativesList(derivativesEntities);
  },[quoteDerivatives]);

  let content = derivativesList.length!==0 && derivativesList.map((post) => {
    return (
      <div className={styles.row}>
      <span className={styles.value}>{`${post.symbol}: ${post.price}`}</span>
      
    </div>
    )
   }

);

// Check for loading flag 
// if (loading) return <p>Loading...</p>

return (
  <div>
    <button onClick={() => navigate(-1)}>Go back</button>
    {content}
  </div>
);
}