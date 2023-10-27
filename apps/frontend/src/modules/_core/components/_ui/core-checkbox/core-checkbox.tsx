import { styled } from "@mui/material/styles";
import { ComponentProps } from "react";
import Checkbox from "@mui/material/Checkbox";
import { StyledComponent } from '@emotion/styled';

export type CoreCheckboxProps = ComponentProps<typeof Checkbox> & {
    customStyle?: string;
};

export const CoreCheckbox: StyledComponent<CoreCheckboxProps> = styled(Checkbox)((props: CoreCheckboxProps) => ({
    ...props
}));

