import React, { ElementType, FC, forwardRef, useRef } from "react";
import { CoreFormControlProps, CoreFormControl } from "../core-form-control";
import { InputBaseProps, Select, SelectProps, SxProps, Theme } from "@mui/material";
import { selectPaperStyles } from "./core-select.styles";
import { DropdownArrow } from "./dropdown-arrow.component";
import { CoreInput, CoreInputProps } from "../core-input";

export interface CoreSelectProps extends CoreFormControlProps, InputBaseProps, CoreInputProps {
	SelectProps?: SelectProps;
	IconComponent?: ElementType;
	disableIconRotate?: boolean;
	iconSize?: number;
	paperSx?: SxProps<Theme>;
	fitMenuWidth?: boolean;
	menuMinWidth?: number;
	onClose?(): void;
}

export const CoreSelect: FC<CoreSelectProps> = forwardRef((props, ref) => {
	const {
		menuMinWidth,
		children,
		focused,
		helperText,
		error,
		small,
		controlSx,
		SelectProps,
		disabled,
		fullWidth,
		label,
		labelHint,
		requiredMark,
		id,
		IconComponent,
		disableIconRotate,
		iconSize = 16,
		onClose,
		paperSx,
		fitMenuWidth,
		...inputProps
	} = props;

	const selectContainerRef = useRef<HTMLDivElement | null>(null);
	const offsetWidth = selectContainerRef.current?.offsetWidth;

	const inputHeight = small ? 36 : 48;

	return (
		<CoreFormControl
			label={label}
			labelHint={labelHint}
			id={id}
			requiredMark={requiredMark}
			fullWidth={fullWidth}
			focused={focused}
			controlSx={controlSx}
			helperText={helperText}
			error={error}
			disabled={disabled}
		>
			<Select
				{...SelectProps}
				ref={selectContainerRef}
				sx={{
					'& .MuiSelect-icon': {
						right: small ? 12 : 16,
						top: (inputHeight - iconSize) / 2,
						transform: disableIconRotate ? 'none' : undefined
					}
				}}
				MenuProps={{
					...SelectProps?.MenuProps,
					TransitionProps: {
						onExited: onClose
					},
					PaperProps: {
						sx: [
							{
								width: fitMenuWidth
									? (menuMinWidth ?? 0) > (offsetWidth ?? 0) ? menuMinWidth : offsetWidth
									: undefined
							},
							...(Array.isArray(selectPaperStyles)
								? selectPaperStyles
								: [selectPaperStyles]),
							...(Array.isArray(paperSx)
								? paperSx
								: [paperSx])
						]
					}
				}}
				SelectDisplayProps={{
					style: { paddingRight: small ? 40 : 44 }
				}}
				IconComponent={IconComponent ?? DropdownArrow}
				input={(
					<CoreInput
						{...inputProps}
						ref={ref}
						small={small}
						id={id}
					/>
				)}
			>
				{children}
			</Select>
		</CoreFormControl>
	);
});
