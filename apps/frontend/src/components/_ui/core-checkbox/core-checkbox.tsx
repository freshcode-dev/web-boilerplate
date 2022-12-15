import { styled } from "@mui/material/styles";
import { ComponentProps } from "react";
import Checkbox from "@mui/material/Checkbox";

export type CoreCheckboxProps = ComponentProps<typeof Checkbox> & {
    customStyle?: string;
};

export const CoreCheckbox = styled(Checkbox)((props: CoreCheckboxProps) => ({
    ...props
}));

