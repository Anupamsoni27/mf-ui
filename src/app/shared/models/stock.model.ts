export interface Stock {
  _id: string;
  name: string;
  instrument_type: string;
  funds_holding_count: number;
  sector: string;
  timeline: TimelineDataPoint[];
  url: string;
  symbol?: string;
  currentPrice?: number;
  changePercent?: number;
  changeAmount?: number;
  volume?: number;
  marketCap?: number;
  lastUpdated?: string;
}

export interface StockInfo {
  _id: string;
  instrument_type: string;
  name: string;
  sector: string;
  url: string;
  stock?: Stock;
  description?: string;
  website?: string;
  employees?: number;
  founded?: string;
  lastUpdated?: string;
  companyProfile?: {
    description: string;
    industry: string;
    sector: string;
    ceo: string;
    website: string;
  };
  keyMetrics?: {
    peRatio: number;
    eps: number;
    dividendYield: number;
  };
}

export interface StockInfoResponse {
  count?: number;
  message?: string;
  records?: StockInfo[];
  status?: string;
  data?: StockInfo;
}

export interface StockListResponse {
  count: number;
  message: string;
  records: Stock[];
  status: string;
}

export interface StockTimelineResponse {
  count?: number;
  message?: string;
  records?: StockTimeline[];
  status?: string;
  data?: StockTimeline;
}

export interface StockTimeline {
  _id: string;
  name: string;
  timeline: TimelineDataPoint[];
}

export interface TimelineDataPoint {
  date: string;
  fund_count: number;
  compared_to?: string;
}
