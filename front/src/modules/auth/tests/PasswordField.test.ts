import { PasswordField } from '../components/PasswordField'

describe('PasswordField', () => {
	it('should be a valid React component', () => {
		expect(typeof PasswordField).toBe('function')
	})

	it('should have the correct display name or be a named function', () => {
		expect(PasswordField.name).toBe('PasswordField')
	})
})
