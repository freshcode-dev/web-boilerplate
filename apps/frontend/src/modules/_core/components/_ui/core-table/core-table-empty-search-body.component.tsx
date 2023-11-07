import React, { FC } from "react";
import { CoreTableEmptyBody } from "./core-table-empty-body.component";
import { useTranslation } from "react-i18next";
import { SearchLarge } from "../../../constants/icons.constants";

interface CoreTableEmptyBodyProps {
	label?: string | null;
	description?: string | null;
}

export const CoreTableEmptySearchBody: FC<CoreTableEmptyBodyProps> = (props) => {
	const { label, description } = props;
	const { t } = useTranslation();

	return (
		<CoreTableEmptyBody
			icon={<SearchLarge />}
			label={label ?? t('table.empty-search-title')}
			description={description ?? t('table.empty-search-description')}
			descriptionSx={{ maxWidth: 510 }}
		/>
	);
};
