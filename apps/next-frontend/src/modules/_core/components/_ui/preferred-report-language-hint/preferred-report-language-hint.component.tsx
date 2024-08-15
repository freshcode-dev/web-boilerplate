import React from "react";
import { useTranslation } from "next-i18next";
import { Link } from "@mui/material";

const PreferredReportLanguageHint = () => {
	const [t] = useTranslation();

	return (
		<span>
			{t('preferred-report-lang.hint')}
			<Link
				href="https://drive.google.com/drive/u/0/folders/1RFvPTwxydLADr4KlQSs-K62kgmqZW_H0"
				target="_blank"
				sx={{
					color: theme => theme.colors.orange,
					textDecorationColor: theme => theme.colors.orange,
				}}
			>
				{t('preferred-report-lang.hint-link')}
			</Link>
		</span>
	);
};

export default PreferredReportLanguageHint;
