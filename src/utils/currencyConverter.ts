// src/utils/currencyConverter.ts
import { Currency } from '../types';

interface ExchangeRates {
  [key: string]: number;
}

const EXCHANGE_RATES: ExchangeRates = {
  'USD_DOP': 58,
  'USD_EUR': 0.85,
  'USD_GBP': 0.73,
  'EUR_USD': 1.18,
  'EUR_DOP': 68,
  'EUR_GBP': 0.86,
  'GBP_USD': 1.37,
  'GBP_EUR': 1.16,
  'GBP_DOP': 79,
  'DOP_USD': 0.017,
  'DOP_EUR': 0.015,
  'DOP_GBP': 0.013
};

export const convertCurrency = (
  amount: number, 
  fromCurrency: Currency, 
  toCurrency: Currency
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  const rateKey = `${fromCurrency}_${toCurrency}`;
  const rate = EXCHANGE_RATES[rateKey];
  
  if (!rate) {
    if (fromCurrency !== 'USD' && toCurrency !== 'USD') {
      const toUSD = convertCurrency(amount, fromCurrency, 'USD');
      return convertCurrency(toUSD, 'USD', toCurrency);
    }
    return amount;
  }
  
  return amount * rate;
};

export const formatCurrency = (amount: number, currency: Currency): string => {
  const formatter = new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: currency === 'DOP' ? 'DOP' : currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return formatter.format(amount);
};
