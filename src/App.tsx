import React, {useEffect, useState} from 'react';
import './App.css';
import CurrencyItem from "./components/CurrencyItem.tsx";
import Decimal from 'decimal.js-light';
import getData from './api/getData.ts';
import { Currency } from './types/Currency.ts';
import { maxRubValue, minRubValue, rubStep, USDTStep } from './constants.ts';

function App() {
  const [currentRubValue, setCurrentRubValue] = useState<Decimal>(new Decimal(10000));
  const [currentUSDTValue, setCurrentUSDTValue] = useState<Decimal>(new Decimal(94.24));
  const [currentUSDTPrice, setCurrentUSDTPrice] = useState(106.12);
  const [minUSDTValue, setMinUSDTValue] = useState(minRubValue/currentUSDTPrice);
  const [maxUSDTValue, setMaxUSDTValue] = useState(maxRubValue/currentUSDTPrice);;
  const [currentPercent, setCurrentPercent] = useState(0);
  const [isRubValueLoaded, setIsRubValueLoaded] = useState(false);
  const [isUSDTValueLoaded, setIsUSDTValueLoaded] = useState(true);

  async function changeValues(currency: Currency, newValue: number) {
    if (currency === 'rub') setIsUSDTValueLoaded(true)
    if (currency === 'usdt') setIsRubValueLoaded(true)

    try {
      const data = await getData(currency, newValue)

      setCurrentRubValue(new Decimal(data.inAmount))
      setCurrentUSDTValue(new Decimal(data.outAmount))
      setCurrentUSDTPrice(+data.price[1])
      setMinUSDTValue(minRubValue/+data.price[1])
      setMaxUSDTValue(maxRubValue/+data.price[1])
      calcPercent(currency, newValue)
      
    } catch (error) {
      console.log(error);
    }

    setIsRubValueLoaded(false);
    setIsUSDTValueLoaded(false);
  }

function handleSetLoader(currency: Currency) {
  if (currency === 'rub') setIsRubValueLoaded(true)
  if (currency === 'usdt') setIsUSDTValueLoaded(true)
}

function calcPercent(currency: Currency, newValue: number) {
  let newPercent = null;

  if (currency === 'rub') {
    newPercent = ((newValue - minRubValue) / (maxRubValue - minRubValue)) * 100
  }
  if (currency === 'usdt') {
    newPercent = ((newValue - minUSDTValue) / (maxUSDTValue - minUSDTValue) ) * 100
  }

  if (newPercent) setCurrentPercent(newPercent)
}

  useEffect(() => {
    changeValues('rub', minRubValue);
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="currencies">
          <CurrencyItem 
            currency={"rub"} 
            currencyValue={currentRubValue}
            changeValues={changeValues}
            minValue={minRubValue}
            maxValue={maxRubValue}
            step={rubStep}
            currentPercent={currentPercent}
            isLoaded={isRubValueLoaded}
            handleSetLoader={handleSetLoader}
            maxRubValue={maxRubValue}
            maxUSDTValue={maxUSDTValue}
          />
          <CurrencyItem 
            currency={"usdt"} 
            currencyValue={currentUSDTValue}
            changeValues={changeValues}
            minValue={minUSDTValue}
            maxValue={maxUSDTValue}
            step={USDTStep}
            currentPercent={currentPercent}
            isLoaded={isUSDTValueLoaded}
            handleSetLoader={handleSetLoader}
            maxRubValue={maxRubValue}
            maxUSDTValue={maxUSDTValue}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
