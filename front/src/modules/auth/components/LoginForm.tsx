import { Box } from '@mui/material'
import type { FormEvent } from 'react'
import type { LoginFormState } from '../hooks/useLoginForm'
import { EmailField } from './EmailField'
import { PasswordField } from './PasswordField'
import { SubmitButton } from './SubmitButton'

interface LoginFormProps {
	formState: LoginFormState
	onEmailChange: (email: string) => void
	onPasswordChange: (password: string) => void
	onSubmit: () => void
	isLoading?: boolean
}

export const LoginForm: React.FC<LoginFormProps> = ({
	formState,
	onEmailChange,
	onPasswordChange,
	onSubmit,
	isLoading = false,
}) => {
	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()
		onSubmit()
	}

	return (
		<Box component="form" onSubmit={handleSubmit} data-testid="login-form">
			<EmailField
				value={formState.email}
				onChange={onEmailChange}
				error={formState.errors.email}
				disabled={isLoading}
			/>
			<PasswordField
				value={formState.password}
				onChange={onPasswordChange}
				error={formState.errors.password}
				disabled={isLoading}
			/>
			<SubmitButton label="Sign In" loading={isLoading} />
		</Box>
	)
}
