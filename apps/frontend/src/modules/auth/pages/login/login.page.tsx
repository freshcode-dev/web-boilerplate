import { FC } from 'react';
import { Avatar, Box, Button, Checkbox, Container, FormControlLabel, Grid, TextField, Typography } from '@mui/material';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { SignInDto } from '@boilerplate/shared';
import { useSignInMutation } from "../../../../store/api/auth.api";

const resolver = classValidatorResolver(SignInDto);

export const LoginPage: FC = () => {
  const { handleSubmit, register, formState: { errors } } = useForm<SignInDto>({ resolver });
	const [signIn, { isLoading, isError }] = useSignInMutation();

	const handleSignIn = async (values: SignInDto) => {
		await signIn({...values}).unwrap();
	}

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
          onSubmit={handleSubmit(handleSignIn)}
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
          <Grid container>
            <Grid item>
              <Link to="/auth/signup">
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
