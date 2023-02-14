import { styled } from "@mui/material/styles";
import { ComponentProps } from "react";
import Button from "@mui/material/Button";

export type CoreButtonProps = ComponentProps<typeof Button> & {
    customStyle?: string;
};

export const CoreButton = styled(Button)((props: CoreButtonProps) => ({
    borderRadius: '6px',
    backgroundColor: '#1677ff',
    color: '#fff',
    '&:hover ': {
        border: '1px solid #1677ff;',
        backgroundColor: '##fff',
        color: '#1677ff'
    },
    ...props,
}));

