import { TextField } from '@mui/material'

interface EmailFieldProps {
	value: string
	onChange: (value: string) => void
	error?: string
	disabled?: boolean
}

export const EmailField: React.FC<EmailFieldProps> = ({
	value,
	onChange,
	error,
	disabled = false,
}) => {
	return (
		<TextField
			fullWidth
			label="Email"
			type="email"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			error={!!error}
			helperText={error}
			disabled={disabled}
			margin="normal"
			autoComplete="email"
			data-testid="email-field"
		/>
	)
}
