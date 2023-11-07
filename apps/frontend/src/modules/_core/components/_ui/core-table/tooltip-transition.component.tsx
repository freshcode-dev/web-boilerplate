import { Grow, GrowProps } from "@mui/material";
import { forwardRef, useCallback } from "react";

interface TooltipTransitionProps extends GrowProps {
	onTooltipTransitionEnd?(): void;
}

const TooltipTransition = forwardRef<unknown, TooltipTransitionProps>((props, ref) => {
	const { onExited, onTooltipTransitionEnd, ...growProps } = props;

	const handleExited = useCallback((node: HTMLElement) => {
		onExited?.(node);
		onTooltipTransitionEnd?.();
	}, [onExited, onTooltipTransitionEnd]);

	return (
		<Grow
			{...growProps}
			onExited={handleExited}
			ref={ref}
		/>
	);
});

export default TooltipTransition;
