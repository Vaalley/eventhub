import { Alert, Box, Button, Chip, Divider, Paper, Typography } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { usePageTracking } from '../../dashboard'
import type { AppDispatch, AppState } from '../../store/store'
import { authApi } from '../api'
import { selectUser } from '../selectors'
import { authActions } from '../slice'
import { TwoFactorSetup } from './TwoFactorSetup'

export const UserProfile: React.FC = () => {
	usePageTracking('/profile')
	const dispatch = useDispatch<AppDispatch>()
	const user = useSelector((state: AppState) => selectUser(state))
	const [disableLoading, setDisableLoading] = useState(false)
	const [message, setMessage] = useState('')

	const handleLogout = async () => {
		await authApi.logout()
		dispatch(authActions.logout())
	}

	const handleDisable2FA = async () => {
		setDisableLoading(true)
		try {
			await authApi.disableOtp()
			dispatch(authActions.otpEnabledChanged(false))
			setMessage('Two-factor authentication disabled')
		} catch (err) {
			setMessage(err instanceof Error ? err.message : 'Error')
		} finally {
			setDisableLoading(false)
		}
	}

	if (!user) return null

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: '60vh',
			}}
		>
			<Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%', textAlign: 'center' }}>
				<Typography variant="h5" component="h1" gutterBottom>
					Welcome, {user.name}!
				</Typography>
				<Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
					{user.email}
				</Typography>
				<Chip
					label={user.otpEnabled ? '2FA Enabled' : '2FA Disabled'}
					color={user.otpEnabled ? 'success' : 'default'}
					size="small"
					sx={{ mb: 3 }}
				/>

				{message && (
					<Alert severity="info" sx={{ mb: 2 }} onClose={() => setMessage('')}>
						{message}
					</Alert>
				)}

				<Divider sx={{ mb: 2 }} />

				<Box sx={{ mb: 2 }}>
					{user.otpEnabled ? (
						<Button
							variant="outlined"
							color="warning"
							onClick={handleDisable2FA}
							disabled={disableLoading}
							fullWidth
						>
							{disableLoading ? 'Disabling...' : 'Disable Two-Factor Authentication'}
						</Button>
					) : (
						<TwoFactorSetup />
					)}
				</Box>

				<Button variant="outlined" color="primary" onClick={handleLogout} fullWidth>
					Sign Out
				</Button>
			</Paper>
		</Box>
	)
}
