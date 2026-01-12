import { Box, Button, Paper, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, AppState } from '../../store/store'
import { selectUser } from '../selectors'
import { authActions } from '../slice'

export const UserProfile: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>()
	const user = useSelector((state: AppState) => selectUser(state))

	const handleLogout = () => {
		dispatch(authActions.logout())
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
				<Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
					{user.email}
				</Typography>
				<Button variant="outlined" color="primary" onClick={handleLogout}>
					Sign Out
				</Button>
			</Paper>
		</Box>
	)
}
