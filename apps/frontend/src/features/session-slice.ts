import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import loginUserAction from "./session-slice.action";

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

export const authSlice = createSlice({
    name: "session",
    initialState,
    reducers: {
        logOut: (state: SessionState) => {
            setToken(state, null);
        }
    },
    extraReducers: {
        [loginUserAction.fulfilled.toString()]: (state: SessionState, action: PayloadAction<string>) => {
          state.accessToken = action.payload;
      }
    },
});

export const { logOut } = authSlice.actions;
export default authSlice.reducer;