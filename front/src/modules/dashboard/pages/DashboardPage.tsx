import { Box, Card, CardContent, CircularProgress, Paper, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { type PageViewStats, analyticsApi } from '../api'
import { usePageTracking } from '../hooks/usePageTracking'

export const DashboardPage: React.FC = () => {
	usePageTracking('/dashboard')

	const [stats, setStats] = useState<PageViewStats | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		analyticsApi
			.getStats()
			.then(setStats)
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false))
	}, [])

	if (loading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
				<CircularProgress />
			</Box>
		)
	}

	if (error) {
		return (
			<Paper sx={{ p: 3 }}>
				<Typography color="error">{error}</Typography>
			</Paper>
		)
	}

	if (!stats) return null

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				Dashboard
			</Typography>

			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
					gap: 2,
					mb: 4,
				}}
			>
				<Card>
					<CardContent>
						<Typography color="text.secondary" gutterBottom>
							Total Page Views
						</Typography>
						<Typography variant="h4">{stats.totalViews}</Typography>
					</CardContent>
				</Card>
				<Card>
					<CardContent>
						<Typography color="text.secondary" gutterBottom>
							Unique Pages
						</Typography>
						<Typography variant="h4">{stats.uniquePaths}</Typography>
					</CardContent>
				</Card>
			</Box>

			<Typography variant="h6" gutterBottom>
				Top Pages
			</Typography>
			<Paper sx={{ mb: 4 }}>
				{stats.viewsByPath.map((item) => (
					<Box
						key={item.path}
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							p: 2,
							borderBottom: '1px solid',
							borderColor: 'divider',
							'&:last-child': { borderBottom: 0 },
						}}
					>
						<Typography fontFamily="monospace">{item.path}</Typography>
						<Typography fontWeight="bold">{item.count}</Typography>
					</Box>
				))}
				{stats.viewsByPath.length === 0 && (
					<Box sx={{ p: 2 }}>
						<Typography color="text.secondary">No data yet</Typography>
					</Box>
				)}
			</Paper>

			<Typography variant="h6" gutterBottom>
				Views by Day
			</Typography>
			<Paper>
				{stats.viewsByDay.map((item) => (
					<Box
						key={item.date}
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							p: 2,
							borderBottom: '1px solid',
							borderColor: 'divider',
							'&:last-child': { borderBottom: 0 },
						}}
					>
						<Typography>{item.date}</Typography>
						<Typography fontWeight="bold">{item.count}</Typography>
					</Box>
				))}
				{stats.viewsByDay.length === 0 && (
					<Box sx={{ p: 2 }}>
						<Typography color="text.secondary">No data yet</Typography>
					</Box>
				)}
			</Paper>
		</Box>
	)
}
