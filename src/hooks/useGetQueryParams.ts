import { useLayoutEffect, useState } from 'react';

import { parseQueryString } from 'utils/parseQueryString';

export default function useGetQueryParams<T extends { [key: string]: any }>(): T {
  const [queryParams, setQueryParams] = useState<T>({} as T);

  useLayoutEffect(() => {
    if (window) {
      setQueryParams(parseQueryString(window?.location?.search) as T);
    }
  }, []);

  return queryParams;
}
