export interface ITrycatchfy {
  expectedBehavior: () => Promise<void>;
  onError: (error?: Error) => void;
  onHttpError: (error?: Error) => void; //change to axios instance error
}

export interface ITrycatchfyParams {
  expectedBehavior: ITrycatchfy['expectedBehavior'];
  onInternalServerError: ITrycatchfy['onHttpError'];
  onUnauthorizedError: ITrycatchfy['onHttpError'];
  onForbiddenError: ITrycatchfy['onHttpError'];
  onResourceError: ITrycatchfy['onHttpError'];
  onResourceError: ITrycatchfy['onHttpError'];
  onScriptError: ITrycatchfy['onError'];
  onEndCycle: () => void;
}

export interface ITrycatchfyError {
  status: number;
}
