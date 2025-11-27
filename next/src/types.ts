export interface Gig {
  name: string;
  id: string;
  url: string;
  images: Array<{
    url: string;
    ratio?: string;
    width?: number;
    height?: number;
  }>;
  _embedded: {
    venues: Array<{
      name: string;
      [key: string]: any;
    }>
    attractions: Array<{
      id: string;
      [key: string]: any;
    }>
  };
  dates: {
    start: {
      localDate?: string;
      localTime?: string;
      [key: string]: any;
    }
  };
  info: string;
  pleaseNote: string;
  [key: string]: any;
}

export interface GigSuggestion extends Gig {
  reason: string;
}