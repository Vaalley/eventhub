import type { AppState } from '../store/store'

export const selectUser = (state: AppState) => state.auth.user
export const selectIsAuthenticated = (state: AppState) => state.auth.isAuthenticated
