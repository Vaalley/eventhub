---
marp: true
theme: default
paginate: true
---

# EventHub - Dev 3

## Authentification, Performances & UX

**Présentation technique - Semaine 3**

---

# 1. Introduction

- **Projet EventHub** : Plateforme de gestion d'événements
- **Stack** : React + MUI / Express + Prisma (Back)
- **Objectifs** :
  - Authentification JWT en cookie HTTP-only
  - Dashboard de statistiques (MongoDB)
  - Lazy loading + Pagination

---

# 2. Authentification - JWT en Cookie

**Pourquoi cookie HTTP-only ?**

| localStorage   | Cookie HTTP-Only |
| -------------- | ---------------- |
| Accessible JS  | Invisible JS     |
| Vulnérable XSS | Protégé XSS      |

```typescript
res.cookie("token", jwt, {
	httpOnly: true, // Pas d'accès JavaScript
	secure: true, // HTTPS uniquement
	sameSite: "strict", // Protection CSRF
});
```

---

# 3. Sécurisation des routes

**Backend** : Middleware lit le cookie

```typescript
const token = req.cookies.token;
const decoded = jwt.verify(token, JWT_SECRET);
req.user = decoded;
```

**Frontend** : Routes protégées + credentials

```tsx
fetch("/api/...", { credentials: "include" });
{
	isAuthenticated ? <Dashboard /> : <Navigate to="/login" />;
}
```

---

# 4. Redux - Gestion d'état

```typescript
const authSlice = createSlice({
	name: "auth",
	initialState: { user: null, isAuthenticated: false },
	reducers: {
		loginSuccess: (state, action) => {
			state.isAuthenticated = true;
			state.user = action.payload.user;
		},
		logout: (state) => {
			state.isAuthenticated = false;
			state.user = null;
		},
	},
});
```

**Note** : Le token n'est plus dans Redux (cookie HTTP-only)

---

# 5. Flux de connexion

```
User submit form
      ↓
fetch('/api/auth/login', { credentials: 'include' })
      ↓
Backend valide → Set-Cookie: token=JWT
      ↓
dispatch(loginSuccess({ user }))
      ↓
Redirection vers Profile
```

---

# 6. Dashboard - Analytics

**Objectif** : Statistiques d'utilisation (MongoDB)

```typescript
// Hook de tracking
export function usePageTracking(path: string) {
	const tracked = useRef(false);
	useEffect(() => {
		if (tracked.current) return;
		tracked.current = true;
		analyticsApi.trackPageView(path);
	}, [path]);
}
```

**Affichage** : Total vues, top pages, vues par jour

---

# 7. Lazy Loading

**Problème** : Bundle JS volumineux au chargement

**Solution** : Charger à la demande

```tsx
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const EventsListPage = lazy(() => import('./pages/EventsListPage'))

<Suspense fallback={<CircularProgress />}>
  <Routes>
    <Route path="/dashboard" element={<DashboardPage />} />
  </Routes>
</Suspense>
```

---

# 8. Pagination

**Backend** : Offset-based

```typescript
async findAllPaginated({ page, limit }) {
  const skip = (page - 1) * limit
  const [data, total] = await Promise.all([
    prisma.event.findMany({ skip, take: limit }),
    prisma.event.count(),
  ])
  return { data, total, page, totalPages: Math.ceil(total / limit) }
}
```

**Frontend** : MUI Pagination component

---

# 9. Démonstration

1. **Connexion** : Login avec email/password
2. **Accès sécurisé** : Redirection si non connecté
3. **Events** : Liste paginée (50 événements)
4. **Dashboard** : Statistiques de pages vues
5. **Lazy loading** : Chargement différé

---

# 10. Difficultés & Choix techniques

| Problème                     | Solution                                                   |
| ---------------------------- | ---------------------------------------------------------- |
| Double tracking (StrictMode) | useRef pour bloquer                                        |
| token cookie HTTP-only       | Redux pour l'état utilisateur (pas de token dans le store) |

---

# 11. Conclusion

**Compétences acquises** :

- Authentification JWT sécurisée (HTTP-only cookies)
- Optimisation (lazy loading, pagination)
- Analytics avec MongoDB

**Améliorations possibles** : Refresh token, Rate limiting, Tests E2E

---

# 12. Merci !

**Questions ?**
