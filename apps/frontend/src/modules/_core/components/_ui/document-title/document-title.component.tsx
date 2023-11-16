import React from "react";
import { Helmet } from "react-helmet-async";
import { usePageTitle } from "../../../hooks/use-page-title.hook";

export const DocumentTitle = () => {
	const title = usePageTitle();

	return (
		<Helmet title={title} />
	);
};
