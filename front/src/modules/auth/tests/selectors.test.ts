import type { AppState } from '../../store/store'
import { selectIsAuthenticated, selectUser } from '../selectors'

describe('auth selectors', () => {
	const mockUser = {
		id: '123',
		email: 'test@example.com',
		name: 'Test User',
	}

	describe('selectUser', () => {
		it('should return null when not authenticated', () => {
			const state = {
				auth: {
					user: null,
					isAuthenticated: false,
				},
			} as AppState

			expect(selectUser(state)).toBeNull()
		})

		it('should return user when authenticated', () => {
			const state = {
				auth: {
					user: mockUser,
					isAuthenticated: true,
				},
			} as AppState

			expect(selectUser(state)).toEqual(mockUser)
		})
	})

	describe('selectIsAuthenticated', () => {
		it('should return false when not authenticated', () => {
			const state = {
				auth: {
					user: null,
					isAuthenticated: false,
				},
			} as AppState

			expect(selectIsAuthenticated(state)).toBe(false)
		})

		it('should return true when authenticated', () => {
			const state = {
				auth: {
					user: mockUser,
					isAuthenticated: true,
				},
			} as AppState

			expect(selectIsAuthenticated(state)).toBe(true)
		})
	})
})
