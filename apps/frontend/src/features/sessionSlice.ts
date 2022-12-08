import { createSlice, PayloadAction, createAsyncThunk} from "@reduxjs/toolkit";
import { LoginDto } from '@boilerplate/shared';
import { usersService } from '../data-services';

export interface SessionState {
    accessToken: string | null;
}

export const initialState: SessionState = {
    accessToken: null
};

const clearToken = (state: SessionState): void => {
    localStorage.removeItem("token");
    state.accessToken = null;
}

const setToken = async (state: SessionState, token: string | null) => {
    if (token) {
        localStorage.setItem("token", token);
        state.accessToken = token;
    } else {
        clearToken(state);
    }
}

const loginUser = createAsyncThunk('user/login', async (body: LoginDto, { rejectWithValue }) => {
    try {
      const { data } = await usersService.login(body);
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  })

export const authSlice = createSlice({
    name: "session",
    initialState,
    reducers: {
        logOut: (state: SessionState) => {
            setToken(state, null);
        }
    },
    extraReducers: {
        [loginUser.fulfilled.toString()]: (state: SessionState, action: PayloadAction<string>) => {
          state.accessToken = action.payload;
      }
    },
});

export const { logOut } = authSlice.actions;
export default authSlice.reducer;