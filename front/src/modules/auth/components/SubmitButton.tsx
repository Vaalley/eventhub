import { Button } from '@mui/material'

interface SubmitButtonProps {
	label: string
	disabled?: boolean
	loading?: boolean
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
	label,
	disabled = false,
	loading = false,
}) => {
	return (
		<Button
			type="submit"
			fullWidth
			variant="contained"
			disabled={disabled || loading}
			sx={{ mt: 3, mb: 2 }}
			data-testid="submit-button"
		>
			{loading ? 'Loading...' : label}
		</Button>
	)
}
