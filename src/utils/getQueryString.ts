export default function getQueryString(data: { [key: string]: any } = {}) {
  return Object.entries(data)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
}
