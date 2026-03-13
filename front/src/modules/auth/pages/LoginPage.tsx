import { Alert, Box, Button, Paper, Typography } from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../store/store'
import { authApi } from '../api'
import { LoginForm } from '../components/LoginForm'
import { useLoginForm } from '../hooks/useLoginForm'
import { authActions } from '../slice'

interface Props {
	onSwitchToRegister?: () => void
}

export const LoginPage: React.FC<Props> = ({ onSwitchToRegister }) => {
	const dispatch = useDispatch<AppDispatch>()
	const { formState, setEmail, setPassword, validate, getCredentials } = useLoginForm()
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSubmit = async () => {
		if (!validate()) return
		setLoading(true)
		setError('')

		try {
			const { email, password } = getCredentials()
			const result = await authApi.login(email, password)
			dispatch(
				authActions.loginSuccess({
					user: result.user,
					requireOtp: result.requireOtp,
				}),
			)
			if (!result.requireOtp) {
				setEmail('')
				setPassword('')
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erreur de connexion')
		} finally {
			setLoading(false)
		}
	}

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: '60vh',
			}}
		>
			<Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
				<Typography variant="h5" component="h1" align="center" gutterBottom>
					Sign In
				</Typography>
				<Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
					Enter your credentials to access your account
				</Typography>
				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}
				<LoginForm
					formState={formState}
					onEmailChange={setEmail}
					onPasswordChange={setPassword}
					onSubmit={handleSubmit}
					isLoading={loading}
				/>
				{onSwitchToRegister && (
					<Button
						fullWidth
						variant="text"
						size="small"
						onClick={onSwitchToRegister}
						sx={{ mt: 1 }}
					>
						Don't have an account? Register
					</Button>
				)}
			</Paper>
		</Box>
	)
}
