import {FC, useCallback, useState} from 'react';
import { Avatar, Box, Button, Checkbox, Container, FormControlLabel, Grid, TextField, Typography } from '@mui/material';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link } from 'react-router-dom';
import {SubmitHandler, useForm} from 'react-hook-form';
import { ErrorLogger, SignInDto } from '@boilerplate/shared';
import { useAppDispatch } from '../../../../store';
import {refreshAction, signInAction} from "../../";

const resolver = classValidatorResolver(SignInDto);

export const LoginPage: FC = () => {
	const dispatch = useAppDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [signError, setSignError] = useState<string | null>(null);

  const { handleSubmit, register, formState: { errors } } = useForm<SignInDto>({ resolver });

	const onConfirm: SubmitHandler<SignInDto> = useCallback(async (data) => {
		try {
			setIsLoading(true);
			await dispatch(signInAction(data)).unwrap();
		} catch (e: unknown) {
			ErrorLogger.logError(e);
			setSignError((e as Error).message);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const callRefreshAction = async () => {
		await dispatch(refreshAction('mock_token_data'));
	};

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form"
          onSubmit={handleSubmit(onConfirm)}
          noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
            error={!!errors.email}
            {...register('email')}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            error={!!errors.password}
            {...register('password')}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
						disabled={isLoading}
            variant="contained"
            sx={{ mt: 3, mb: 1 }}
          >
            Sign In
          </Button>
					<Button
						onClick={callRefreshAction}
						fullWidth
						variant="contained"
						sx={{ mt: 1, mb: 2 }}
					>
						Refresh
					</Button>
          <Grid container>
            <Grid item>
              <Link to={'/signup'}>
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
