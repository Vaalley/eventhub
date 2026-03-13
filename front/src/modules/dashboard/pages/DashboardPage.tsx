import { Box, Card, CardContent, CircularProgress, Paper, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import {
	Bar,
	BarChart,
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
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
			<Paper sx={{ mb: 4, p: 2 }}>
				{stats.viewsByPath.length > 0 ? (
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={stats.viewsByPath} layout="vertical">
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis type="number" />
							<YAxis dataKey="path" type="category" width={120} fontSize={12} />
							<Tooltip />
							<Bar dataKey="count" fill="#1976d2" radius={[0, 4, 4, 0]} />
						</BarChart>
					</ResponsiveContainer>
				) : (
					<Typography color="text.secondary">No data yet</Typography>
				)}
			</Paper>

			<Typography variant="h6" gutterBottom>
				Views by Day
			</Typography>
			<Paper sx={{ p: 2 }}>
				{stats.viewsByDay.length > 0 ? (
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={stats.viewsByDay}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" fontSize={12} />
							<YAxis fontSize={12} />
							<Tooltip />
							<Line
								type="monotone"
								dataKey="count"
								stroke="#1976d2"
								strokeWidth={2}
								dot={{ fill: '#1976d2' }}
							/>
						</LineChart>
					</ResponsiveContainer>
				) : (
					<Typography color="text.secondary">No data yet</Typography>
				)}
			</Paper>
		</Box>
	)
}
