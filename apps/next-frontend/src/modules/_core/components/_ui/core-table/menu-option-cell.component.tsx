import { memo, FC } from "react";
import { MenuOptionDto } from "@boilerplate/shared";

interface MenuOptionCellProps {
	options?: MenuOptionDto[];
	emptyLabel?: string | null;
}

export const MenuOptionCell: FC<MenuOptionCellProps> = memo((props) => {
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
});
