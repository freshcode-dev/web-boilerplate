import { FC, PropsWithChildren } from 'react';
import ModalProvider from 'mui-modal-provider';

export const AreaProviders: FC<PropsWithChildren> = ({ children }) => <ModalProvider>{children}</ModalProvider>;
