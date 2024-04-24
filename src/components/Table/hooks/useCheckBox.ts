import React, { useEffect, useRef, useState } from 'react';

import { findTargetKeyValue } from '@/utils/findTargetKeyValue';

//types ///////////////////////////////////////////////////////////////////////////////
export interface UseCheckboxParams<DataType, CheckValueType> {
  data?: DataType[];
  keyPropertyName: string; // 데이터의 어떤 프로퍼티 키를 Map에 키로 설정할 것인지
  externalState?: [
    state: Map<string, CheckValueType>,
    dispatcher: React.Dispatch<React.SetStateAction<Map<string, CheckValueType>>>,
  ];
  targetBlockUserSelectElement?: HTMLElement | null;
}

interface OnCheckParams<CheckValueType> {
  key: string;
  customValue?: CheckValueType;
  idx?: number;
  dataFormatter?: (data: any) => any;
}

interface OnAllCheckParams<CheckValueType> {
  e: React.ChangeEvent<HTMLInputElement>;
  customUpdateDataSet?: [string, CheckValueType][]; // 만약 checkState에 boolean 이외의 값을 등록시키고 싶을 경우 사용한다.
  checkingTarget?: any[]; // 만약 react-form의 useFieldArray처럼 체크상태 업데이트를 위한 대상 데이터셋이 유동적으로 변경될 경우 사용한다.
}

interface CompareCheckWithDataParams<Data> {
  comparisonData?: Data[]; // 비교 대상이 되는 데이터 타입이다(ex, 서버데이터)
}

//types ///////////////////////////////////////////////////////////////////////////////

export default function useCheckbox<
  DataType,
  CheckValueType extends boolean | { [key: string]: any },
>({
  data,
  keyPropertyName,
  externalState,
  targetBlockUserSelectElement,
}: UseCheckboxParams<DataType, CheckValueType>) {
  const defaultState = useState(new Map<string, CheckValueType>());
  const [checkState, setCheckState] = externalState ?? defaultState;

  const lastSelectedIdx = useRef<number | null>(null);
  const shiftPressedState = useState<boolean | undefined>(false);

  const onCheck = ({ key, customValue, idx, dataFormatter }: OnCheckParams<CheckValueType>) => {
    const [isShiftPressed] = shiftPressedState;

    const onSingleCheck = () => {
      setCheckState((prev) => {
        const updateCheckState = new Map(prev);

        if (updateCheckState.has(key)) {
          updateCheckState.delete(key);
        } else {
          updateCheckState.set(key, customValue ?? (true as CheckValueType));
        }

        return updateCheckState;
      });
    };

    const onShiftCheck = () => {
      if (targetBlockUserSelectElement && idx !== undefined) {
        // shift 기능은, 두개의 조건을 제공하지 않으면 작동하지 않는다.(targetElement는 훅 자체 param, idx는 체크박스 핸들러에서 배정)
        // idx = null | number

        // 1. 만약 기존에 체크했음을 기록한 인덱스가 없거나(null) 기존과 동일한 대상을 눌렀을 경우 = 그냥 해당 대상만 체크관리.
        if (lastSelectedIdx.current === null || lastSelectedIdx.current === idx) {
          return onSingleCheck();
        }

        // 2. 만약 기존에 체크했던 기록 인덱스가 있으면서 기존과 다른 대상을 눌렀을 경우
        const findTargetDataRange = (lastSelectedIdx: number) => {
          const startIndex = Math.min(lastSelectedIdx, idx);
          const endIndex = Math.max(lastSelectedIdx, idx);
          return data?.slice(startIndex, endIndex + 1) ?? [];
        };

        const controlAllDataRangeCheckState = (action: 'check' | 'delete') => {
          const dataRange = findTargetDataRange(lastSelectedIdx.current as number);

          setCheckState((prev) => {
            const updateCheckState = new Map(prev);

            dataRange?.forEach((d) => {
              const key = (d as { [key: string]: any })[keyPropertyName];

              if (action === 'check') {
                dataFormatter
                  ? updateCheckState.set(key, dataFormatter(d))
                  : updateCheckState.set(key, true as CheckValueType);
              }

              if (action === 'delete') {
                updateCheckState.delete(key);
              }
            });

            return updateCheckState;
          });
        };

        const findNotCheckedData = () => {
          const dataRange = findTargetDataRange(lastSelectedIdx.current as number);

          for (const d of dataRange) {
            const key = (d as { [key: string]: any })[keyPropertyName];

            if (!checkState.has(key)) {
              return true;
            }
          }

          return false;
        };

        /// a. 체크하려 했던 타겟 대상이 체크가 안되어있었으면 기록된 인덱스와 타겟 대상 사이의 모든 데이터를 다 체크상태로 바꾼다
        if (!checkState.has(key)) {
          controlAllDataRangeCheckState('check');
        } else {
          /// b. 만약 체크하려고 했던 타겟 대상이 체크가 되어있었다면
          // 기록된 인덱스와 타겟 대상 사이의 모든 데이터를 순회하여 = 하나라도 체크가 안되어있었으면, 데이터 범위를 다 체크상태로 바꾼다
          // 만약 다 체크되어있던 상태였으면, 전부 다 체크 해제한다.
          const isExistNotCheckedData = findNotCheckedData();

          if (isExistNotCheckedData) {
            controlAllDataRangeCheckState('check');
          } else {
            controlAllDataRangeCheckState('delete');
          }
        }
      }
    };

    isShiftPressed ? onShiftCheck() : onSingleCheck();
    lastSelectedIdx.current = idx ?? null;
  };

  const onAllCheck = ({
    e,
    customUpdateDataSet,
    checkingTarget,
  }: OnAllCheckParams<CheckValueType>) => {
    const fetchedData = data;

    if (!fetchedData) return;

    if (!e.target.checked) {
      return onReset();
    }

    const createDataAllCheckedMap = () =>
      new Map(
        (checkingTarget ?? fetchedData).map((eachData: { [key: string]: any }) => {
          const key = findTargetKeyValue(eachData, keyPropertyName);
          return [String(key), true as CheckValueType];
        }),
      );

    setCheckState(customUpdateDataSet ? new Map(customUpdateDataSet) : createDataAllCheckedMap());
  };

  const onReset = () => setCheckState(new Map());

  const isAllChecked = (datalist?: DataType[]) =>
    !!datalist?.length && checkState.size === datalist?.length;

  const getFlattenedCheckState = () => [...checkState.values()]; // selected list array

  const compareCheckWithData = <Data extends { [key: string]: any }>(
    params?: CompareCheckWithDataParams<Data>,
  ) => {
    const { comparisonData } = params ?? {};
    const targetComparisonData = comparisonData ?? (data as unknown as Data[]);

    const compareTargetList =
      (targetComparisonData?.map((d) => d[keyPropertyName as keyof Data]) as string[]) ?? [];

    const dataChecked = [] as string[];
    const restChecked = [] as string[];

    checkState.forEach((_, key) => {
      if (compareTargetList?.includes(key)) {
        dataChecked.push(key);
      } else {
        restChecked.push(key);
      }
    });

    return { dataChecked, restChecked };
  };

  //hook ///////////////////////////////////////////////////////////////////////////////
  useHandleShiftEvent(shiftPressedState);
  //hook ///////////////////////////////////////////////////////////////////////////////

  return {
    onCheck,
    onAllCheck,
    onReset,

    isAllChecked,
    checkState,
    setCheckState,

    getFlattenedCheckState,
    compareCheckWithData,
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useHandleShiftEvent = ([_, setIsShiftPressed]: ReturnType<typeof useState<boolean>>) => {
  useEffect(() => {
    const onShiftControl = (e: KeyboardEvent) => {
      const onControlTargetUserSelect = (select: 'none' | 'initial') => {
        document.body.style.userSelect = select;
      };

      if (e.shiftKey) {
        setIsShiftPressed(true);
        onControlTargetUserSelect('none');
      } else {
        setIsShiftPressed(false);
        onControlTargetUserSelect('initial');
      }
    };

    const onShiftEventListener = (type: 'add' | 'remove') => {
      const method = type === 'add' ? window.addEventListener : window.removeEventListener;

      method('keydown', onShiftControl);
      method('keyup', onShiftControl);
    };

    onShiftEventListener('add');
    return () => onShiftEventListener('remove');
  }, []);
};
