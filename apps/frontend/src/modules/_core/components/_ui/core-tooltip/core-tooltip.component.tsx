import { styled } from "@mui/material/styles";
import { Tooltip, TooltipProps } from "@mui/material";
import { StyledComponent } from "@emotion/styled";

interface OffsetProps {
	placement: NonNullable<TooltipProps['placement']>;
}

const modifiers = [
	{
		name: 'offset',
		options: {
			offset: ({ placement }: OffsetProps) => {
				if (placement === 'top-start') {
					return [-16, -3];
				}

				if (placement === 'top-end') {
					return [16, -3];
				}

				return [];
			}
		},
	}
];

export const CoreTooltip: StyledComponent<TooltipProps> = styled((props: TooltipProps) => (
	<Tooltip
		{...props}
		enterTouchDelay={0}
		onClick={(e) => {
			e.stopPropagation();
			e.preventDefault();
		}}
		classes={{ popper: props.className }}
		PopperProps={{ modifiers }}
	/>
))(({ theme }) => ({
	color: theme.colors.gray,
	transition: theme.transitions.create('color', {
		duration: theme.transitions.duration.short
	}),

	'&:hover': {
		color: theme.colors.blue
	},

	'& .MuiTooltip-arrow': {
		color: theme.colors.black
	},

	'& .MuiTooltip-tooltip': {
		...theme.typography.label,
		borderRadius: 8,
		color: theme.colors.white,
		padding: '8.9px 15px',
		backgroundColor: theme.colors.black,
	}
}));

