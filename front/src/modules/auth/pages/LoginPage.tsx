import { Box, Paper, Typography } from '@mui/material'
import { nanoid } from 'nanoid'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../store/store'
import { LoginForm } from '../components/LoginForm'
import { useLoginForm } from '../hooks/useLoginForm'
import { authActions } from '../slice'

export const LoginPage: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>()
	const { formState, setEmail, setPassword, validate, getCredentials, reset } = useLoginForm()

	const handleSubmit = () => {
		if (!validate()) {
			return
		}

		const credentials = getCredentials()

		const user = {
			id: nanoid(),
			email: credentials.email,
			name: credentials.email.split('@')[0],
		}

		dispatch(authActions.login(user))
		alert(`Welcome, ${user.name}! You are now logged in.`)
		reset()
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
				<LoginForm
					formState={formState}
					onEmailChange={setEmail}
					onPasswordChange={setPassword}
					onSubmit={handleSubmit}
				/>
			</Paper>
		</Box>
	)
}
