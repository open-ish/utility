interface ITrycatchfyDefault<IAxiosErrorReponse> {
  expectedBehavior: () => Promise<void>;
  onError: (error?: Error) => void;
  onHttpError: (axiosErrorResponse?: IAxiosErrorReponse) => void;
}

export interface ITrycatchfyParams<IAxiosErrorReponse> {
  expectedBehavior: ITrycatchfyDefault<IAxiosErrorReponse>['expectedBehavior'];
  onInternalServerError: ITrycatchfyDefault<IAxiosErrorReponse>['onHttpError'];
  onUnauthorizedError: ITrycatchfyDefault<IAxiosErrorReponse>['onHttpError'];
  onForbiddenError: ITrycatchfyDefault<IAxiosErrorReponse>['onHttpError'];
  onResourceError: ITrycatchfyDefault<IAxiosErrorReponse>['onHttpError'];
  onScriptError: ITrycatchfyDefault<IAxiosErrorReponse>['onError'];
  onHttpExceptionError?: ITrycatchfyDefault<IAxiosErrorReponse>['onError'];
  onEndCycle: () => void;
  customHttpErrorsHandle?: {
    [key: string]: ITrycatchfyDefault<IAxiosErrorReponse>['onHttpError'];
  };
}

export interface ITrycatchfyError {
  response: { status: number };
}

export interface IHttpMappedErrorsHelper {
  handleName: string;
  statusHandle?: (status: number) => boolean;
  statusCode?: number;
}

export interface IInitTrycatchfy {
  customHttpErrors?: IHttpMappedErrorsHelper[];
}
