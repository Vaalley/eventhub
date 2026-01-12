import { useSelector } from 'react-redux'
import { AppWrapper } from './modules/app/components/AppWrapper'
import { Layout } from './modules/app/components/Layout'
import { LoginPage, UserProfile, selectIsAuthenticated } from './modules/auth'
import type { AppState } from './modules/store/store'

function AppContent() {
	const isAuthenticated = useSelector((state: AppState) => selectIsAuthenticated(state))

	return isAuthenticated ? <UserProfile /> : <LoginPage />
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
