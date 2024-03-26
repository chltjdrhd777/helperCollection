import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { URL_ROUTES } from '@/constants/routes';
import { ApolloClient, ApolloQueryResult, InMemoryCache, createHttpLink } from '@apollo/client';
import { RESTORE_ACCESS_TOKEN } from '@/graphql/auth';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { TOKEN } from '@/utils/token';

export const config = {
  matcher: [
    '/projects/:path*',
    '/commercial/:path*',
    '/residential/:path*',
    '/',
    '/login',
    '/signup',
    '/delete-account',
    '/find-password',
    '/admin/:path*',
  ],
};

const MATCH_ROUTES = {
  // 누구나 접근 가능한 경로 하지만 로그인 한 상태라면 "/" 페이지로 라우팅
  OPEN: [/^\/login$/, /^\/signup$/, /^\/find-password$/],
  // 관리자만 접근 가능한 라우팅
  ADMIN_ONLY: [/^\/admin\/member$/, /^\/admin\/expired-member$/],
  // 로그인된 사용자만 접근할 수 있는 경로
  AUTH: [/\//, /^\/projects(\/.+)?$/, /^\/residential(\/.+)?$/, /^\/commercial(\/.+)?$/, /^\/delete-account$/],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get(TOKEN.ZECO_TOKEN);
  const refreshToken = request.cookies.get(TOKEN.ZECO_REFRESH_TOKEN);

  // 1. access refresh 둘 중 하나라도 없을 경우 = 로그아웃 상태 (open route 이외 접근 불가)
  if (!accessToken || !refreshToken) {
    const isOpenRoute = matchRoute('OPEN', pathname);

    if (!isOpenRoute) {
      return NextResponse.redirect(new URL(URL_ROUTES.LOGIN, request.url));
    }
  } else {
    // 2. token들이 다 존재할 경우, token의 만료성을 체크한다.
    const parsedAccessToken = parseToken(accessToken?.value ?? '');

    if (!isTokenExpired(parsedAccessToken)) {
      return checkRouteAuthentication(parsedAccessToken as JwtDecode, pathname, request);
    } else {
      // 3. parsedAccessToken === null 이라면, accessToken이 만료되었으므로, refreshToken으로 accessToken을 재발급
      const newAccessToken = await restoreAccessToken(`${TOKEN.ZECO_REFRESH_TOKEN}=${refreshToken?.value}`);
      const isRefreshTokenExpired = newAccessToken === null;

      if (isRefreshTokenExpired) {
        return clearTokensAndRedirectToLogin(request);
      } else {
        const parsedAccessToken = parseToken(newAccessToken.data.restoreAccessToken);
        return checkRouteAuthentication(parsedAccessToken as JwtDecode, pathname, request);
      }
    }
  }

  return NextResponse.next();
}

/**
 * @helpers
 */

const matchRoute = (routeType: keyof typeof MATCH_ROUTES, pathname: string) => {
  return MATCH_ROUTES[routeType].some((route) => route.test(pathname));
};

const getApolloClient = (headers: Record<string, string> = {}) =>
  new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: `${process.env.NEXT_PUBLIC_DEV_SERVER_BASE_URL}/graphql`,
      credentials: 'include',
      headers,
    }),
    headers,
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
      },
    },
  });

type JwtDecode = JwtPayload & { auth: 'ADMIN' | 'USER' };
const parseToken = (token: string) => {
  try {
    return jwtDecode<JwtDecode>(token);
  } catch (err) {
    console.error('token parsing 실패', err);
    return null;
  }
};

const isTokenExpired = (token: JwtDecode | null) => {
  if (token === null) return true;

  const currentTimestamp = Date.now() / 1000;
  return currentTimestamp > token.exp!;
};

const restoreAccessToken = (refreshToken: string) => {
  return new Promise<ApolloQueryResult<{ restoreAccessToken: string }> | null>(
    // eslint-disable-next-line no-async-promise-executor
    async (resolve) => {
      try {
        const apolloClient = getApolloClient({
          Cookie: refreshToken,
        });

        const restoredAccessToken = await apolloClient.query({ query: RESTORE_ACCESS_TOKEN });
        resolve(restoredAccessToken);
      } catch (err) {
        console.error('refresh token expired', err);
        // eslint-disable-next-line prefer-promise-reject-errors
        resolve(null);
      }
    },
  );
};

const clearTokensAndRedirectToLogin = (request: NextRequest) => {
  const headers = new Headers(request.headers);
  const cookiesToDelete = [TOKEN.ZECO_TOKEN, TOKEN.ZECO_REFRESH_TOKEN];

  cookiesToDelete.forEach((cookie) => headers.append('Set-Cookie', `${cookie}=; Max-Age=0; Path=/;`));

  return NextResponse.redirect(new URL(URL_ROUTES.LOGIN, request.url), {
    headers,
  });
};

const checkRouteAuthentication = (parsedAccessToken: JwtDecode, pathname: string, request: NextRequest) => {
  const auth = parsedAccessToken.auth;

  const isOpenRoute = matchRoute('OPEN', pathname);
  const isAdminOnlyRoute = matchRoute('ADMIN_ONLY', pathname);

  if ((isAdminOnlyRoute && auth === 'USER') || isOpenRoute) {
    return NextResponse.redirect(new URL(URL_ROUTES.HOME, request.url));
  }
};
