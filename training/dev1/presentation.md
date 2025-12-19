---
marp: true
theme: default
paginate: true
---

# Présentation de la Feature

## "Page de Connexion" - EventHub

**Développeur :** Valentin Musset **Durée :** 15 minutes

---

# Objectifs de la feature

### Contexte

Application EventHub nécessitant une authentification utilisateur

### Objectifs

- Formulaire de connexion avec validation
- Stockage des informations utilisateur dans Redux
- Affichage conditionnel selon l'état d'authentification
- Déconnexion de l'utilisateur

### Technologies utilisées

React, TypeScript, Redux Toolkit, Material-UI

---

# Architecture du projet

```
src/modules/auth/
├── components/       # Composants UI réutilisables
│   ├── EmailField.tsx
│   ├── PasswordField.tsx
│   ├── SubmitButton.tsx
│   ├── LoginForm.tsx
│   └── UserProfile.tsx
├── hooks/            # Logique métier
│   └── useLoginForm.ts
├── pages/            # Pages complètes
│   └── LoginPage.tsx
├── tests/            # Tests unitaires
├── slice.ts          # Redux state
├── selectors.ts      # Redux selectors
└── types.ts          # Interfaces TypeScript
```

---

# Application des principes SOLID

### Single Responsibility (S)

Chaque composant a une seule responsabilité :

- `EmailField` → champ email uniquement
- `PasswordField` → champ mot de passe uniquement

### Open/Closed (O)

Les composants sont fermés à la modification, ouverts à l'extension via les
props

### Dependency Inversion (D)

Les composants dépendent d'abstractions (props) et non d'implémentations
concrètes

---

# Frontend - Composants React

### Composants créés

- **EmailField** : champ email avec validation
- **PasswordField** : champ mot de passe
- **SubmitButton** : bouton de soumission désactivable
- **LoginForm** : composition des champs
- **UserProfile** : affichage post-connexion

### Gestion des états

- `formState.isValid` → validation du formulaire
- `formState.errors` → messages d'erreur
- `isAuthenticated` → état Redux

---

# Frontend - Custom Hook

### useLoginForm

```typescript
const {
    formState, // État du formulaire
    setEmail, // Setter email
    setPassword, // Setter password
    validate, // Validation
    getCredentials, // Récupération des données
    reset, // Réinitialisation
} = useLoginForm();
```

### Avantages

- Séparation UI / logique métier
- Réutilisable dans d'autres contextes
- Testable indépendamment

---

# Tests unitaires

### Tests créés

- **slice.test.ts** : actions login/logout (3 tests)
- **selectors.test.ts** : selectUser, selectIsAuthenticated (4 tests)
- **EmailField.test.ts** : validation du composant (2 tests)
- **PasswordField.test.ts** : validation du composant (2 tests)

### Résultat

```
Test Suites: 4 passed, 4 total
Tests:       11 passed, 11 total ✅
```

---

# Démonstration en direct

### Scénarios à démontrer

1. **Formulaire de connexion**
   - Affichage initial
   - Validation des champs

2. **Erreurs de validation**
   - Email invalide
   - Champs vides

3. **Connexion réussie**
   - Alert de bienvenue
   - Affichage du profil utilisateur

4. **Déconnexion**
   - Retour au formulaire de connexion

---

# Difficultés et solutions

### Problème 1 : Erreurs TypeScript Jest

- **Cause** : Jest globals non reconnus par TypeScript
- **Solution** : Ajout de `"jest"` dans `tsconfig.app.json`

### Problème 2 : Import de composants TSX

- **Cause** : Configuration jsx manquante dans ts-jest
- **Solution** : Ajout de `jsx: 'react-jsx'` dans jest.config.js

### Apprentissages

- Configuration TypeScript pour tests
- Organisation modulaire du code

---

# Conclusion

### Réalisations

✅ Page de connexion fonctionnelle ✅ Architecture SOLID respectée ✅ 11 tests
unitaires passants ✅ Séparation UI / logique métier

### Prochaines étapes

- Intégration avec API backend
- Persistance de session
- Page d'inscription

---

# Questions ?

Merci pour votre attention !
