import React from 'react';
import { StylesExamplesTabsEnum } from '../pages/styles-examples/styles-examples.types';
import FormSxComponent from '../components/form-sx/form-sx.component';
import FormStyledComponent from '../components/form-styled/form-styled.component';
import FormScssComponent from '../components/form-scss/form-scss.component';

interface ExampleTab {
	id: StylesExamplesTabsEnum;
	title: string;
	component: React.ElementType;
}

export const STYLES_EXAMPLES_TABS: Array<ExampleTab> = [
	{
		id: StylesExamplesTabsEnum.SX_PROPS,
		title: '"sx" props',
		component: FormSxComponent,
	},
	{
		id: StylesExamplesTabsEnum.STYLED_COMPONENTS,
		title: '"styled" components',
		component: FormStyledComponent,
	},
	{
		id: StylesExamplesTabsEnum.SCSS_STYLES,
		title: '"scss" styles',
		component: FormScssComponent,
	},
];
