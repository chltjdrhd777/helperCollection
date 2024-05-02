import React from 'react';
import { useHandleShiftEvent } from './useHandleShiftEvent';
import { OnCheckParams, UseCheckboxParams } from '..';

interface OnShiftCheckParams<DataType, CheckValueType>
	extends UseCheckboxParams<DataType, CheckValueType>,
		OnCheckParams<CheckValueType> {
	checkState: Map<string, CheckValueType>;
	setCheckState: React.Dispatch<React.SetStateAction<Map<string, CheckValueType>>>;
	onSingleCheck: () => void;
}

export default function useShiftCheck() {
	const lastSelectedIdx = React.useRef<number | null>(null);
	const shiftPressedState = React.useState<boolean | undefined>(false);

	useHandleShiftEvent(shiftPressedState);

	const onShiftCheck = <DataType, CheckValueType>({
		targetBlockUserSelectElement,
		idx,
		onSingleCheck,
		data,

		checkState,
		setCheckState,

		key,
		keyPropertyName,
		dataFormatter,
	}: OnShiftCheckParams<DataType, CheckValueType>) => {
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

				setCheckState(prev => {
					const updateCheckState = new Map(prev);

					dataRange?.forEach(d => {
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

	return {
		lastSelectedIdx,
		shiftPressedState,
		onShiftCheck,
	};
}
