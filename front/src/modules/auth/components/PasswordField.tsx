import { TextField } from '@mui/material'

interface PasswordFieldProps {
	value: string
	onChange: (value: string) => void
	error?: string
	disabled?: boolean
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
	value,
	onChange,
	error,
	disabled = false,
}) => {
	return (
		<TextField
			fullWidth
			label="Password"
			type="password"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			error={!!error}
			helperText={error}
			disabled={disabled}
			margin="normal"
			autoComplete="current-password"
			data-testid="password-field"
		/>
	)
}
