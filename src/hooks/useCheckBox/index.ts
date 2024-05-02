import * as React from 'react';

import { findTargetKeyValue } from '@/utils/findTargetKeyValue';

import useShiftCheck from './hooks/useShiftCheck';

export interface UseCheckboxParams<DataType, CheckValueType> {
	data?: DataType[];
	keyPropertyName: string; // 데이터의 어떤 프로퍼티 키를 Map에 키로 설정할 것인지
	externalState?: [
		state: Map<string, CheckValueType>,
		dispatcher: React.Dispatch<React.SetStateAction<Map<string, CheckValueType>>>,
	];
	targetBlockUserSelectElement?: HTMLElement | null;
}

export interface OnCheckParams<CheckValueType> {
	key: string;
	customValue?: CheckValueType;
	idx?: number; // shift click의 위치 기록용
	dataFormatter?: (data: any) => any;
}

export interface OnAllCheckParams<CheckValueType> {
	e: React.ChangeEvent<HTMLInputElement>;
	customUpdateDataSet?: [string, CheckValueType][]; // 만약 checkState에 boolean 이외의 값을 등록시키고 싶을 경우 사용한다.
	checkingTarget?: any[]; // 만약 react-form의 useFieldArray처럼 체크상태 업데이트를 위한 대상 데이터셋이 유동적으로 변경될 경우 사용한다.
}

export interface CompareCheckWithDataParams<Data> {
	comparisonData?: Data[]; // 비교 대상이 되는 데이터 타입이다(ex, 서버데이터)
}

export default function useCheckbox<
	DataType,
	CheckValueType extends boolean | { [key: string]: any },
>(checkboxParams: UseCheckboxParams<DataType, CheckValueType>) {
	const { data, keyPropertyName, externalState } = checkboxParams;

	const defaultState = React.useState(new Map<string, CheckValueType>());
	const [checkState, setCheckState] = externalState ?? defaultState;

	const { lastSelectedIdx, shiftPressedState, onShiftCheck } = useShiftCheck();

	/**
	 * methods
	 */
	function onCheck(onCheckParams: OnCheckParams<CheckValueType>) {
		const { key, customValue, idx } = onCheckParams;
		const [isShiftPressed] = shiftPressedState;

		const onSingleCheck = () => {
			setCheckState(prev => {
				const updateCheckState = new Map(prev);

				if (updateCheckState.has(key)) {
					updateCheckState.delete(key);
				} else {
					updateCheckState.set(key, customValue ?? (true as CheckValueType));
				}

				return updateCheckState;
			});
		};

		const onShiftPressed = () =>
			onShiftCheck({
				...checkboxParams,
				...onCheckParams,
				checkState,
				setCheckState,
				onSingleCheck,
			});

		isShiftPressed ? onShiftPressed() : onSingleCheck();
		lastSelectedIdx.current = idx ?? null;
	}

	function onAllCheck({
		e,
		customUpdateDataSet,
		checkingTarget,
	}: OnAllCheckParams<CheckValueType>) {
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
	}

	function onReset() {
		setCheckState(new Map());
	}

	function isAllChecked(datalist?: DataType[]) {
		return !!datalist?.length && checkState.size === datalist?.length;
	}

	function getFlattenedCheckState() {
		return [...checkState.values()];
	}

	function compareCheckWithData<Data extends { [key: string]: any }>(
		params?: CompareCheckWithDataParams<Data>,
	) {
		const { comparisonData } = params ?? {};
		const targetComparisonData = comparisonData ?? (data as unknown as Data[]);

		const compareTargetList =
			(targetComparisonData?.map(d => d[keyPropertyName as keyof Data]) as string[]) ?? [];

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
	}

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
