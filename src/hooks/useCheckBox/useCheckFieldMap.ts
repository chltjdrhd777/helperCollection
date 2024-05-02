import { useState } from 'react';
import { findTargetKeyValue } from '@/utils/findTargetKeyValue';

interface UseCheckboxMapProps<DataType, CheckValueType> {
	identifier: string; // 어떤 카테고리를 기준으로 체크상태를 그룹핑할지 정한다.
	data?: DataType[];
	keyPropertyName: string; // 데이터의 어떤 프로퍼티 키를 Map에 키로 설정할 것인지
	externalState?: [
		state: Map<string, CheckValueType>,
		dispatcher: React.Dispatch<React.SetStateAction<Map<string, CheckValueType>>>,
	];
}
type UseCheckBoxMapInnerMapType = Map<string, boolean | { [key: string]: any }>;

export function useCheckFieldMap<DataType, CheckValueType extends UseCheckBoxMapInnerMapType>({
	identifier,
	data,
	keyPropertyName,
	externalState,
}: UseCheckboxMapProps<DataType, CheckValueType>) {
	const defaultState = useState(new Map<string, CheckValueType>());
	const [checkState, setCheckState] = externalState ?? defaultState;

	const handleCheck = (key: string, customValue?: { [key: string]: any }) => {
		setCheckState(prev => {
			const updateCheckState = new Map(prev);

			if (updateCheckState.has(identifier)) {
				// 기존에 identifier가 있는 경우
				const innerMap = updateCheckState.get(identifier) as CheckValueType;

				if (innerMap.has(key)) {
					innerMap.delete(key);
				} else {
					innerMap.set(key, customValue ?? true);
				}
			} else {
				// identifier가 없는 경우
				updateCheckState.set(identifier, new Map([[key, customValue ?? true]]) as CheckValueType);
			}

			return updateCheckState;
		});
	};

	const handleResetCheck = () =>
		setCheckState(prev => {
			const updateCheckState = new Map(prev);

			if (updateCheckState.has(identifier)) {
				updateCheckState.delete(identifier);
			}

			return updateCheckState;
		});

	const handleTotalClear = () => {
		setCheckState(new Map());
	};

	const handleAllCheck = (
		e: React.ChangeEvent<HTMLInputElement>,
		customDataSet?: [string, boolean | { [key: string]: any }][], // 전체선택 시, 이미 변환이 완료되어 들어가는 데이터셋이다.
		newData?: any, // useFieldArray처럼 데이터넷이 유동적으로 늘어나는 대상을 위해 사용된다.
	) => {
		if (!data) return;

		if (e.target.checked) {
			customDataSet ? setCustomCheckStateData() : setBooleanCheckStateData();
		} else {
			handleResetCheck();
		}

		function setCustomCheckStateData() {
			setCheckState(prev => {
				const updateCheckState = new Map(prev);

				updateCheckState.set(identifier, new Map(customDataSet) as CheckValueType);

				return updateCheckState;
			});
		}

		function setBooleanCheckStateData() {
			setCheckState(prev => {
				const updateCheckState = new Map(prev);

				const allCheckedMap = new Map<string, boolean>(
					(newData ?? data).map((eachData: any) => {
						const key = findTargetKeyValue(eachData, keyPropertyName);
						return [String(key), true];
					}),
				);

				updateCheckState.set(identifier, allCheckedMap as CheckValueType);

				return updateCheckState;
			});
		}
	};

	const isAllChecked = (datalist?: DataType[]) =>
		!!datalist?.length && checkState.get(identifier)?.size === datalist?.length;

	const getFlattenedCheckState = () =>
		[...checkState.values()].map(Map => [...Map.values()]).flat() as any;

	return {
		getFlattenedCheckState,
		checkState,
		handleAllCheck,
		handleCheck,
		handleResetCheck,
		handleTotalClear,
		isAllChecked,
	};
}
