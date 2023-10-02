import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCount,
  getUnderlyingsAsync,
} from './underlyingsSlice';
import { selectQuote, clearQuoteUnderlying, clearQuoteDerivatives} from './quoteSlice';
import styles from './Underlyings.module.css';
import { useNavigate } from "react-router-dom";

export function Underlyings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(selectCount);
  const { quoteUnderlying } = useSelector(selectQuote);

  const [payload, setPayload] = useState({});
  const [tokenList, setTokenList] = useState([]);
  const [underlyingsList, setUnderlyingsList] = useState([{}]);

  const ws = useRef(null);

  useEffect(()=>{
    ws.current = new WebSocket('wss://prototype.sbulltech.com/api/ws');
    ws.current.onopen = (event) => {
      var sendDataToSubscribe = {
        "msg_command":"subscribe",
        "data_type":"quote",
        "tokens":tokenList || []
      };
      ws.current.send(JSON.stringify(sendDataToSubscribe));
      console.log("WebSocket Client Connected!");
    }

    ws.current.onclose = (event) => {
      var sendDataToUnscribe = {
        "msg_command":"unsubscribe",
        "data_type":"quote",
        "tokens":tokenList || []
      };
      ws.current.send(JSON.stringify(sendDataToUnscribe));
      console.log("WebSocket Client Disconnected!");
    }

    ws.current.onerror =  (err) => {
      console.log("Error", err.message);
    };

    const wsCurrent = ws.current;

    return ()=>{
      wsCurrent.close();
    }
  },[tokenList]);

  useEffect(()=>{
    if(!ws.current){
      return;
    }
    ws.current.onmessage = (event) => {
      if(!underlyingsList){
        return;
      }
      const json = JSON.parse(event.data)
      console.log('@@@@json', json);

      try {
        if ((json.data_type = "quote" && json?.payload)) {
          setPayload(json.payload);
        }
      } catch (err) {
        console.log('Error', err)
      }
    }
  }, [underlyingsList]);

  useEffect(() => {
    dispatch(clearQuoteUnderlying());
    dispatch(clearQuoteDerivatives());
    dispatch(getUnderlyingsAsync());
  }, [])

  useEffect(()=>{
    let underlyingEntities = [];
    quoteUnderlying.forEach(eachItem=>{
      let result = underlyingEntities.filter(item => item.underlying === eachItem.underlying);
      if(result.length === 0){
        underlyingEntities.push(eachItem);
      }
    })

    const tokenArr = underlyingEntities?.map(el => el.token);
    setUnderlyingsList(underlyingEntities);
    setTokenList(tokenArr);
  },[quoteUnderlying])

  const navigateToDerivates = (token) => {
    navigate("/derivatives", {state: {token}});
  }

  let content = underlyingsList.length!==0 && underlyingsList.map((item) => {
    return (
      <div className={styles.row}>
        <span className={styles.value}>{`${item.underlying}: ${item.price}`}</span>
        <button
          className={styles.button}
          onClick={() => navigateToDerivates(item.token)}
        >
          {`show derivatives ->`}
        </button>
        
      </div>
    )
  });

  if (loading) return <p>Loading...</p>

  return (
    <div>
      {content}
    </div>
  );
}
