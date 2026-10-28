créer .env depuis .env.exemple et les remplir
.env global
.env back

docker build -t pit-stop-front . 
depuis dossier  /Front-End

docker compose up
à la racine du projet /pitstop

## côté back

docker exec -it pitstop-php-1 bash
depuis /Back-End pour exécuter les commandes symfony

composer install 
pour avoir les librairies

php bin/console lexik:jwt:generate-keypair
pour avoir les clés ssl pour lexik

symfony console d:m:m
pour créer la base de données

## Côté front

npm install
pour installer les librairies

## Pour réaliser les tests côté back
il faut créer une base de donnée pitstop_test et importer la base de donnée pitstop dedans en enlevant la vérification des clés étrangères dans phpMyAdmin
pour lancer les tests 
docker exec -it pitstop-php-1 bash
vendor/bin/phpunit
