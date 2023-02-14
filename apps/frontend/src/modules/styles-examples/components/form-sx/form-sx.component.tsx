import React from 'react';
import { Box, Grid, TextField, Button, MenuItem, FormControlLabel, Switch, Checkbox } from '@mui/material';

export const FormSxComponent = () => (
	<Box
		sx={{
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: '100%',
			backgroundColor: '#f0f0f0',
		}}
	>
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				width: 480,
				minHeight: 480,
				p: 2,
				m: 2,
				backgroundColor: '#ffffff',
				borderRadius: 2,
			}}
		>
			<Grid component='form' container spacing={1}>
				<Grid item xs={6}>
					<TextField fullWidth label="Text field"
						 sx={{
							'.MuiOutlinedInput-notchedOutline': {
								borderColor: 'red',
								borderWidth: '3px',
							}
						}}
					/>
				</Grid>
				<Grid item xs={6}>
					<TextField fullWidth label="Number field" type='number'
						sx={{
							'.MuiFormLabel-root': {
								color: 'orange',
								fontWeight: 'bold',
							},
						}}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField fullWidth label="Wide field (try to focus)"
						sx={{
						  '.Mui-focused > .MuiOutlinedInput-notchedOutline': {
							  borderColor: 'green',
								borderWidth: '3px',
						  }
						}}
					/>
				</Grid>
				<Grid item xs={6}>
					<TextField fullWidth label="Select" select
						SelectProps={{
							sx: {
								color: 'blue',
								fontWeight: 'bold',
							},
							MenuProps: {
								sx: {
									'li.Mui-selected': {
										color: 'blue',
										fontWeight: 'bold',
									}
								}
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
			<Box sx={{ alignSelf: 'flex-end' }}>
				<Button color='error'>Cancel</Button>
				<Button type='submit'>Submit</Button>
			</Box>
		</Box>
	</Box>
);

export default FormSxComponent;
