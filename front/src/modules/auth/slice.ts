import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import type { AuthState, User } from './types'

function loadState(): AuthState {
	try {
		const raw = localStorage.getItem('auth')
		if (raw) return JSON.parse(raw)
	} catch {}
	return {
		user: null,
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
		loginSuccess: (state, action: PayloadAction<{ user: User; requireOtp: boolean }>) => {
			state.user = action.payload.user
			state.requireOtp = action.payload.requireOtp
			state.isAuthenticated = !action.payload.requireOtp
			saveState(state)
		},
		otpVerified: (state) => {
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
			state.isAuthenticated = false
			state.requireOtp = false
			localStorage.removeItem('auth')
		},
	},
})

export const authActions = authSlice.actions
export const authReducer = authSlice.reducer
