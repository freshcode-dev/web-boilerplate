import { memo, FC } from "react";
import { MenuOptionDto } from "@boilerplate/shared";

interface MenuOptionCellProps {
	options?: MenuOptionDto[];
	emptyLabel?: string | null;
}

const MenuOptionCell: FC<MenuOptionCellProps> = (props) => {
	const { emptyLabel, options } = props;

	if (!options || options.length === 0) {
		return (
			<>{emptyLabel || '—'}</>
		);
	}

	return (
		<>
			{options
				.map(({ name }) => name)
				.join(', ')}
		</>
	);
};

export default memo(MenuOptionCell);
