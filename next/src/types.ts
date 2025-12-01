export interface GigImage {
  url: string;
  width: number;
  height: number;
  ratio?: string;
  fallback?: boolean;
}

export interface Gig {
  name: string;
  id: string;
  url: string;
  images: Array<GigImage>;
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