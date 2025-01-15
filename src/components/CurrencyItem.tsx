import { useEffect, useRef, useState } from 'react';
import '../styles/CurrencyItem.css';
import Decimal from 'decimal.js-light';
import { Currency } from '../types/Currency';
import Loader from './Loader';
import checkSetValue from '../utils/checkSetValue';
import { CheckResult } from '../types/CheckResult';

interface Props {
  currency: Currency;
  currencyValue: number | Decimal;
  changeValues: (currency: Currency, newValue: number) => void;
  minValue: number
  maxValue: number
  step: number
  currentPercent: number;
  isLoaded: boolean;
  handleSetLoader: (currency: Currency) => void;
  maxRubValue: number;
  maxUSDTValue: number
}

let timeout: null | ReturnType<typeof setTimeout> = null;

function CurrencyItem({
  currency, 
  currencyValue, 
  changeValues, 
  minValue, 
  maxValue, 
  step, 
  currentPercent,
  isLoaded,
  handleSetLoader,
  maxRubValue,
  maxUSDTValue
}: Props) {
  const percents = [25, 50, 75, 100];
  const percentsToCalc = [0, 25, 50, 75, 100];
  const [currentCurrencyValue, setCurrentCurrencyValue] = useState(currencyValue);
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChangeValue(newValue: number) {
    setCurrentCurrencyValue(newValue);

    if (currency === 'rub') handleSetLoader('usdt')
    if (currency === 'usdt') handleSetLoader('rub')

    if (timeout) clearTimeout(timeout);

    let valueToSet = newValue;
    timeout = setTimeout(() => {
      const checkResult: CheckResult = checkSetValue(minValue, maxValue, newValue)
      if (checkResult === "lessMin") valueToSet = minValue
      if (checkResult === "moreMax") {
        valueToSet = maxRubValue
        changeValues('rub', valueToSet)
        setCurrentCurrencyValue(currency === 'rub' ? maxRubValue : maxUSDTValue)
      } else {
        changeValues(currency, valueToSet)
        setCurrentCurrencyValue(valueToSet)
      }
    }, 1000);
  }

  function handleSetPercent(percentVal: number) {
    handleSetLoader('usdt'); 
    handleSetLoader('rub');

    const newValue = minValue + ((maxValue - minValue) * (percentVal / 100));
    changeValues(currency, newValue);
  }

  useEffect(() => {
    setCurrentCurrencyValue(currencyValue)
  }, [currencyValue])

  return (
    <div className="currency">
      <div className="currencyInputArea">
        <input className="currencyInput" type='number' value={currentCurrencyValue.toString()} onChange={(e) => handleChangeValue(+e.target.value)} min={minValue} max={maxValue} step={step} id={`input${currency}`} ref={inputRef}/>
        <label className="currencyLabel" htmlFor={`input${currency}`} onClick={() =>  inputRef.current && inputRef.current.select()}>
          <span>{currentCurrencyValue.toString()}</span>
          <span className="currencyName">{currency}</span>
        </label>
      </div>
      <div className="percents">
        <div className="percentsRow">
          {percents.map((percent, index) => 
            <div className='percentButtonWrapper' key={percent}>
              {currentPercent >= percent && <button className="percentButton fill" onClick={() => handleSetPercent(percent)}>
                {percent}%
              </button>}
              {currentPercent < percentsToCalc[index] && <button className="percentButton unfill" onClick={() => handleSetPercent(percent)}>
                {percent}%
              </button>}
              {(currentPercent >= percentsToCalc[index]) && (currentPercent < percentsToCalc[index+1]) && 
                <button 
                  className="percentButton"
                  style={{background: `linear-gradient(to right, #168acd ${(currentPercent % 25)*4}%,  #ffffff ${(currentPercent % 25)*4}%)`}}
                  onClick={() => handleSetPercent(percent)}
                >
                {percent}%
                </button>
              }
            </div>
          )}
        </div>
      </div>
      
      {isLoaded && <Loader/>}
    </div>

  );
}

export default CurrencyItem;
