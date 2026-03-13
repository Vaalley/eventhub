import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../store/store'
import { authApi } from '../api'
import { authActions } from '../slice'

export const OtpVerifyPage: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>()
	const [code, setCode] = useState('')
	const [useRecovery, setUseRecovery] = useState(false)
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const handleVerify = async () => {
		if (!code.trim()) return
		setLoading(true)
		setError('')
		try {
			await authApi.verifyOtp(code.trim(), false, useRecovery)
			dispatch(authActions.otpVerified())
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Code invalide')
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
					{useRecovery ? 'Recovery Code' : 'Two-Factor Authentication'}
				</Typography>
				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}
				<TextField
					fullWidth
					label={useRecovery ? 'Recovery Code' : 'OTP Code'}
					value={code}
					onChange={(e) => setCode(e.target.value)}
					placeholder={useRecovery ? 'A1B2C3D4' : '123456'}
					sx={{ mb: 2 }}
					autoFocus
				/>
				<Button
					fullWidth
					variant="contained"
					onClick={handleVerify}
					disabled={loading || !code.trim()}
					sx={{ mb: 1 }}
				>
					{loading ? 'Verifying...' : 'Verify'}
				</Button>
				<Button
					fullWidth
					variant="text"
					size="small"
					onClick={() => {
						setUseRecovery(!useRecovery)
						setCode('')
					}}
				>
					{useRecovery ? 'Use authenticator app instead' : 'Use a recovery code'}
				</Button>
				<Button
					fullWidth
					variant="text"
					size="small"
					color="secondary"
					onClick={() => dispatch(authActions.logout())}
				>
					Back to login
				</Button>
			</Paper>
		</Box>
	)
}
