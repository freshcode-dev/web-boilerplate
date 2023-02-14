import { styled } from "@mui/material/styles";
import { ComponentProps } from "react";
import TextField from "@mui/material/TextField";

export type CoreTextFieldProps = ComponentProps<typeof TextField> & {
    customStyle?: string;
};

export const CoreTextField = styled(TextField)((props: CoreTextFieldProps) => ({
    variant: 'outlined',
    border: '1px solid #9DD9F3;',
    ...props
}));

