import { EmailField } from '../components/EmailField'

describe('EmailField', () => {
	it('should be a valid React component', () => {
		expect(typeof EmailField).toBe('function')
	})

	it('should have the correct display name or be a named function', () => {
		expect(EmailField.name).toBe('EmailField')
	})
})
