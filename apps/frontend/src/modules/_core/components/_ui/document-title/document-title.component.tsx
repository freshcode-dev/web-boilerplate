import React from "react";
import { Helmet } from "react-helmet-async";
import { usePageTitle } from "../../../hooks/use-page-title.hook";

const DocumentTitle = () => {
	const title = usePageTitle();

	return (
		<Helmet title={title} />
	);
};

export default DocumentTitle;
