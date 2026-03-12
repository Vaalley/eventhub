import { ValidationError } from '../errors/DomainError'

export interface UserProps {
	id?: string
	email: string
	name: string
	passwordHash: string
	otpSecret?: string | null
	otpEnabled?: boolean
	createdAt?: Date
	updatedAt?: Date
}

export class User {
	private props: UserProps

	constructor(props: UserProps) {
		this.validate(props)
		this.props = {
			...props,
			otpEnabled: props.otpEnabled ?? false,
			createdAt: props.createdAt ?? new Date(),
			updatedAt: props.updatedAt ?? new Date(),
		}
	}

	private validate(props: UserProps): void {
		if (!props.email || props.email.trim() === '') {
			throw new ValidationError("L'email est obligatoire")
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(props.email)) {
			throw new ValidationError("L'email n'est pas valide")
		}

		if (!props.name || props.name.trim() === '') {
			throw new ValidationError('Le nom est obligatoire')
		}

		if (!props.passwordHash || props.passwordHash.trim() === '') {
			throw new ValidationError('Le mot de passe est obligatoire')
		}
	}

	get id(): string | undefined {
		return this.props.id
	}
	get email(): string {
		return this.props.email
	}
	get name(): string {
		return this.props.name
	}
	get passwordHash(): string {
		return this.props.passwordHash
	}
	get otpSecret(): string | null | undefined {
		return this.props.otpSecret
	}
	get otpEnabled(): boolean {
		return this.props.otpEnabled ?? false
	}
	get createdAt(): Date | undefined {
		return this.props.createdAt
	}
	get updatedAt(): Date | undefined {
		return this.props.updatedAt
	}
}
