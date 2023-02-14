import React from 'react';
import { styled, Box, Grid, TextField, Button, MenuItem, FormControlLabel, Switch, Checkbox, FormControl, InputLabel, Select } from '@mui/material';

const FormContainerBox = styled(Box)({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	width: '100%',
	height: '100%',
	backgroundColor: '#f0f0f0',
});

const FormModalBox = styled(Box)({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	width: 480,
	minHeight: 480,
	padding: 16,
	margin: 16,
	backgroundColor: '#ffffff',
	borderRadius: 8,
});

const ButtonsContainerBox = styled(Box)({
	alignSelf: 'flex-end',
})

const TextFieldRedBorder = styled(TextField)({
	'.MuiOutlinedInput-notchedOutline': {
		borderColor: 'red',
		borderWidth: '3px',
	}
});

const TexFieldOrangeLabel = styled(TextField)({
	'.MuiFormLabel-root': {
		color: 'orange',
		fontWeight: 'bold',
	},
});

const TextFieldFocusedGreenBorder = styled(TextField)({
	'.Mui-focused > .MuiOutlinedInput-notchedOutline': {
		borderColor: 'green',
		borderWidth: '3px',
	}
});

const SelectBlueSelectedValue = styled(Select)({
	color: 'blue',
	fontWeight: 'bold',
	'li.Mui-selected': {
		color: 'blue',
		fontWeight: 'bold',
	}
})

export const FormStyledComponent = () => (
	<FormContainerBox>
		<FormModalBox>
			<Grid component='form' container spacing={1}>
				<Grid item xs={6}>
					<TextFieldRedBorder fullWidth label="Text field" />
				</Grid>
				<Grid item xs={6}>
					<TexFieldOrangeLabel fullWidth label="Number field" type='number' />
				</Grid>
				<Grid item xs={12}>
					<TextFieldFocusedGreenBorder fullWidth label="Wide field (try to focus)" />
				</Grid>
				<Grid item xs={6}>
					<FormControl fullWidth>
						<InputLabel id="select-label-id">Select</InputLabel>
						<SelectBlueSelectedValue labelId="select-label-id"
																		 MenuProps={{
																			 disablePortal: true // There is no way to use styled() over Menu when it's rendered using portal
																		 }}>
							<MenuItem value={1}>Option 1</MenuItem>
							<MenuItem value={2}>Option 2</MenuItem>
							<MenuItem value={3}>Option 3</MenuItem>
						</SelectBlueSelectedValue>
					</FormControl>
				</Grid>
				<Grid item xs={6}>
					<TextField fullWidth label="Disabled field" disabled />
				</Grid>
				<Grid item xs={12}>
					<FormControlLabel control={<Switch />} label="Switch" />
				</Grid>
				<Grid item xs={12} display="flex" justifyContent="end">
					<FormControlLabel control={<Checkbox />} label="Checkbox" labelPlacement="start" />
				</Grid>
			</Grid>
			<ButtonsContainerBox>
				<Button color='error'>Cancel</Button>
				<Button type='submit'>Submit</Button>
			</ButtonsContainerBox>
		</FormModalBox>
	</FormContainerBox>
);

export default FormStyledComponent;
