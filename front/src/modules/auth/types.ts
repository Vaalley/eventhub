export interface User {
	id: string
	email: string
	name: string
	otpEnabled?: boolean
}

export interface AuthState {
	user: User | null
	isAuthenticated: boolean
	requireOtp: boolean
}

export interface LoginCredentials {
	email: string
	password: string
}
