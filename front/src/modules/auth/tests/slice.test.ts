import { authActions, authReducer } from '../slice'
import type { AuthState, User } from '../types'

describe('authSlice', () => {
	const initialState: AuthState = {
		user: null,
		isAuthenticated: false,
		requireOtp: false,
	}

	const mockUser: User = {
		id: '123',
		email: 'test@example.com',
		name: 'Test User',
	}

	beforeEach(() => {
		// Mock localStorage for bun test environment
		if (typeof localStorage === 'undefined') {
			const localStorageMock = {
				getItem: () => null,
				setItem: () => {},
				removeItem: () => {},
				clear: () => {},
			}
			// biome-ignore lint/suspicious/noExplicitAny: Required to mock globalThis in test environment
			;(globalThis as any).localStorage = localStorageMock
		}
		localStorage.clear()
	})

	it('should return initial state', () => {
		expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState)
	})

	describe('loginSuccess', () => {
		it('should set user and isAuthenticated to true when OTP not required', () => {
			const state = authReducer(
				initialState,
				authActions.loginSuccess({ user: mockUser, requireOtp: false }),
			)

			expect(state.user).toEqual(mockUser)
			expect(state.isAuthenticated).toBe(true)
			expect(state.requireOtp).toBe(false)
		})

		it('should set user and requireOtp to true when OTP required', () => {
			const state = authReducer(
				initialState,
				authActions.loginSuccess({ user: mockUser, requireOtp: true }),
			)

			expect(state.user).toEqual(mockUser)
			expect(state.isAuthenticated).toBe(false)
			expect(state.requireOtp).toBe(true)
		})
	})

	describe('otpVerified', () => {
		it('should set requireOtp to false and isAuthenticated to true', () => {
			const otpPendingState: AuthState = {
				user: mockUser,
				isAuthenticated: false,
				requireOtp: true,
			}

			const state = authReducer(otpPendingState, authActions.otpVerified())

			expect(state.user).toEqual(mockUser)
			expect(state.isAuthenticated).toBe(true)
			expect(state.requireOtp).toBe(false)
		})
	})

	describe('logout', () => {
		it('should clear user and set isAuthenticated to false', () => {
			const loggedInState: AuthState = {
				user: mockUser,
				isAuthenticated: true,
				requireOtp: false,
			}

			const state = authReducer(loggedInState, authActions.logout())

			expect(state.user).toBeNull()
			expect(state.isAuthenticated).toBe(false)
			expect(state.requireOtp).toBe(false)
		})
	})
})
