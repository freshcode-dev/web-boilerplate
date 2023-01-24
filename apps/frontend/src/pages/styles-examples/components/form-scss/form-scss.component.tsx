import React from 'react';
import { Box, Grid, TextField, Button, MenuItem, FormControlLabel, Switch, Checkbox } from '@mui/material';
import './form-scss.styles.scss';

export const FormScssComponent = () => (
	<Box className="form-container">
		<Box className="form-modal">
			<Grid component='form' container spacing={1}>
				<Grid item xs={6}>
					<TextField fullWidth label="Text field" variant="outlined"
										 InputProps={{ classes: { notchedOutline: 'red-border' } }} />
				</Grid>
				<Grid item xs={6}>
					<TextField fullWidth label="Number field" type='number'
										 InputLabelProps={{ classes: { root: 'orange-text' } }} />
				</Grid>
				<Grid item xs={12}>
					<TextField fullWidth label="Wide field (try to focus)"
										 InputProps={{ classes: { focused: 'input-focused-blue-border' } }}/>
				</Grid>
				<Grid item xs={6}>
					<TextField fullWidth label="Select" select
										 SelectProps={{
											 classes: { select: 'blue-text' },
											 MenuProps: {
												 classes: { list: 'list-with-selected-blue-li' },
											 }
										 }}
					>
						<MenuItem value={1}>Option 1</MenuItem>
						<MenuItem value={2}>Option 2</MenuItem>
						<MenuItem value={3}>Option 3</MenuItem>
					</TextField>
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
			<Box className="form-buttons-container">
				<Button color='error'>Cancel</Button>
				<Button type='submit'>Submit</Button>
			</Box>
		</Box>
	</Box>
);

export default FormScssComponent;
