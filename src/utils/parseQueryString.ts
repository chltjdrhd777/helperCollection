interface QueryParamType {
  [key: string]: string;
}

export function parseQueryString(queryString?: string) {
  if (!queryString) return {} as QueryParamType;

  queryString = queryString.substring(1); //첫 '?' 부분 제거

  const queryParams = queryString.split('&');

  const result = {} as QueryParamType;

  queryParams.forEach((param) => {
    const [key, value] = param.split('=');
    result[key] = decodeURIComponent(value); // decodeURIComponent = 인코딩된 string들 변환
  });

  return result;
}
