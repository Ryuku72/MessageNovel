import { useState } from 'react';

export function useLoading() {
  const [isLoading, setIsLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const withLoading = (myAsyncFunction: () => Promise<any>) => async (): Promise<any> => {
    setIsLoading(true);
    const myAsyncValue = await myAsyncFunction();
    setIsLoading(false);
    return myAsyncValue;
  };
  return { isLoading, withLoading };
}
