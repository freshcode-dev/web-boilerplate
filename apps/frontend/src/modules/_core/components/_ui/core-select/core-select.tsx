import { styled } from '@mui/material/styles';
import { ComponentProps, FC } from 'react';
import Select from '@mui/material/Select';

export type CoreSelectProps = ComponentProps<typeof Select> & {
    customStyle?: string;
};

export const CoreSelect: FC<CoreSelectProps> = styled(Select)((props: CoreSelectProps) => ({
    width: '100px;',
    color: 'red;',
    '& > div ': {
        border: '1px solid #1677ff;'
    },
    ...props
}));
