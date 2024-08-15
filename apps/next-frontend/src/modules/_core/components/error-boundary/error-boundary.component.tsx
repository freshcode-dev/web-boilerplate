import React, { ErrorInfo, PropsWithChildren } from 'react';
// import * as Sentry from '@sentry/react';

interface State {
	hasError: boolean;
	retryCount: number;
}

export class ErrorBoundary extends React.Component<PropsWithChildren, State> {
	private maxRetries: number;
	private retryInterval: number;

	constructor(props: PropsWithChildren) {
		super(props);
		this.state = { hasError: false, retryCount: 0 };

		this.maxRetries = 3;
		this.retryInterval = 3000;
	}

	static getDerivedStateFromError() {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error(error, errorInfo);
		// Sentry.captureException(error, { extra: { errorInfo } });

		if (this.state.retryCount < this.maxRetries) {
			setTimeout(this.handleRetry, this.retryInterval);
		}
	}

	handleRetry = () => {
		this.setState((prevState) => ({
			hasError: false,
			retryCount: prevState.retryCount + 1,
		}));
	};

	override render() {
		if (this.state.hasError) {
			if (this.state.retryCount < this.maxRetries) {
				return <h1>Oops... Something went wrong. Retrying...</h1>;
			} else {
				return <h1>Oops... Something went wrong.</h1>;
			}
		}

		return this.props.children;
	}
}
