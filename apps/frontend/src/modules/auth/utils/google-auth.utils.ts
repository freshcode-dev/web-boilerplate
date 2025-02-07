import store from "../../../store";
import authApi from "../../../store/api/auth.api";

export const authWithGoogleToken = async (response: { credential: string }) => {
	await store.dispatch(authApi.endpoints.authWithGoogleToken.initiate(response.credential));
};

export const assignGoogleAccount = async (response: { credential: string }) => {
	await store.dispatch(authApi.endpoints.assignGoogleAccount.initiate(response.credential));
};
