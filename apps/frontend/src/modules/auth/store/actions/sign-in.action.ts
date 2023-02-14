import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthResultDto, SignInDto } from '@boilerplate/shared';
import authApi from '../../../../store/api/auth.api';
import { clearSession, setAccessToken, setCurrentUser } from '../session.slice';

export const signInAction = createAsyncThunk<AuthResultDto, SignInDto>(
  'auth/sign-in',
  async (body, { dispatch, rejectWithValue }) => {
    try {
			const signInResult = await dispatch(authApi.endpoints.signIn.initiate(body)).unwrap();

			dispatch(clearSession());
			dispatch(setCurrentUser(signInResult.user));
			dispatch(setAccessToken(signInResult.authToken));

      return signInResult;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);
