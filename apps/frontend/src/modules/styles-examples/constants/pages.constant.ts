import React from 'react';
import { StylesExamplesTabsEnum } from 'apps/frontend/src/modules/styles-examples/pages/styles-examples/styles-examples.types';
import FormSxComponent from 'apps/frontend/src/modules/styles-examples/components/form-sx/form-sx.component';
import FormStyledComponent from 'apps/frontend/src/modules/styles-examples/components/form-styled/form-styled.component';
import FormScssComponent from 'apps/frontend/src/modules/styles-examples/components/form-scss/form-scss.component';

export const STYLES_EXAMPLES_TABS: Array<{ id: StylesExamplesTabsEnum, title: string, component: React.ElementType }> = [
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
]
