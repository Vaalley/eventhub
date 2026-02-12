---
marp: true
theme: default
paginate: true
---

<!-- _class: lead -->

# Soutenance Sécurité 1

## EventHub - Double Authentification (2FA)

**Projet:** Plateforme de gestion d'événements

---

# 1. Introduction

- **EventHub** : plateforme de gestion d'événements et billetterie
- **Stack** : Bun + Express + Prisma + PostgreSQL + React + Redux
- **Objectif** : Ajouter la double authentification (TOTP + recovery codes)
- **Architecture** : Onion Architecture + SOLID

---

# 2. Implémentation OTP

## QR Code pour la configuration

```
Setup OTP → Génère un secret TOTP
         → Crée une URI otpauth://
         → Encode en QR Code (base64)
         → L'utilisateur scanne avec Google Authenticator
```

## Vérification

- L'utilisateur entre le code 6 chiffres
- Le backend vérifie avec `otplib` (TOTP, fenêtre de 30s)
- Si valide → JWT complet (24h)

---

# 2. Recovery Codes

## Génération

- 8 codes aléatoires générés à l'activation de la 2FA
- Affichés **une seule fois** à l'utilisateur
- Hashés en **SHA-256** avant stockage en BDD

## Utilisation

- Alternative si l'utilisateur perd son authenticator
- Chaque code est **usage unique** (marqué `used` après vérification)
- Supprimés quand la 2FA est désactivée

---

# 3. Frontend - UX

## Flux utilisateur

```
Register → Login → Profile
                     ├── Enable 2FA → QR → Verify → Recovery Codes
                     └── Disable 2FA
```

## Écrans

- **LoginPage** — Email + mot de passe
- **OtpVerifyPage** — Code OTP ou recovery code
- **UserProfile** — Statut 2FA, enable/disable
- **TwoFactorSetup** — QR code, vérification, recovery codes

---

# 3. Frontend - Cohérence

## Choix techniques

- **React + Redux + MUI** — cohérent avec l'existant
- **Auth slice** — 4 actions Redux
- **localStorage** — session persistée au refresh
- **API relative** `/api` — proxy nginx

## UX

- Routing conditionnel selon `requireOtp`
- Toggle login/register sans rechargement

---

# 4. Sécurité - Bonnes pratiques MFA

## Mots de passe

- Hashés avec **bcrypt** (via `Bun.password`)

## JWT partiel

- Si 2FA activée, le login retourne un token **partiel** (`otpPending: true`)
- Expire en **5 minutes**
- N'autorise que la route `/otp/verify`

## Middleware `requireFullAuth`

- Refuse l'accès aux routes protégées si `otpPending` est true

---

# 4. Sécurité - Recovery codes & Rate Limiting

## Recovery codes

- Hashés en **SHA-256** avant stockage (jamais en clair)
- **Supprimés** quand la 2FA est désactivée
- Le secret OTP est aussi effacé

## Limitation de tentatives

- **Rate limiter** : 4 tentatives / minute sur `/otp/verify`
- Protège contre le brute force

---

# 4. Sécurité - Accès conditionnel

## Matrice d'accès

| Route              | Token requis     | OTP complété |
| ------------------ | ---------------- | ------------ |
| `POST /register`   | Non              | -            |
| `POST /login`      | Non              | -            |
| `POST /otp/verify` | Oui (partiel OK) | Non          |
| `GET /otp/setup`   | Oui              | Oui          |
| `DELETE /otp`      | Oui              | Oui          |

Un token partiel ne donne accès qu'à la vérification OTP.

---

# 5. Documentation technique

## Swagger

- Endpoints auth documentés via `swagger-jsdoc`
- Accessible sur `/api-docs`

## Documentation du code

- Architecture backend documentée (5 use cases, 5 routes)
- Flux d'utilisation détaillés
- Adaptations par rapport au cours

---

# 6. Conclusion

- **Compétences** : TOTP, recovery codes, JWT partiel, intégration full-stack
- **Difficultés** : API `otplib` v14 async, dépendances Bun en Docker
- **Améliorations** : Refresh tokens, tests unitaires auth

---

<!-- _class: lead -->

# Merci !
