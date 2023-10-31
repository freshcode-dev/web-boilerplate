import React, { useCallback, HTMLAttributes, useState, useMemo } from "react";
import {
	Autocomplete,
	AutocompleteRenderInputParams,
	AutocompleteRenderOptionState,
	useTheme,
	AutocompleteRenderGetTagProps,
	AutocompleteProps,
	AutocompleteValue,
	SxProps,
	Theme
} from "@mui/material";
import { CoreTextField, CoreTextFieldProps } from "../core-textfield/core-textfield.component";
import { Option } from "./core-autocomplete.types";
import { coreAutocompleteStyles } from "./core-autocomplete.styles";
import { selectPaperStyles } from "../core-select/core-select.styles";
import { Close, DropdownArrow } from "../../../constants/icons.constants";
import { CoreSelectMenuItem } from "../core-select/core-select-menu-item.component";
import { useTranslation } from "react-i18next";
import { FadeSpinner } from "../fade-spinner/fade-spinner.component";
import { CoreAutocompleteChip } from "./core-autocomplete-chip.component";
import { difference, flatten } from "lodash";

type TextFieldProps = Pick<CoreTextFieldProps,
		'disabled'
	| 'fullWidth'
	| 'label'
	| 'helperText'
	| 'error'
	| 'controlSx'
	| 'placeholder'
	| 'requiredMark'
	| 'id'>;

interface CoreAutocompleteProps<
	Multiple extends boolean | undefined,
	DisableClearable extends boolean | undefined,
> extends
	TextFieldProps,
	Pick<AutocompleteProps<Option, Multiple, DisableClearable, false>,
		'value'
		| 'onChange'
		| 'multiple'
		| 'disableClearable'
		| 'disableCloseOnSelect'
		| 'loading'
	> {
	sx?: SxProps<Theme>;
	options: Option[];
	allOption?: Option;
	onBlur?(): void;
	onOpen?(): void;
}

const CoreAutocomplete = <
	Multiple extends boolean | undefined,
	DisableClearable extends boolean | undefined,
>(props: CoreAutocompleteProps<Multiple, DisableClearable>) => {
	const {
		sx,
		onBlur,
		options,
		allOption,
		disabled,
		fullWidth,
		label,
		helperText,
		error,
		controlSx,
		placeholder,
		id,
		loading,
		disableClearable,
		onOpen,
		multiple,
		onChange,
		disableCloseOnSelect,
		value,
		requiredMark
	} = props;

	const [open, setOpen] = useState(false);
	const { t } = useTranslation();
	const theme = useTheme();

	const extendedOptions = useMemo(() => [
		...allOption ? [allOption] : [],
		...options,
	], [allOption, options]);

	const allOptionsSelected = useMemo(() => (
		difference(
			options.map(x => x.value),
			flatten(value ? [value] : []).map(x => x.value),
		).length === 0
	), [options, value]);

	const handleAllOptionClick = useCallback((e: React.SyntheticEvent) => {
		if (!multiple) {
			return;
		}

		if (allOptionsSelected) {
			onChange?.(e, [] as Array<Option> as AutocompleteValue<Option, Multiple, DisableClearable, false>, "clear");
		} else {
			onChange?.(e, options as AutocompleteValue<Option, Multiple, DisableClearable, false>, "selectOption");
		}
	}, [allOptionsSelected, options, onChange]);

	const handleOpen = useCallback(() => {
		setOpen(true);
		onOpen?.();
	}, [onOpen]);

	const handleClose = useCallback(() => {
		setOpen(false);
	}, []);

	const renderInput = useCallback((props: AutocompleteRenderInputParams) => {
		const { id, fullWidth, disabled, inputProps, InputProps } = props;

		const { ref, endAdornment, ...wrapperProps } = InputProps;

		return (
			<CoreTextField
				id={id}
				label={label}
				error={error}
				controlSx={controlSx}
				helperText={helperText}
				wrapperRef={ref}
				sx={sx}
				requiredMark={requiredMark}
				placeholder={placeholder}
				inputProps={inputProps}
				fullWidth={fullWidth}
				disabled={disabled}
				endAdornment={(
					<>
						{loading && (
							<FadeSpinner
								size={17}
								height={5}
								width={2}
								borderRadius={1}
								color={theme.colors.black}
							/>
						)}
						{endAdornment}
					</>
				)}
				{...wrapperProps}
			/>
		);
	}, [requiredMark, sx, label, error, controlSx, helperText, placeholder, loading, theme.colors.black]);

	const renderOption = useCallback((
		props: HTMLAttributes<HTMLLIElement>,
		option: Option,
		state: AutocompleteRenderOptionState,
	) => {
		const { selected } = state;
		const { label, value } = option;
		const isAllOption = value === allOption?.value;

		return (
			<CoreSelectMenuItem
				{...props}
				key={value}
				selected={isAllOption ? allOptionsSelected : selected}
				withCheckbox={multiple}
				noWrap
				onClick={isAllOption ? handleAllOptionClick : props.onClick}
			>
				{label}
			</CoreSelectMenuItem>
		);
	}, [multiple, allOptionsSelected, handleAllOptionClick]);

	const renderTag = useCallback((tagValue: Option[], getTagProps: AutocompleteRenderGetTagProps) =>
			tagValue.map((option, index) => (
				<CoreAutocompleteChip
					label={option.label}
					{...getTagProps({ index })}
				/>
			))
		, []);

	const isOptionEqualToValue = useCallback((option: Option, value: Option) => option.value === value.value, []);

  return (
		<Autocomplete
			id={id}
			open={open}
			onBlur={onBlur}
			onOpen={handleOpen}
			value={value}
			isOptionEqualToValue={isOptionEqualToValue}
			multiple={multiple}
			onChange={onChange}
			disableCloseOnSelect={disableCloseOnSelect}
			onClose={handleClose}
			loadingText={t('autocomplete.loading')}
			noOptionsText={t('autocomplete.no-options')}
			disabled={disabled}
			sx={coreAutocompleteStyles}
			fullWidth={fullWidth}
			renderOption={renderOption}
			slotProps={{
				paper: {
					sx: selectPaperStyles
				}
			}}
			renderTags={renderTag}
			renderInput={renderInput}
			options={extendedOptions}
			forcePopupIcon
			disableClearable={disableClearable}
			loading={loading}
			clearIcon={<Close />}
			popupIcon={<DropdownArrow />}
		/>
	);
};

export default CoreAutocomplete;
