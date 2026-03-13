import {
	Box,
	Card,
	CardContent,
	CircularProgress,
	Pagination,
	Paper,
	Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { usePageTracking } from '../../dashboard'
import { type Event, type PaginatedEvents, eventsApi } from '../api'

export const EventsListPage: React.FC = () => {
	usePageTracking('/events')

	const [data, setData] = useState<PaginatedEvents | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [page, setPage] = useState(1)
	const limit = 6

	useEffect(() => {
		setLoading(true)
		eventsApi
			.listPaginated(page, limit)
			.then(setData)
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false))
	}, [page])

	const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
		setPage(value)
	}

	if (loading && !data) {
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

	if (!data) return null

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				Events
			</Typography>

			{loading && (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
					<CircularProgress size={24} />
				</Box>
			)}

			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
					gap: 2,
					mb: 3,
				}}
			>
				{data.data.map((event: Event) => (
					<Card key={event.id}>
						<CardContent>
							<Typography variant="h6" gutterBottom>
								{event.title}
							</Typography>
							<Typography color="text.secondary" variant="body2" gutterBottom>
								{new Date(event.startDate).toLocaleDateString()}
							</Typography>
							<Typography variant="body2" gutterBottom>
								{event.venue}
							</Typography>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
								<Typography variant="caption" color="text.secondary">
									{event.category}
								</Typography>
								{event.price !== undefined && (
									<Typography variant="body2" fontWeight="bold">
										{event.price === 0 ? 'Free' : `${event.price}€`}
									</Typography>
								)}
							</Box>
						</CardContent>
					</Card>
				))}
			</Box>

			{data.data.length === 0 && (
				<Paper sx={{ p: 3, textAlign: 'center' }}>
					<Typography color="text.secondary">No events found</Typography>
				</Paper>
			)}

			{data.totalPages > 1 && (
				<Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
					<Pagination
						count={data.totalPages}
						page={page}
						onChange={handlePageChange}
						color="primary"
					/>
				</Box>
			)}

			<Box sx={{ mt: 2, textAlign: 'center' }}>
				<Typography variant="caption" color="text.secondary">
					Showing {data.data.length} of {data.total} events
				</Typography>
			</Box>
		</Box>
	)
}
