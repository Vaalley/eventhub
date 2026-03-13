const API_BASE = '/api'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
	const res = await fetch(`${API_BASE}${url}`, {
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		...options,
	})
	const data = await res.json()
	if (!res.ok) {
		throw new Error(data.error || 'Erreur serveur')
	}
	return data as T
}

export const authApi = {
	register(email: string, name: string, password: string) {
		return request<{ id: string; email: string; name: string }>('/auth/register', {
			method: 'POST',
			body: JSON.stringify({ email, name, password }),
		})
	},

	login(email: string, password: string) {
		return request<{
			requireOtp: boolean
			user: {
				id: string
				email: string
				name: string
				otpEnabled: boolean
			}
		}>('/auth/login', {
			method: 'POST',
			body: JSON.stringify({ email, password }),
		})
	},

	setupOtp() {
		return request<{ qrCodeDataUrl: string; secret: string }>('/auth/otp/setup', {
			method: 'GET',
		})
	},

	verifyOtp(code: string, isEnabling = false, isRecoveryCode = false) {
		return request<{ recoveryCodes?: string[] }>('/auth/otp/verify', {
			method: 'POST',
			body: JSON.stringify({ code, isEnabling, isRecoveryCode }),
		})
	},

	disableOtp() {
		return request<{ message: string }>('/auth/otp', {
			method: 'DELETE',
		})
	},

	logout() {
		return request<{ message: string }>('/auth/logout', {
			method: 'POST',
		})
	},
}
