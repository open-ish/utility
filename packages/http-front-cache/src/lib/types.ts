export interface CacheEntry<TResult> {
  timestamp: number;
  data: TResult;
}

export type Provider = {
  getItem: (key: string) => string | null;
  setItem: <T>(key: string, value: T) => void;
  removeItem: (key: string) => void;
};

export type ServiceFunction<TParams extends unknown[], TResult> = (
  ...params: TParams
) => Promise<TResult>;

export type CacheFactory<TParams extends unknown[], TResult> = {
  params: TParams;
  expire: number;
  serviceFunction: ServiceFunction<TParams, TResult>;
  provider: Provider;
};
