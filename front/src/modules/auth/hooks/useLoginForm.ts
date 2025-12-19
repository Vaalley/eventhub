import { useCallback, useState } from 'react'
import type { LoginCredentials } from '../types'

export interface LoginFormState {
	email: string
	password: string
	errors: {
		email?: string
		password?: string
	}
}

export interface UseLoginFormReturn {
	formState: LoginFormState
	setEmail: (email: string) => void
	setPassword: (password: string) => void
	validate: () => boolean
	getCredentials: () => LoginCredentials
	reset: () => void
}

const initialState: LoginFormState = {
	email: '',
	password: '',
	errors: {},
}

export const useLoginForm = (): UseLoginFormReturn => {
	const [formState, setFormState] = useState<LoginFormState>(initialState)

	const setEmail = useCallback((email: string) => {
		setFormState((prev) => ({
			...prev,
			email,
			errors: { ...prev.errors, email: undefined },
		}))
	}, [])

	const setPassword = useCallback((password: string) => {
		setFormState((prev) => ({
			...prev,
			password,
			errors: { ...prev.errors, password: undefined },
		}))
	}, [])

	const validate = useCallback((): boolean => {
		const errors: LoginFormState['errors'] = {}

		if (!formState.email) {
			errors.email = 'Email is required'
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
			errors.email = 'Invalid email format'
		}

		if (!formState.password) {
			errors.password = 'Password is required'
		} else if (formState.password.length < 6) {
			errors.password = 'Password must be at least 6 characters'
		}

		setFormState((prev) => ({ ...prev, errors }))
		return Object.keys(errors).length === 0
	}, [formState.email, formState.password])

	const getCredentials = useCallback(
		(): LoginCredentials => ({
			email: formState.email,
			password: formState.password,
		}),
		[formState.email, formState.password],
	)

	const reset = useCallback(() => {
		setFormState(initialState)
	}, [])

	return {
		formState,
		setEmail,
		setPassword,
		validate,
		getCredentials,
		reset,
	}
}
