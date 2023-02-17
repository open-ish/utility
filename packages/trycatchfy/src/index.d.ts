export interface ITrycatchfy<IAxiosErrorReponse> {
  expectedBehavior: () => Promise<void>;
  onError: (error?: Error) => void;
  onHttpError: (axiosErrorResponse?: IAxiosErrorReponse) => void;
}

export interface ITrycatchfyParams<IAxiosErrorReponse> {
  expectedBehavior: ITrycatchfy['expectedBehavior'];
  onInternalServerError: ITrycatchfy<IAxiosErrorReponse>['onHttpError'];
  onUnauthorizedError: ITrycatchfy<IAxiosErrorReponse>['onHttpError'];
  onForbiddenError: ITrycatchfy<IAxiosErrorReponse>['onHttpError'];
  onResourceError: ITrycatchfy<IAxiosErrorReponse>['onHttpError'];
  onResourceError: ITrycatchfy<IAxiosErrorReponse>['onHttpError'];
  onScriptError: ITrycatchfy['onError'];
  onHttpExceptionError?: ITrycatchfy['onError'];
  onEndCycle: () => void;
}

export interface ITrycatchfyError {
  response: { status: number };
}
