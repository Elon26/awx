import axios from "axios";
import { Currency } from "../types/Currency";

const url = '/b2api/change/user/pair/calc';

export default async function getData(currency: Currency, currencyValue: number) {
    const res = await axios.post(url, {
      "pairId": 133,
      "inAmount": currency === 'rub' ? currencyValue : null,
      "outAmount": currency === 'usdt' ? currencyValue : null,
    }, {
      headers: {
        'serial': 'a7307e89-fbeb-4b28-a8ce-55b7fb3c32aa'
      },
      withCredentials: true
    });

    return res.data;
}

