import { Cell, flexRender, RowData } from "@tanstack/react-table";
import { CoreTableOverflowWrapper } from "./core-table-overflow-wrapper.component";
import { CoreTableCell } from "./core-table-cell.component";
import React, { useCallback, useRef, useState } from "react";
import { Meta } from "./core-table-virtual-row.component";
import { CoreTooltip } from "../core-tooltip/core-tooltip.component";
import TooltipTransition from "./tooltip-transition.component";
import { TransitionProps } from "@mui/material/transitions";

interface CoreTableCellWithTooltipProps<TData extends RowData> {
	cell: Cell<TData, unknown>;
}

const CoreTableCellWithTooltip = <TData extends RowData>(props: CoreTableCellWithTooltipProps<TData>) => {
	const { cell } = props;

	const overflowWrapper = useRef<HTMLDivElement | null>(null);
	const [tooltipTitle, setTooltipTitle] = useState<string | null>(null);

	const meta = cell.column.columnDef.meta as (Meta | undefined);
	const { flex, heightAuto, useCustomOverflowContainer } = meta ?? {};
	const size = cell.column.getSize();

	const handleMouseEnter = useCallback(() => {
		const { current } = overflowWrapper;

		if (!current) {
			return;
		}

		let container: HTMLElement | null;

		if (!useCustomOverflowContainer) {
			container = current;
		} else {
			container = current.querySelector('[data-overflow=true]');
		}

		if (!container) {
			return;
		}

		const { scrollWidth, offsetWidth, childNodes } = container;
		const isOverflowed = scrollWidth > offsetWidth;

		if (!isOverflowed
			|| childNodes.length !== 1
			|| childNodes[0].nodeType !== Node.TEXT_NODE) {
			return;
		}

		const { textContent } = childNodes[0];

		setTooltipTitle(textContent);
	}, [useCustomOverflowContainer]);

	const handleExited = useCallback(() => {
		setTooltipTitle(null);
	}, []);

	return (
		<CoreTooltip
			TransitionComponent={TooltipTransition}
			TransitionProps={{
				onTooltipTransitionEnd: handleExited
			} as TransitionProps}
			title={tooltipTitle}
			arrow
			sx={{
				color: 'initial',
				'&:hover': {
					color: 'initial'
				}
			}}
			placement="top"
		>
			<CoreTableCell
				onMouseEnter={handleMouseEnter}
				flex={flex}
				heightAuto={heightAuto}
				size={size}
			>
				<CoreTableOverflowWrapper ref={overflowWrapper}>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</CoreTableOverflowWrapper>
			</CoreTableCell>
		</CoreTooltip>
	);
};

export default CoreTableCellWithTooltip;
