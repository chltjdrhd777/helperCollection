import * as React from 'react';

export const useHandleShiftEvent = ([, setIsShiftPressed]: ReturnType<
	typeof React.useState<boolean>
>) => {
	React.useEffect(() => {
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
