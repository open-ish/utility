# trycatchfy

Standardize the way you try/catch HTTP request

## Motivation

Have you started a service and forgotten to treat some HTTP status errors? Do you know how to treat an HTTP status error? Or worst, you know how to treat an HTTP request error, but all time do you need to remember someone how to do that thought pull request?

`Trycatchfy` is a way to have sure that a team is following a pattern.

## How to use it

First, define your pattern by wrapping `Trycatchfy`

```sh
import { trycatchfy } from './trycatchfy';
import { ITrycatchfyParams } from '../index.d';

interface IFakeAxios {
  response: any;
  status: number;
}

export const wrapperTrycatchfy = async ({
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
  const onUnauthorizedErrorDefault = () => {
    console.log('logout user');
  };
  const onInternalServerErrorDefault = () => {
    console.log('server error - reload');
  };
  await trycatchfy<IFakeAxios>({
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

## Requirements

- [Axios](https://axios-http.com/)
