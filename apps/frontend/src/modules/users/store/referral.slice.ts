import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isUUID } from 'class-validator';
import { useAppSelector } from '../../../store';

export interface ReferralState {
	analysisId?: string | null;
	referralId?: string | null;
}

export const initialState: ReferralState = {
	analysisId: null,
	referralId: null
};

export const referralSlice = createSlice({
	name: 'referral',
	initialState,
	reducers: {
		setReferral: (state: ReferralState, action: PayloadAction<ReferralState>) => {
			const { analysisId, referralId } = action.payload;

			state.analysisId = analysisId;
			state.referralId = isUUID(referralId, '4') ? referralId : null;
		},
		resetReferral: (state: ReferralState) => {
			state.analysisId = null;
			state.referralId = null;
		}
	}
});

export const { setReferral, resetReferral } = referralSlice.actions;
export const useReferral = () => useAppSelector(state => state.referral);
