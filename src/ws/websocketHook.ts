// reference
// for nestjs server : http://www.macarog.com/255
// for the hook below : https://medium.com/@dlxotjde_87064/react%EC%97%90-websocket-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0-88dcd13bab82
// 보통은 socket client를 통해서 간단하게 연결한다. ( 아래 훅은 공부용 )

import { useEffect, useRef, useState } from 'react';

import { WsParams } from '@src/types';
import { withLogging } from '@src/utils/withLogging';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL_BASE;

const MAX_RETRY_COUNT = 5;
const MIN_INTERVAL = 1000;
const MAX_JITTER = 200;

const ONERROR_CODE = 4000;
const NORMAL_CODE = 1000;

const buildUrl = ({ a }: WsParams) => `${WS_URL}/${a}`;
const isWebSocketOpen = (wsInstance: WebSocket) => wsInstance && wsInstance.readyState === WebSocket.OPEN;

export const useWebSocket = ({ a }: WsParams) => {
  const isMounted = useRef(true);
  const retryCount = useRef(0);
  const ws = useRef<null | WebSocket>(null);
  const [webSocketData, setWebSocketData] = useState(null);

  //초기화
  useEffect(() => {
    retryCount.current = 0;
    isMounted.current = true;
  }, []);

  useEffect(() => {
    ws.current = new WebSocket(buildUrl({ a }));

    const setupWebSocket = (wsInstance: WebSocket) => {
      wsInstance.onopen = () => {
        retryCount.current = 0; // websocket 첫 연결시 setting
        withLogging({
          msg: 'WebSocket 연결',
          type: 'info',
        });
      };

      wsInstance.onmessage = (event) => {
        if (isMounted.current && isWebSocketOpen(wsInstance)) {
          const resData = JSON.parse(event.data);
          const { type } = resData;
          switch (type) {
            case 'resData':
              setWebSocketData(resData);
              console.info('resData');
              break;
            default:
              withLogging({
                msg: `Sorry, we are out of ${type}.`,
                type: 'info',
              });
          }
        }
      };

      wsInstance.onerror = (event) => {
        if (isMounted.current) {
          withLogging({ msg: `WebSocket Error:${event}`, type: 'error' });
          wsInstance.close(ONERROR_CODE); //명시적 close 실행 with custom code
        }
      };

      wsInstance.onclose = (event) => {
        if (isMounted.current) {
          withLogging({
            msg: `WebSocket closed:${(event.code, event.reason)}`,
            type: 'info',
          });

          //retry
          if (event.code !== NORMAL_CODE) {
            if (event.code === ONERROR_CODE) {
              // Exponential Backoff
              let interval = MIN_INTERVAL * Math.pow(2, retryCount.current);

              // Adding Jitter(random)
              const jitter = Math.floor(Math.random() * (MAX_JITTER * 2 + 1)) - MAX_JITTER;
              interval += jitter;

              if (retryCount.current < MAX_RETRY_COUNT) {
                setTimeout(() => {
                  ws.current = new WebSocket(buildUrl({ a }));
                  setupWebSocket(ws.current);
                  retryCount.current++;
                }, interval);
              }
            }
          }
        }
      };
    };

    setupWebSocket(ws.current);

    return () => {
      if (ws.current && isWebSocketOpen(ws.current)) {
        console.info('WebSocket 끊김');
        isMounted.current = false;
        ws.current.close();
      }
    };
  }, [a]);

  return { webSocketData };
};
