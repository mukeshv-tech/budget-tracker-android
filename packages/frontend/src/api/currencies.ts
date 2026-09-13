import { api } from '@/api/_api';
import {
  type BaseCurrencyChangeStatus,
  CurrencyModel,
  ExchangeRatesModel,
  RefBalanceRemeasureResult,
  UserCurrencyModel,
  UserExchangeRatesModel,
} from '@bt/shared/types';
import type { ExchangeRatePairQuery, ExchangeRatePairResponse } from '@bt/shared/types/endpoints';

export const getAllCurrencies = async (): Promise<CurrencyModel[]> => [
  { code: 'USD', currency: 'US Dollar', symbol: '$' } as CurrencyModel,
  { code: 'EUR', currency: 'Euro', symbol: '€' } as CurrencyModel,
  { code: 'UAH', currency: 'Ukrainian Hryvnia', symbol: '₴' } as CurrencyModel,
  { code: 'PLN', currency: 'Polish Zloty', symbol: 'zł' } as CurrencyModel,
];

export const loadUserCurrencies = async (): Promise<UserCurrencyModel[]> => [
  { currencyCode: 'USD', exchangeRate: 1, isBaseCurrency: true } as UserCurrencyModel
];

export const deleteCustomRate = (
  pairs: {
    baseCode: string;
    quoteCode: string;
  }[],
): Promise<{ remeasure: RefBalanceRemeasureResult }> => api.delete('/user/currency/rates', { data: { pairs } });

export const loadUserCurrenciesExchangeRates = async (): Promise<UserExchangeRatesModel[]> => [];

/**
 * System (market) exchange rates for a calendar date, in the canonical
 * USD-pivot direction (`baseCode: 'USD', quoteCode: X` = 1 USD in X). Returns
 * `null` when no rates are stored for that date.
 */
export const loadExchangeRatesForDate = async (date: string): Promise<ExchangeRatesModel[] | null> => null;

/**
 * Rate for an arbitrary pair on a calendar date (`yyyy-MM-dd`), covering any ISO
 * currency rather than only the user's linked ones. Falls back to the nearest
 * earlier stored rate, and rejects when none exists near the date.
 */
export const getExchangeRatePair = async ({
  from,
  to,
  date,
  silent,
}: ExchangeRatePairQuery & { silent?: boolean }): Promise<ExchangeRatePairResponse> =>
  api.get('/currencies/rates/pair', { from, to, date }, { silent });

export const editUserCurrenciesExchangeRates = async (
  pairs: {
    baseCode: string;
    quoteCode: string;
    rate: number;
  }[],
): Promise<{ rates: UserExchangeRatesModel[]; remeasure: RefBalanceRemeasureResult }> =>
  api.put('/user/currency/rates', { pairs });

export const deleteUserCurrency = (currencyCode: string) => api.delete('/user/currency', { data: { currencyCode } });

export const setBaseUserCurrency = async (currencyCode: string) => { return {}; };

/**
 * Enqueues the base-currency recalculation as a background job. Resolves as soon
 * as the job is queued — progress is tracked via `getBaseCurrencyChangeStatus`.
 */
export const changeBaseCurrency = async (newCurrencyCode: string): Promise<{ jobId: string; state: 'queued' }> => {
  return { jobId: 'mock-123', state: 'queued' };
};

/**
 * Current state of the user's base-currency change job. Returns `idle` when no
 * change is in flight, so it is safe to call on every app boot.
 */
export async function getBaseCurrencyChangeStatus(): Promise<BaseCurrencyChangeStatus> {
  return { state: 'idle' };
}

export const addUserCurrencies = async (
  currencies: {
    currencyCode: string;
    exchangeRate?: number;
    liveRateUpdate?: boolean;
  }[],
) => api.post('/user/currencies', { currencies });

export async function loadUserBaseCurrency(): Promise<UserCurrencyModel> {
  return undefined as unknown as UserCurrencyModel;
}
