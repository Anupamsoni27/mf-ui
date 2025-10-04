import { Stock } from './stock.model';

export interface Fund {
  _id: string;
  holding_count: number;
  latest_date: string;
  unique_id?: string;
  name?: string;
  symbol?: string;
  description?: string;
  totalValue?: number;
  changePercent?: number;
  changeAmount?: number;
  lastUpdated?: string;
  stocks?: Stock[];
}

export interface FundInfo {
  _id: string;
  date: string;
  holding_count: number;
  stocks: Stock[];
  unique_id: string;
  fund?: Fund;
  performance?: {
    oneDay: number;
    oneWeek: number;
    oneMonth: number;
    threeMonths: number;
    oneYear: number;
  };
  lastUpdated?: string;
}

export interface FundInfoResponse {
  count?: number;
  message?: string;
  records?: FundInfo[];
  status?: string;
  data?: FundInfo;
}

export interface FundListResponse {
  count: number;
  message: string;
  records: Fund[];
  status: string;
}