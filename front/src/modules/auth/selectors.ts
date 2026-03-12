import type { AppState } from '../store/store'

export const selectUser = (state: AppState) => state.auth.user
export const selectToken = (state: AppState) => state.auth.token
export const selectIsAuthenticated = (state: AppState) => state.auth.isAuthenticated
export const selectRequireOtp = (state: AppState) => state.auth.requireOtp
