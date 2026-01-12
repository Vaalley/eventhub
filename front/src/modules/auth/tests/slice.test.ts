import { authActions, authReducer } from '../slice'
import type { AuthState, User } from '../types'

describe('authSlice', () => {
	const initialState: AuthState = {
		user: null,
		isAuthenticated: false,
	}

	const mockUser: User = {
		id: '123',
		email: 'test@example.com',
		name: 'Test User',
	}

	it('should return initial state', () => {
		expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState)
	})

	describe('login', () => {
		it('should set user and isAuthenticated to true', () => {
			const state = authReducer(initialState, authActions.login(mockUser))

			expect(state.user).toEqual(mockUser)
			expect(state.isAuthenticated).toBe(true)
		})
	})

	describe('logout', () => {
		it('should clear user and set isAuthenticated to false', () => {
			const loggedInState: AuthState = {
				user: mockUser,
				isAuthenticated: true,
			}

			const state = authReducer(loggedInState, authActions.logout())

			expect(state.user).toBeNull()
			expect(state.isAuthenticated).toBe(false)
		})
	})
})
