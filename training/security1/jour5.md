# JOUR 5 (En attente)

<aside>
🚧

Je mets en pause cette ébauche d’intégration de l’**A2F** en attendant d'avoir
un fil rouge plus abouti, avec une base de données MySQL (ou tout autre système
de base de données). L’objectif est également de m’assurer que le fil rouge
réponde pleinement aux attentes prévues pour la semaine de la cybersécurité.

</aside>

<aside>
📌

Cette dernière journée sera dédiée à l’intégration de différents mécanismes de
sécurité dans le projet fil rouge : mise en place d’un système de double
authentification basé sur les **OTP** (**One-Time Password**) et ajout de règles
**CSP** (**Content Security Policy**).

Cette étape s’appuie sur le projet fil rouge développé au cours des sessions
précédentes, en conservant sa logique, sa structure de code et ses conventions
de nommage.

</aside>

**Vidéo de présentation du fonctionnement attendu par l’A2F**

[Projet Fil rouge : Compréhension A2F OTP](http://youtube.com/watch?v=w-_iRRmk8CE)

# Authentification de type OTP (One Time Password)

Nous allons commencer par installer les modules nécessaires :

`npm i otplib`

`npm i qrcode`

`npm i express-rate-limit`

<aside>
📌

**express-rate-limit** devra être utilisé pour limiter à 3 ou 4 soumissions de
code par minute au maximum.

</aside>

## Activation de la double Authentification

Dans la base de données _**-non disponible à la création de ce cours-**_ ajoutez
les champs suivants à la table `users`

```sql
`otp_secret` varchar(40) DEFAULT NULL
`otp_enable` int NOT NULL DEFAULT '0'
```

## ETAPE 1 : Coté Back

<aside>
📌

_**Nous gardons la même conception que ce qui a été fait pour user**_

</aside>

### Ajout des routes liées à la double authentification

Création du fichier **./src/api/routes/a2f.routes.ts**

```tsx
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

export { router as a2fRouter };
```

Prise en compte des routes dans votre application, modifiez le fichier
**./src/api/app.ts**

```tsx
import { a2fRouter } from "./routes/a2f.routes";

//....

app.use("/a2f", a2fRouter);
```

Ajouter une interface pour le QRCode
**./src/shared/interfaces/qr-code-generrator.interface.ts**

```tsx
export interface iQrCode {
    generate(username: string, secret: string): Promise<object>;
}
```

Créer un utilitaire retournant le QrCode
**./src/shared/utils/qr-code-generator.ts**

```tsx
import qrcode from "qrcode";
import { authenticator } from "otplib";
import { IQrCodeGenerator } from "../interfaces/qr-code-generrator.interface";

export class QrCodeGenerator implements IQrCodeGenerator {
    constructor(private readonly appName: string) {}

    async generate(username: string, secret: string) {
        return qrcode.toDataURL(
            authenticator.keyuri(username, this.appName, secret),
        ).then((image) => {
            return Promise.resolve({ image, username, secret });
        });
    }
}
```

_La méthode generate retourne l’image, le username et le secret, car il faudra
afficher le secret pour les utilisateurs ne pouvant pas utiliser l’appareil
photo pour scanner le QrCode._

Déclarez **APP_NAME** si ce n’est pas déjà fait dans votre fichier **.env**

```bash
JWT_SECRET=<VOTRE_JWT_SECRET>
APP_NAME=<NOM_DE_VOTRE_APP>
```

Nous devons ajouter **QrCodeGenerator** à notre injecteur de dépendances, en
modifiant le fichier **./src/api/config/dependency-injection.ts** (on en profite
pour récupérer la variable d’environnement **APP_NAME**).

```tsx
import { QrCodeGenerator } from "../../shared/utils/qr-code-generator";

//....

const appName = getEnv("APP_NAME");
//....

export interface Dependencies {
    //....
    qrCodeGenerator: QrCodeGenerator;
}

//....

container.register({
    appName: asValue(appName),
    //....
    qrCodeGenerator: asClass(QrCodeGenerator).singleton(),
});

export default container;
```

Nous allons maintenant pouvoir créer une route pour récupérer les informations
pour proposer d’activer la double authentification. Commencons par créer le
controller.

Ajoutons notre route (et importons le controller que nous allons créer dans la
foulée) pour récupérer le QrCode dans notre fichier
**./src/api/routes/a2f.routes.ts**

```tsx
import { qrCode } from "../controllers/a2f.controller";

//....
router.get("/qrcode", qrCode);

export { router as a2fRouter };
```

Créez le controller **./src/api/controllers/a2f.controller.ts**

```tsx
import { NextFunction, Request, Response } from "express";
import container from "../config/dependency-injection";
import { authenticator } from "otplib";

export const qrCode = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<any> => {
    try {
        if (!req.user) {
            return res.jsonError("Vous n'êtes pas connecté", 401);
        }

        const secret = authenticator.generateSecret();
        const qrCodeGenerator = await container.resolve("qrCodeGenerator");
        const qrCode = await qrCodeGenerator.generate(req.user.email, secret);

        return res.jsonSuccess({ qrCode }, 200);
    } catch (error) {
        next(error);
    }
};
```

---

En effectuant un appel en **n’étant pas authentifié,** vous devriez recevoir une
réponse du type :

![image.png](attachment:b3290c7e-b74e-45c9-8011-3728b162672f:image.png)

En effectuant un appel en **étant authentifié,** vous devriez recevoir une
réponse du type :

![image.png](attachment:3a5e9374-2dc2-428e-b66a-26b806b93a95:image.png)

_le qrCode (l’image en base64), à été “croppé” dans la capture._

---

Modifier l’entité User **./src/domain/entities/user.entity.ts** pour y ajouter
OTPSettings

```tsx
import { Role } from "../enums/role.enum";

export interface OTPSettings {
    secret: string;
    enabled: boolean;
}

//....
```

**Implémentez par vous même l’interface pour afficher l’interface
d’activation.**

## BONUS Coté Front

**FRONT:** Apportez une petite amélioration en ajoutant un fichier
**./src/services/axiosInstanceApi.ts** afin d’y définir 2 fonctions axios
pré-configurées, afin de ne pas avoir à modifier tout les fichiers utilisant
axios (pour définir une nouvelle adresse par exemple pour une mise en ligne).

```tsx
import axios from "axios";
import type { AxiosRequestConfig } from "axios";

const baseURL = "http://localhost:8000";

const createAxiosInstance = (options: AxiosRequestConfig = {}) =>
    axios.create({
        baseURL,
        timeout: 5000,
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

export const axiosWithAuthApi = createAxiosInstance();

export const axiosWithoutAuthApi = createAxiosInstance({
    withCredentials: false,
});
```

## ETAPE 2 : Coté Back

<aside>
📌

_**Nous gardons la même conception que ce qui a été fait pour user**_

</aside>

Nous allons maintenant intégrer un système de codes de secours, ce système
permet en cas de soucis pour l’utilisateur comme perte de la configuration de
OTP de pouvoir se connecter.

Exemple d’une structure SQL pour code de secours, vous pouvez imaginer une autre
structure SQL si vous le souhaitez.

Dans la base de données _**-non disponible à la création de ce cours-**_ Dans la
version actuelle tout est mémorisé dans un objet (mémoire volatile)

```sql
CREATE TABLE IF NOT EXISTS `a2f_backup_codes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `codes` text NOT NULL,
  `nb_code_used` int NOT NULL DEFAULT '0',
  `nb_consecutive_tests` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1;
COMMIT;
```

Créez en premier lieu l’entité
****./src/domain/entities/otp-backup-code.entity.ts**

```tsx
export interface OtpBackupCodeProps {
    id: number;
    user_id: string; /* pas en number car défini en string dans l'entity user */
    codes: string;
    nb_code_used: number;
    nb_consecutive_tests: number;
}

export class OtpBackupCode {
    constructor(public props: OtpBackupCodeProps) {}

    validateOrThrow() {
        if (!this.props.codes) {
            throw new Error("codes is required");
        }

        if (
            typeof this.props.nb_code_used !== "number" ||
            this.props.nb_code_used < 0
        ) {
            throw new Error("nb_code_used is required");
        }

        if (
            typeof this.props.nb_consecutive_tests !== "number" ||
            this.props.nb_consecutive_tests < 0
        ) {
            throw new Error("nb_consecutive_tests is required");
        }
    }
}
```

Créez une interface pour le repository
**./src/domain/interfaces/otp-backup-code-repository.interface.ts**

```tsx
import { OtpBackupCode } from "../../domain/entities/otp-backup-code.entity";

export interface IOtpBackupCodeRepository {
    save(codeBackup: OtpBackupCode): Promise<OtpBackupCode>;
    findByUserId(id: string): Promise<OtpBackupCode | null>;
}
```

Créez le repository
**./src/infrastructure/repositories/memory-otp-backup-code-repository.ts**

```tsx
import { OtpBackupCode } from "../../domain/entities/otp-backup-code.entity";
import { IOtpBackupCodeRepository } from "../../domain/interfaces/otp-backup-code-repository.interface";

export class MemoryOtpBackupCodeRepository implements IOtpBackupCodeRepository {
    private codesBackup: OtpBackupCode[] = [];

    async save(codeBackup: OtpBackupCode): Promise<OtpBackupCode> {
        this.codesBackup.push(codeBackup);

        return codeBackup;
    }

    async findByUserId(id: string): Promise<OtpBackupCode | null> {
        return this.codesBackup.find((codesBackup) =>
            codesBackup.props.user_id === id
        ) ?? null;
    }
}
```
