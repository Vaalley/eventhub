import { useState } from 'react'
import { useSelector } from 'react-redux'
import { AppWrapper } from './modules/app/components/AppWrapper'
import { Layout } from './modules/app/components/Layout'
import { LoginPage, UserProfile, selectIsAuthenticated } from './modules/auth'
import { OtpVerifyPage } from './modules/auth/pages/OtpVerifyPage'
import { RegisterPage } from './modules/auth/pages/RegisterPage'
import { selectRequireOtp } from './modules/auth/selectors'
import type { AppState } from './modules/store/store'

function AppContent() {
	const isAuthenticated = useSelector((state: AppState) => selectIsAuthenticated(state))
	const requireOtp = useSelector((state: AppState) => selectRequireOtp(state))
	const [showRegister, setShowRegister] = useState(false)

	if (requireOtp) return <OtpVerifyPage />
	if (isAuthenticated) return <UserProfile />
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
