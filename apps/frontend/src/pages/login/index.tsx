import { FC } from 'react';
import { LoginDto } from '@boilerplate/shared';
import { Avatar, Box, Button, Checkbox, Container, FormControlLabel, Grid, TextField, Typography } from '@mui/material';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ErrorLogger } from '@boilerplate/shared';
import { useAppDispatch } from '../../store';
import loginUserAction from '../../store/features/session/login-user.action';
import { setAccessToken } from '../../store/features/session';

const resolver = classValidatorResolver(LoginDto);

const LoginPage: FC = () => {
  const { handleSubmit, register, formState: { errors } } = useForm<LoginDto>({ resolver });
  const dispatch = useAppDispatch();

  const onConfirm = async (): Promise<void> => {
    await handleSubmit(
      async value => {
        try {
          const result = await dispatch(loginUserAction(value));
          await dispatch(setAccessToken(result.payload as string));
        } catch (e) {
          ErrorLogger.logError(e);
        }
      },
    )();
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
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
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
