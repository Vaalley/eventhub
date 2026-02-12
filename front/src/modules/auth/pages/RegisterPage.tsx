import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { authApi } from '../api'

interface Props {
	onRegistered: () => void
	onSwitchToLogin: () => void
}

export const RegisterPage: React.FC<Props> = ({ onRegistered, onSwitchToLogin }) => {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setLoading(true)
		try {
			await authApi.register(email, name, password)
			onRegistered()
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Registration failed')
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
				<Typography variant="h5" align="center" gutterBottom>
					Create Account
				</Typography>
				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}
				<Box component="form" onSubmit={handleSubmit}>
					<TextField
						fullWidth
						label="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						sx={{ mb: 2 }}
					/>
					<TextField
						fullWidth
						label="Email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						sx={{ mb: 2 }}
					/>
					<TextField
						fullWidth
						label="Password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						sx={{ mb: 2 }}
					/>
					<Button
						fullWidth
						variant="contained"
						type="submit"
						disabled={loading}
						sx={{ mb: 1 }}
					>
						{loading ? 'Creating...' : 'Register'}
					</Button>
					<Button fullWidth variant="text" size="small" onClick={onSwitchToLogin}>
						Already have an account? Sign in
					</Button>
				</Box>
			</Paper>
		</Box>
	)
}
