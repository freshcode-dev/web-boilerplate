import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useCurrentAccessTokenSelector } from "../../store/session.slice";

export const RequireUnauthorized = ({ children }: { children: JSX.Element }): ReactElement => {
  const currentToken = useCurrentAccessTokenSelector();

  if (currentToken) {
    return (
			<Navigate
				to={'/'}
				replace
			/>
		);
  }

  return children;
};
