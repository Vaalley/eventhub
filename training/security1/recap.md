# Recap - Implémentation A2F (Double Authentification)

## Ce qui a été fait

### 1. Dépendances (backend, via `bun add`)

- **otplib** — Génération/vérification OTP (TOTP)
- **qrcode** — QR codes en base64
- **express-rate-limit** — Rate limiting sur la vérification OTP
- **jsonwebtoken** — Tokens JWT

### 2. Base de données (Prisma)

Deux modèles ajoutés dans `prisma/schema.prisma` :

- **User** — `id`, `email` (unique), `name`, `passwordHash`, `otpSecret`,
  `otpEnabled`
- **RecoveryCode** — `id`, `userId` (FK), `codeHash` (SHA-256), `used`

### 3. Backend — Architecture Onion (SOLID)

**Domain** : `User` entity, `UserRepositoryInterface`,
`RecoveryCodeRepositoryInterface`, `UnauthorizedError`

**Infrastructure** : `PrismaUserRepository`, `PrismaRecoveryCodeRepository`

**Application** (5 use cases) :

| Use Case            | Rôle                                                                                                  |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| `RegisterUseCase`   | Inscription (bcrypt via `Bun.password`)                                                               |
| `LoginUseCase`      | Login → JWT. Si OTP activé → token partiel (5min)                                                     |
| `SetupOtpUseCase`   | Génère secret + QR code                                                                               |
| `VerifyOtpUseCase`  | Vérifie code OTP **ou** recovery code (via `isRecoveryCode` flag). Active la 2FA si `isEnabling=true` |
| `DisableOtpUseCase` | Désactive OTP + supprime recovery codes                                                               |

**API** :

| Route              | Auth             | Description                  |
| ------------------ | ---------------- | ---------------------------- |
| `POST /register`   | Non              | Inscription                  |
| `POST /login`      | Non              | Connexion                    |
| `GET /otp/setup`   | Oui (full)       | QR code + secret             |
| `POST /otp/verify` | Oui (partiel OK) | Vérifie OTP ou recovery code |
| `DELETE /otp`      | Oui (full)       | Désactive 2FA                |

- **Rate limiter** : 4 tentatives/min sur `/otp/verify`
- **Auth middleware** : JWT + `requireFullAuth` (refuse si `otpPending`)
- **Error handler** : `UnauthorizedError` → 401

### 4. Frontend (React + Redux + MUI)

- **`authApi`** — Service fetch pour toutes les routes auth (URL relative `/api`
  pour le proxy nginx)
- **`LoginPage`** — Appelle le backend, gère `requireOtp`
- **`RegisterPage`** — Inscription avec redirection vers login
- **`OtpVerifyPage`** — Saisie code OTP ou recovery code (un seul endpoint)
- **`TwoFactorSetup`** — QR code → vérification → affichage recovery codes
- **`UserProfile`** — Affiche statut 2FA, boutons enable/disable
- **Auth slice** — 4 actions : `loginSuccess`, `otpVerified`,
  `otpEnabledChanged`, `logout`. État persisté dans `localStorage` pour survivre
  au refresh.
- **App.tsx** — Routing : `requireOtp` → OTP page, `authenticated` → Profile,
  sinon → Login/Register

### 5. Config

- `.env` + `docker-compose.yml` : `JWT_SECRET`, `APP_NAME`
- `nginx.conf` : proxy `/api/` → backend
- `start.sh` : `bun install` + prisma generate/push au démarrage du container

---

## Flux

1. **Register** → **Login** → Profile (sans 2FA)
2. **Enable 2FA** : Setup → QR scan → Verify code → Recovery codes affichés
3. **Login avec 2FA** : Login → Token partiel → OTP verify → Token complet
4. **Recovery** : Login → Token partiel → OTP verify avec `isRecoveryCode: true`
   → Token complet

---

## Sécurité

- Mots de passe hashés (bcrypt)
- Recovery codes hashés (SHA-256), supprimés à la désactivation
- JWT partiel expire en 5 min
- Rate limiting sur la vérification
- Secrets OTP effacés à la désactivation
- Session persistée dans `localStorage` (survit au refresh, nettoyée au logout)

---

## Adaptations vs cours (jour5.md)

| Cours                    | Notre implémentation                                |
| ------------------------ | --------------------------------------------------- |
| `npm`                    | `bun`                                               |
| MySQL / mémoire volatile | PostgreSQL + Prisma                                 |
| Container DI (awilix)    | Injection manuelle dans `main.ts`                   |
| MVC simple               | Onion Architecture                                  |
| 6 use cases + 6 routes   | 5 use cases + 5 routes (recovery mergé dans verify) |
