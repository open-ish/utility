# trycatchfy

Standardize the way you try/catch HTTP request

## Motivation

Have you started a service and forgotten to treat some HTTP status errors? Do you know how to treat an HTTP status error? Or worst, you know how to treat an HTTP request error, but all time do you need to remember someone how to do that thought pull request?

`Trycatchfy` is a way to have sure that a team is following a pattern.

## How to use it

### Directly (Not suggested)

```TS
import { trycatchfy } from './trycatchfy';

const getSomething = () => {
  const expectedBehavior = async () => {
    const response = await httpRequest()
    console.log(response)
  }
  const onUnauthorizedError = (axiosResponse) => {
    console.error('Sorry, looks like you do not have permission', axiosResponse)
  }
  const onEndCycle = () => {
    console.log('Process stopped')
  }

  trycatchfy({
      expectedBehavior,
      onUnauthorizedError,
      onEndCycle,
      // other errors
      // onInternalServerError,
      // onHttpExceptionError,
      // onForbiddenError,
      // onResourceError,
      // onScriptError,
    });
}
```

### By Wrapping (Suggested)

First, define your pattern by wrapping `Trycatchfy`. See it as a config file. Do once.

```TS
import { trycatchfy } from './trycatchfy';
import { ITrycatchfyParams } from '../index.d';

interface IFakeAxios {
  response: any;
  status: number;
}

export const wrapperTrycatchfy = ({
  expectedBehavior,
  onForbiddenError,
  onResourceError,
  onScriptError,
  onEndCycle,
  onHttpExceptionError,
}: Omit<
  ITrycatchfyParams<IFakeAxios>,
  'onUnauthorizedError' | 'onInternalServerError'
>) => {
  // handle Unauthorized Error once
  const onUnauthorizedErrorDefault = () => {
    console.log('logout the user');
  };
  // handle Internal Server Error once
  const onInternalServerErrorDefault = () => {
    console.log('server error - reload');
  };
  return trycatchfy<IFakeAxios>({
    expectedBehavior,
    onForbiddenError,
    onResourceError,
    onScriptError,
    onHttpExceptionError,
    onUnauthorizedError: onUnauthorizedErrorDefault,
    onInternalServerError: onInternalServerErrorDefault,
    onEndCycle,
  });
};
```

Then, use it on your components

```TS
import { wrapperTrycatchfy } from './wrapperTrycatchfy'
  const expectedBehavior = async () => {
    const response = await httpRequest()
    console.log(response)
  }

  wrapperTrycatchfy({
      expectedBehavior,
      // These follow handle are also required
      // onEndCycle,
      // onForbiddenError,
      // onResourceError,
      // onScriptError,
    });
```

## Requirements

- [Axios](https://axios-http.com/)
