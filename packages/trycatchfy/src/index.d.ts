interface ITrycatchfyDefault<IAxiosErrorReponse> {
  expectedBehavior: () => Promise<void>;
  onError: (error?: Error) => void;
  onHttpError: (axiosErrorResponse?: IAxiosErrorReponse) => void;
}

export interface ITrycatchfyParams<IAxiosErrorReponse> {
  expectedBehavior: ITrycatchfy['expectedBehavior'];
  onInternalServerError: ITrycatchfyDefault<IAxiosErrorReponse>['onHttpError'];
  onUnauthorizedError: ITrycatchfyDefault<IAxiosErrorReponse>['onHttpError'];
  onForbiddenError: ITrycatchfyDefault<IAxiosErrorReponse>['onHttpError'];
  onResourceError: ITrycatchfyDefault<IAxiosErrorReponse>['onHttpError'];
  onScriptError: ITrycatchfy['onError'];
  onHttpExceptionError?: ITrycatchfy['onError'];
  onEndCycle: () => void;
  customHttpErrorsHandle?: {
    [key: string]: ITrycatchfyDefault<IAxiosErrorReponse>['onHttpError'];
  };
}

export interface ITrycatchfyError {
  response: { status: number };
}

export interface IHttpErrorHelper {
  handleName: string;
  statusHandle?: (status: number) => boolean;
  statusCode?: number;
}

export interface IInitTrycatchfy {
  customHttpErrors?: IHttpErrorHelper[];
}
