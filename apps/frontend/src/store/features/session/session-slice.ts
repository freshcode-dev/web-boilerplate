import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SessionState {
    accessToken: string | null;
}

export const initialState: SessionState = {
    accessToken: null
};

export const authSlice = createSlice({
    name: "session",
    initialState,
    reducers: {
        logOut: (state: SessionState) => {
            localStorage.removeItem("token");
            state.accessToken = null;;
        },
        setAccessToken: (state: SessionState, action: PayloadAction<string>) => {
            if (action.payload) {
                localStorage.setItem("token", action.payload);
                state.accessToken = action.payload;
            } else {
                localStorage.removeItem("token");
                state.accessToken = null;;
            }
        }
    }
});

export const { logOut, setAccessToken } = authSlice.actions;
export default authSlice.reducer;