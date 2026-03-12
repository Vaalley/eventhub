const API_BASE = '/api'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
	const res = await fetch(`${API_BASE}${url}`, {
		headers: { 'Content-Type': 'application/json' },
		...options,
	})
	const data = await res.json()
	if (!res.ok) {
		throw new Error(data.error || 'Erreur serveur')
	}
	return data as T
}

function authHeaders(token: string): HeadersInit {
	return {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	}
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
			token: string
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

	setupOtp(token: string) {
		return request<{ qrCodeDataUrl: string; secret: string }>('/auth/otp/setup', {
			method: 'GET',
			headers: authHeaders(token),
		})
	},

	verifyOtp(token: string, code: string, isEnabling = false, isRecoveryCode = false) {
		return request<{ token: string; recoveryCodes?: string[] }>('/auth/otp/verify', {
			method: 'POST',
			headers: authHeaders(token),
			body: JSON.stringify({ code, isEnabling, isRecoveryCode }),
		})
	},

	disableOtp(token: string) {
		return request<{ message: string }>('/auth/otp', {
			method: 'DELETE',
			headers: authHeaders(token),
		})
	},
}
