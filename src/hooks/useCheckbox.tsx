import React, { useEffect, useRef, useState } from 'react';
import { findTargetKeyValue } from 'utils/findTargetKeyValue';

interface UseCheckboxParams<DataType, CheckValueType> {
  data?: DataType[];
  keyPropertyName: string; // 데이터의 어떤 프로퍼티 키를 Map에 키로 설정할 것인지
  externalState?: [
    state: Map<string, CheckValueType>,
    dispatcher: React.Dispatch<React.SetStateAction<Map<string, CheckValueType>>>,
  ];
  targetBlockUserSelectElement?: HTMLElement | null;
}
export default function useCheckbox<DataType, CheckValueType extends boolean | { [key: string]: any }>({
  data,
  keyPropertyName,
  externalState,
  targetBlockUserSelectElement,
}: UseCheckboxParams<DataType, CheckValueType>) {
  const defaultState = useState(new Map<string, CheckValueType>());
  const [checkState, setCheckState] = externalState ?? defaultState;

  const lastSelectedIdx = useRef<number | null>(null);
  const shiftPressdState = useState<boolean | undefined>(false);

  const handleCheck = ({
    key,
    customValue,
    idx,
    dataFormatter,
  }: {
    key: string;
    customValue?: CheckValueType;
    idx?: number;
    dataFormatter?: (data: any) => any;
  }) => {
    const [isShiftPressed] = shiftPressdState;

    const onSingleCheck = () =>
      setCheckState((prev) => {
        const updateCheckState = new Map(prev);

        if (updateCheckState.has(key)) {
          updateCheckState.delete(key);
        } else {
          updateCheckState.set(key, customValue ?? (true as CheckValueType));
        }

        return updateCheckState;
      });

    const onShiftCheck = () => {
      if (targetBlockUserSelectElement && idx !== undefined) {
        //shift 기능은, 두개의 조건을 제공하지 않으면 작동하지 않는다.(targetElement는 훅 자체 param, idx는 체크박스 핸들러에서 배정)
        // idx = null | number

        //1. 만약 기존에 체크했음을 기록한 인덱스가 없거나(null) 기존과 동일한 대상을 눌렀을 경우 = 그냥 해당 대상만 체크관리.
        if (lastSelectedIdx.current === null || lastSelectedIdx.current === idx) {
          return onSingleCheck();
        }

        //2. 만약 기존에 체크했던 기록 인덱스가 있으면서 기존과 다른 대상을 눌렀을 경우
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

        const checkNotCheckedData = () => {
          const dataRange = findTargetDataRange(lastSelectedIdx.current as number);

          for (let d of dataRange) {
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
          const isExistNotCheckedData = checkNotCheckedData();

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

  const handleResetCheck = () => setCheckState(new Map());

  const handleAllCheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    customDataSet?: [string, CheckValueType][],
    newData?: any, // useFieldArray처럼 데이터넷이 유동적으로 늘어나는 대상을 위해 사용된다.
  ) => {
    if (!data) return;

    if (e.target.checked) {
      customDataSet
        ? setCheckState(new Map(customDataSet))
        : setCheckState(
            new Map(
              (newData ?? data).map((eachData: any) => {
                const key = findTargetKeyValue(eachData, keyPropertyName);
                return [String(key), true as CheckValueType];
              }),
            ),
          );
    } else {
      handleResetCheck();
    }
  };

  const isAllChecked = (datalist?: DataType[]) => !!datalist?.length && checkState.size === datalist?.length;

  const getFlattenedCheckState = () => [...checkState.values()]; // selected list array

  /**
   * Effect
   */
  useHandleShiftEvent(shiftPressdState);

  return {
    isAllChecked,
    checkState,
    setCheckState,
    handleResetCheck,
    handleAllCheck,
    handleCheck,
    getFlattenedCheckState,
  };
}

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
