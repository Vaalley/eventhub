import { CircularProgress, Tab, Tabs } from '@mui/material'
import { Suspense, lazy, useState } from 'react'
import { useSelector } from 'react-redux'
import { AppWrapper } from './modules/app/components/AppWrapper'
import { Layout } from './modules/app/components/Layout'
import { LoginPage, selectIsAuthenticated } from './modules/auth'
import { OtpVerifyPage } from './modules/auth/pages/OtpVerifyPage'
import { RegisterPage } from './modules/auth/pages/RegisterPage'
import { selectRequireOtp } from './modules/auth/selectors'
import type { AppState } from './modules/store/store'

const UserProfile = lazy(() =>
	import('./modules/auth/components/UserProfile').then((m) => ({ default: m.UserProfile })),
)
const DashboardPage = lazy(() =>
	import('./modules/dashboard/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const EventsListPage = lazy(() =>
	import('./modules/events/pages/EventsListPage').then((m) => ({ default: m.EventsListPage })),
)

function LoadingFallback() {
	return (
		<div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
			<CircularProgress />
		</div>
	)
}

function AuthenticatedContent() {
	const [tab, setTab] = useState(0)

	return (
		<>
			<Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
				<Tab label="Profile" />
				<Tab label="Events" />
				<Tab label="Dashboard" />
			</Tabs>
			<Suspense fallback={<LoadingFallback />}>
				{tab === 0 && <UserProfile />}
				{tab === 1 && <EventsListPage />}
				{tab === 2 && <DashboardPage />}
			</Suspense>
		</>
	)
}

function AppContent() {
	const isAuthenticated = useSelector((state: AppState) => selectIsAuthenticated(state))
	const requireOtp = useSelector((state: AppState) => selectRequireOtp(state))
	const [showRegister, setShowRegister] = useState(false)

	if (requireOtp) return <OtpVerifyPage />
	if (isAuthenticated) return <AuthenticatedContent />
	if (showRegister)
		return (
			<RegisterPage
				onRegistered={() => setShowRegister(false)}
				onSwitchToLogin={() => setShowRegister(false)}
			/>
		)
	return <LoginPage onSwitchToRegister={() => setShowRegister(true)} />
}

function App() {
	return (
		<AppWrapper>
			<Layout>
				<AppContent />
			</Layout>
		</AppWrapper>
	)
}

export default App
