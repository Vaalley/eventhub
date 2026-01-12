import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import type { AuthState, User } from './types'

const initialState: AuthState = {
	user: null,
	isAuthenticated: false,
}

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		login: (state, action: PayloadAction<User>) => {
			state.user = action.payload
			state.isAuthenticated = true
		},
		logout: (state) => {
			state.user = null
			state.isAuthenticated = false
		},
	},
})

export const authActions = authSlice.actions
export const authReducer = authSlice.reducer
