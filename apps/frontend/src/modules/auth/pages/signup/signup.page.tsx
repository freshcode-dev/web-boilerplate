import * as React from 'react';
import { Avatar, Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { FC } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useRegisterMutation } from "../../../../store/api/auth.api";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { CreateUserDto } from "@boilerplate/shared";
import { useForm } from "react-hook-form";

const resolver = classValidatorResolver(CreateUserDto);

export const SignUpPage: FC = () => {
	const { handleSubmit, register, formState: { errors } } = useForm<CreateUserDto>({ resolver });
  const [registerUser, { isLoading, data }] = useRegisterMutation();

	if (data) {
		return <Navigate to="/auth/login"/>;
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
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit(registerUser)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                required
                fullWidth
                id="name"
                label="Full Name"
                autoFocus
								error={!!errors.name}
								{...register('name')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
								error={!!errors.email}
								{...register('email')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
								error={!!errors.password}
								{...register('password')}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
						disabled={isLoading}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to={'/auth/login'}>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUpPage;
