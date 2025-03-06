Simple application intérragisant avec l'api d'infomaniak, principalement pour la fonctionnalité du drive (stockage).

Pour faire fonctionner l'application il faut créer un fichier .env et le compléter avec le .env.example (les informations nécéssaires sont sur son compte Infomaniak, il faut créer un token: https://www.infomaniak.com/fr/support/faq/2582/ajouter-et-gerer-les-tokens-api-infomaniak).

To-Do :

- Fonction pour vérifier connexion et refaire les requêtes toutes les 30 secondes si problème de connexion
- Fonction pour téléverser fichier
- Faire une petite documentation des routes de l'api utilisés
- Créer un serveur express avec les fonctionnalités de l'application
- Créer un affichage simple (react ou vue.js)