import { Alert, Box, Button, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, AppState } from '../../store/store'
import { authApi } from '../api'
import { selectToken } from '../selectors'
import { authActions } from '../slice'

type Step = 'idle' | 'qr' | 'recovery'

export const TwoFactorSetup: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>()
	const token = useSelector((state: AppState) => selectToken(state))
	const [step, setStep] = useState<Step>('idle')
	const [qrCode, setQrCode] = useState('')
	const [secret, setSecret] = useState('')
	const [code, setCode] = useState('')
	const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSetup = async () => {
		if (!token) return
		setLoading(true)
		try {
			const result = await authApi.setupOtp(token)
			setQrCode(result.qrCodeDataUrl)
			setSecret(result.secret)
			setStep('qr')
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erreur')
		} finally {
			setLoading(false)
		}
	}

	const handleVerify = async () => {
		if (!token || !code.trim()) return
		setLoading(true)
		setError('')
		try {
			const result = await authApi.verifyOtp(token, code.trim(), true)
			if (result.recoveryCodes) setRecoveryCodes(result.recoveryCodes)
			dispatch(authActions.otpVerified(result.token))
			setStep('recovery')
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Code invalide')
		} finally {
			setLoading(false)
		}
	}

	const handleDismissRecoveryCodes = () => {
		dispatch(authActions.otpEnabledChanged(true))
	}

	if (step === 'recovery') {
		return (
			<>
				<Alert severity="warning" sx={{ mb: 2 }}>
					Save these recovery codes! They will not be shown again.
				</Alert>
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						gap: 1,
						mb: 2,
						p: 2,
						bgcolor: 'grey.100',
						borderRadius: 1,
					}}
				>
					{recoveryCodes.map((c) => (
						<Typography key={c} variant="body2" fontFamily="monospace" align="center">
							{c}
						</Typography>
					))}
				</Box>
				<Button fullWidth variant="contained" onClick={handleDismissRecoveryCodes}>
					I have saved my codes
				</Button>
			</>
		)
	}

	if (step === 'qr') {
		return (
			<>
				{qrCode && (
					<Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
						<img src={qrCode} alt="QR Code" width={200} height={200} />
					</Box>
				)}
				<Typography
					variant="caption"
					color="text.secondary"
					align="center"
					display="block"
					sx={{ mb: 2 }}
				>
					Or enter manually: <strong>{secret}</strong>
				</Typography>
				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}
				<TextField
					fullWidth
					label="6-digit Code"
					value={code}
					onChange={(e) => setCode(e.target.value)}
					placeholder="123456"
					sx={{ mb: 2 }}
					autoFocus
				/>
				<Button
					fullWidth
					variant="contained"
					onClick={handleVerify}
					disabled={loading || !code.trim()}
					sx={{ mb: 1 }}
				>
					{loading ? 'Verifying...' : 'Activate 2FA'}
				</Button>
				<Button fullWidth variant="text" size="small" onClick={() => setStep('idle')}>
					Cancel
				</Button>
			</>
		)
	}

	return (
		<Button variant="outlined" onClick={handleSetup} disabled={loading} fullWidth>
			{loading ? 'Loading...' : 'Enable Two-Factor Authentication'}
		</Button>
	)
}
