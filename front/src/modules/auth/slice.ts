import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import type { AuthState, User } from './types'

function loadState(): AuthState {
	try {
		const raw = localStorage.getItem('auth')
		if (raw) return JSON.parse(raw)
	} catch {}
	return {
		user: null,
		token: null,
		isAuthenticated: false,
		requireOtp: false,
	}
}

function saveState(state: AuthState) {
	try {
		localStorage.setItem('auth', JSON.stringify(state))
	} catch {}
}

const initialState: AuthState = loadState()

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		loginSuccess: (
			state,
			action: PayloadAction<{ user: User; token: string; requireOtp: boolean }>,
		) => {
			state.user = action.payload.user
			state.token = action.payload.token
			state.requireOtp = action.payload.requireOtp
			state.isAuthenticated = !action.payload.requireOtp
			saveState(state)
		},
		otpVerified: (state, action: PayloadAction<string>) => {
			state.token = action.payload
			state.requireOtp = false
			state.isAuthenticated = true
			saveState(state)
		},
		otpEnabledChanged: (state, action: PayloadAction<boolean>) => {
			if (state.user) {
				state.user.otpEnabled = action.payload
			}
			saveState(state)
		},
		logout: (state) => {
			state.user = null
			state.token = null
			state.isAuthenticated = false
			state.requireOtp = false
			localStorage.removeItem('auth')
		},
	},
})

export const authActions = authSlice.actions
export const authReducer = authSlice.reducer
