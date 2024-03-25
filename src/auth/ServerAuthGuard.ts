import { GetServerSideProps } from 'next';
import { RESTORE_ACCESS_TOKEN } from '@/graphql/auth';
import { objectToCookieString } from '@/utils/objectToCookieString';
import { ZECO_TOKEN } from '@/utils/token';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';

interface ServerSideProps {
  name: 'NEXT';
}

const getApolloClient = (headers: Record<string, string> = {}) =>
  new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: 'http://localhost:4000/graphql',
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

export const ServerAuthGuard: GetServerSideProps<ServerSideProps> = async (context) => {
  const accessToken = context.req.cookies[ZECO_TOKEN];
  const currentTime = Date.now() / 1000;
  const { req, res } = context;

  try {
    const parsedToken = jwtDecode(accessToken ?? '');
    if (parsedToken && parsedToken.exp! > currentTime) {
      // todo 권한 관련하여 리다이렉트 구현
      console.log('유효함');
    } else {
      const apolloClient = getApolloClient({
        Cookie: objectToCookieString(context.req.cookies),
      });

      try {
        const restoreTokenResponse = await apolloClient.query({
          query: RESTORE_ACCESS_TOKEN,
        });
        const newAccessToken = restoreTokenResponse.data.restoreAccessToken ?? '';
        res.setHeader('Set-Cookie', `${ZECO_TOKEN}=${newAccessToken}`);
      } catch (err) {
        console.log('refresh token 불러오기 오류', err);
        return {
          redirect: {
            permanent: false,
            destination: '/login',
          },
        };
      }
    }
  } catch (err) {
    console.error('server side error', err);
  }

  return {
    props: {
      name: 'NEXT',
    },
  };
};
