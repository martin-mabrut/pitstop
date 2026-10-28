<?php

namespace App\DataFixtures;

use App\Factory\RepairsFactory;
use App\Factory\SafetyInspectionFactory;
use App\Factory\UserFactory;
use App\Factory\VehicleFactory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // $product = new Product();
        // $manager->persist($product);

        $oskour = UserFactory::createOne(['uuid' => '128128128128128', 'email' => 'oskour@oskour.com', 'password' => '$2y$13$nj8zKix5EsbR1qHtxzosOemYMMtiVq8WTFpq46CMj9hVgCPfGyEFW', "username" => 'oskour']);
        $patrick = UserFactory::createOne(['uuid' => 'DFSDFQIJ732763RT7', 'email' => 'pat@pat.com', 'password' => '$2y$13$nj8zKix5EsbR1qHtxzosOemYMMtiVq8WTFpq46CMj9hVgCPfGyEFW', "username" => 'patrick']);
        $cedric = UserFactory::createOne(['uuid' => 'HSB368DH', 'email' => 'ced@ced.com', 'password' => '$2y$13$nj8zKix5EsbR1qHtxzosOemYMMtiVq8WTFpq46CMj9hVgCPfGyEFW', "username" => 'cedric']);
        $joe = UserFactory::createOne(['uuid' => 'QEFDJIDJF097', 'email' => 'joe@joe.com', 'password' => '$2y$13$nj8zKix5EsbR1qHtxzosOemYMMtiVq8WTFpq46CMj9hVgCPfGyEFW', "username" => 'joe']);

        [$twingo, $peugeot308, $mt07, $c3, $kangoo, $classeA, $tesla, $yaris, $golf, $vespa] = VehicleFactory::createSequence([
            // oskour
            ['user' => $oskour, 'uuid' => 'VEH-OSK-001', 'vehicleType' => 'Voiture', 'registrationNumber' => 'AM-264-CG', 'brand' => 'Renault', 'model' => 'Twingo', 'version' => 'Authentique', 'firstRegistrationDateAt' => new \DateTimeImmutable('2012-03-15'), 'typeOfFuel' => 'Essence', 'typeOfTransmission' => 'Manuelle', 'mileage' => 128000, 'kmPerDay' => 20],
            ['user' => $oskour, 'uuid' => 'VEH-OSK-002', 'vehicleType' => 'Voiture', 'registrationNumber' => 'FG-781-TR', 'brand' => 'Peugeot', 'model' => '308', 'version' => 'Allure', 'firstRegistrationDateAt' => new \DateTimeImmutable('2019-06-02'), 'typeOfFuel' => 'Diesel', 'typeOfTransmission' => 'Automatique', 'mileage' => 74500, 'kmPerDay' => 45],
            ['user' => $oskour, 'uuid' => 'VEH-OSK-003', 'vehicleType' => 'Moto', 'registrationNumber' => 'GH-102-ZK', 'brand' => 'Yamaha', 'model' => 'MT-07', 'version' => null, 'firstRegistrationDateAt' => new \DateTimeImmutable('2021-04-20'), 'typeOfFuel' => 'Essence', 'typeOfTransmission' => 'Manuelle', 'mileage' => 15300, 'kmPerDay' => 10],

            // patrick
            ['user' => $patrick, 'uuid' => 'VEH-PAT-001', 'vehicleType' => 'Voiture', 'registrationNumber' => 'BD-564-CG', 'brand' => 'Citroën', 'model' => 'C3', 'version' => 'Feel', 'firstRegistrationDateAt' => new \DateTimeImmutable('2016-09-10'), 'typeOfFuel' => 'Essence', 'typeOfTransmission' => 'Manuelle', 'mileage' => 98000, 'kmPerDay' => 30],
            ['user' => $patrick, 'uuid' => 'VEH-PAT-002', 'vehicleType' => 'Utilitaire', 'registrationNumber' => 'EK-339-PL', 'brand' => 'Renault', 'model' => 'Kangoo', 'version' => 'Confort', 'firstRegistrationDateAt' => new \DateTimeImmutable('2017-01-25'), 'typeOfFuel' => 'Diesel', 'typeOfTransmission' => 'Manuelle', 'mileage' => 162000, 'kmPerDay' => 60],

            // cedric
            ['user' => $cedric, 'uuid' => 'VEH-CED-001', 'vehicleType' => 'Voiture', 'registrationNumber' => 'GT-450-MB', 'brand' => 'Mercedes', 'model' => 'Classe A', 'version' => 'A200', 'firstRegistrationDateAt' => new \DateTimeImmutable('2022-02-14'), 'typeOfFuel' => 'Essence', 'typeOfTransmission' => 'Automatique', 'mileage' => 32000, 'kmPerDay' => 35],
            ['user' => $cedric, 'uuid' => 'VEH-CED-002', 'vehicleType' => 'Voiture', 'registrationNumber' => 'FX-908-EV', 'brand' => 'Tesla', 'model' => 'Model 3', 'version' => 'Propulsion', 'firstRegistrationDateAt' => new \DateTimeImmutable('2020-11-05'), 'typeOfFuel' => 'Électrique', 'typeOfTransmission' => 'Automatique', 'mileage' => 58000, 'kmPerDay' => 40],
            ['user' => $cedric, 'uuid' => 'VEH-CED-003', 'vehicleType' => 'Voiture', 'registrationNumber' => 'DA-217-HY', 'brand' => 'Toyota', 'model' => 'Yaris', 'version' => 'Hybride Dynamic', 'firstRegistrationDateAt' => new \DateTimeImmutable('2015-05-30'), 'typeOfFuel' => 'Hybride', 'typeOfTransmission' => 'Automatique', 'mileage' => 121000, 'kmPerDay' => 25],

            // joe
            ['user' => $joe, 'uuid' => 'VEH-JOE-001', 'vehicleType' => 'Voiture', 'registrationNumber' => 'CR-633-VW', 'brand' => 'Volkswagen', 'model' => 'Golf', 'version' => 'GTI', 'firstRegistrationDateAt' => new \DateTimeImmutable('2013-07-18'), 'typeOfFuel' => 'Essence', 'typeOfTransmission' => 'Manuelle', 'mileage' => 176000, 'kmPerDay' => 50],
            ['user' => $joe, 'uuid' => 'VEH-JOE-002', 'vehicleType' => 'Scooter', 'registrationNumber' => 'GK-071-SC', 'brand' => 'Piaggio', 'model' => 'Vespa Primavera', 'version' => '125', 'firstRegistrationDateAt' => new \DateTimeImmutable('2023-03-08'), 'typeOfFuel' => 'Essence', 'typeOfTransmission' => 'Automatique', 'mileage' => 4200, 'kmPerDay' => 8],
        ]);

        RepairsFactory::createSequence([
            // Renault Twingo
            ['vehicle' => $twingo, 'typeOfRepairs' => 'Vidange', 'repairedAt' => new \DateTimeImmutable('2023-02-10'), 'description' => 'Vidange moteur et remplacement du filtre à huile', 'price' => 89.90],
            ['vehicle' => $twingo, 'typeOfRepairs' => 'Freins', 'repairedAt' => new \DateTimeImmutable('2023-09-22'), 'description' => 'Remplacement des plaquettes avant', 'price' => 145.00],
            ['vehicle' => $twingo, 'typeOfRepairs' => 'Pneus', 'repairedAt' => new \DateTimeImmutable('2024-04-05'), 'description' => 'Changement des 2 pneus avant', 'price' => 160.00],
            ['vehicle' => $twingo, 'typeOfRepairs' => 'Batterie', 'repairedAt' => new \DateTimeImmutable('2025-01-18'), 'description' => 'Remplacement de la batterie', 'price' => 119.00],

            // Peugeot 308
            ['vehicle' => $peugeot308, 'typeOfRepairs' => 'Révision', 'repairedAt' => new \DateTimeImmutable('2022-06-14'), 'description' => 'Révision constructeur des 40 000 km', 'price' => 289.00],
            ['vehicle' => $peugeot308, 'typeOfRepairs' => 'Climatisation', 'repairedAt' => new \DateTimeImmutable('2023-07-03'), 'description' => 'Recharge du circuit de climatisation', 'price' => 79.00],
            ['vehicle' => $peugeot308, 'typeOfRepairs' => 'Freins', 'repairedAt' => new \DateTimeImmutable('2024-05-27'), 'description' => 'Disques et plaquettes avant', 'price' => 340.00],

            // Yamaha MT-07
            ['vehicle' => $mt07, 'typeOfRepairs' => 'Révision', 'repairedAt' => new \DateTimeImmutable('2022-04-12'), 'description' => 'Révision des 1 000 km', 'price' => 150.00],
            ['vehicle' => $mt07, 'typeOfRepairs' => 'Chaîne', 'repairedAt' => new \DateTimeImmutable('2023-08-30'), 'description' => 'Remplacement du kit chaîne', 'price' => 230.00],
            ['vehicle' => $mt07, 'typeOfRepairs' => 'Pneus', 'repairedAt' => new \DateTimeImmutable('2024-06-11'), 'description' => 'Pneu arrière', 'price' => 175.00],

            // Citroën C3
            ['vehicle' => $c3, 'typeOfRepairs' => 'Vidange', 'repairedAt' => new \DateTimeImmutable('2022-10-04'), 'description' => 'Vidange et filtres', 'price' => 95.00],
            ['vehicle' => $c3, 'typeOfRepairs' => 'Distribution', 'repairedAt' => new \DateTimeImmutable('2023-11-20'), 'description' => 'Remplacement de la courroie de distribution', 'price' => 520.00],
            ['vehicle' => $c3, 'typeOfRepairs' => 'Essuie-glaces', 'repairedAt' => new \DateTimeImmutable('2024-02-08'), 'description' => 'Balais avant et arrière', 'price' => 35.00],
            ['vehicle' => $c3, 'typeOfRepairs' => 'Échappement', 'repairedAt' => new \DateTimeImmutable('2025-03-15'), 'description' => 'Remplacement du silencieux arrière', 'price' => 210.00],

            // Renault Kangoo
            ['vehicle' => $kangoo, 'typeOfRepairs' => 'Embrayage', 'repairedAt' => new \DateTimeImmutable('2022-12-01'), 'description' => 'Remplacement du kit embrayage', 'price' => 780.00],
            ['vehicle' => $kangoo, 'typeOfRepairs' => 'Vidange', 'repairedAt' => new \DateTimeImmutable('2023-06-19'), 'description' => 'Vidange et filtre à gasoil', 'price' => 120.00],
            ['vehicle' => $kangoo, 'typeOfRepairs' => 'Amortisseurs', 'repairedAt' => new \DateTimeImmutable('2024-09-09'), 'description' => 'Amortisseurs arrière', 'price' => 310.00],

            // Mercedes Classe A
            ['vehicle' => $classeA, 'typeOfRepairs' => 'Révision', 'repairedAt' => new \DateTimeImmutable('2023-03-02'), 'description' => 'Entretien Service A', 'price' => 320.00],
            ['vehicle' => $classeA, 'typeOfRepairs' => 'Pneus', 'repairedAt' => new \DateTimeImmutable('2024-01-16'), 'description' => 'Montage de 4 pneus hiver', 'price' => 640.00],
            ['vehicle' => $classeA, 'typeOfRepairs' => 'Carrosserie', 'repairedAt' => new \DateTimeImmutable('2024-08-23'), 'description' => 'Réparation du pare-chocs arrière', 'price' => 450.00],

            // Tesla Model 3
            ['vehicle' => $tesla, 'typeOfRepairs' => 'Pneus', 'repairedAt' => new \DateTimeImmutable('2022-05-10'), 'description' => 'Permutation et équilibrage', 'price' => 60.00],
            ['vehicle' => $tesla, 'typeOfRepairs' => 'Climatisation', 'repairedAt' => new \DateTimeImmutable('2023-04-28'), 'description' => 'Remplacement du filtre d\'habitacle', 'price' => 55.00],
            ['vehicle' => $tesla, 'typeOfRepairs' => 'Freins', 'repairedAt' => new \DateTimeImmutable('2024-03-12'), 'description' => 'Liquide de frein', 'price' => 90.00],
            ['vehicle' => $tesla, 'typeOfRepairs' => 'Pare-brise', 'repairedAt' => new \DateTimeImmutable('2025-02-04'), 'description' => 'Remplacement du pare-brise', 'price' => 890.00],

            // Toyota Yaris
            ['vehicle' => $yaris, 'typeOfRepairs' => 'Révision', 'repairedAt' => new \DateTimeImmutable('2022-07-07'), 'description' => 'Révision des 100 000 km', 'price' => 260.00],
            ['vehicle' => $yaris, 'typeOfRepairs' => 'Batterie', 'repairedAt' => new \DateTimeImmutable('2023-10-30'), 'description' => 'Batterie 12V', 'price' => 140.00],
            ['vehicle' => $yaris, 'typeOfRepairs' => 'Freins', 'repairedAt' => new \DateTimeImmutable('2024-11-05'), 'description' => 'Plaquettes arrière', 'price' => 130.00],

            // Volkswagen Golf
            ['vehicle' => $golf, 'typeOfRepairs' => 'Distribution', 'repairedAt' => new \DateTimeImmutable('2022-09-15'), 'description' => 'Kit distribution et pompe à eau', 'price' => 690.00],
            ['vehicle' => $golf, 'typeOfRepairs' => 'Vidange', 'repairedAt' => new \DateTimeImmutable('2023-05-24'), 'description' => 'Vidange et filtre à air', 'price' => 110.00],
            ['vehicle' => $golf, 'typeOfRepairs' => 'Turbo', 'repairedAt' => new \DateTimeImmutable('2024-02-29'), 'description' => 'Remplacement du turbo', 'price' => 1450.00],
            ['vehicle' => $golf, 'typeOfRepairs' => 'Pneus', 'repairedAt' => new \DateTimeImmutable('2025-04-02'), 'description' => 'Changement des 4 pneus', 'price' => 480.00],

            // Vespa Primavera
            ['vehicle' => $vespa, 'typeOfRepairs' => 'Révision', 'repairedAt' => new \DateTimeImmutable('2023-09-12'), 'description' => 'Première révision', 'price' => 95.00],
            ['vehicle' => $vespa, 'typeOfRepairs' => 'Courroie', 'repairedAt' => new \DateTimeImmutable('2024-07-01'), 'description' => 'Remplacement de la courroie de transmission', 'price' => 85.00],
            ['vehicle' => $vespa, 'typeOfRepairs' => 'Éclairage', 'repairedAt' => new \DateTimeImmutable('2025-01-27'), 'description' => 'Ampoule de phare avant', 'price' => 25.00],
        ]);

        // Pour chaque véhicule, le dernier contrôle (à venir ou en retard) a doneAt = null
        SafetyInspectionFactory::createSequence([
            // Renault Twingo
            ['vehicle' => $twingo, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2022-03-15'), 'doneAt' => new \DateTime('2022-03-01')],
            ['vehicle' => $twingo, 'type' => 'Contre-visite', 'dueTimeAt' => new \DateTime('2022-05-01'), 'doneAt' => new \DateTime('2022-04-20')],
            ['vehicle' => $twingo, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2024-03-15'), 'doneAt' => new \DateTime('2024-03-08')],
            ['vehicle' => $twingo, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2026-03-15'), 'doneAt' => null],

            // Peugeot 308
            ['vehicle' => $peugeot308, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2023-06-02'), 'doneAt' => new \DateTime('2023-05-20')],
            ['vehicle' => $peugeot308, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2025-06-02'), 'doneAt' => new \DateTime('2025-05-28')],
            ['vehicle' => $peugeot308, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2027-06-02'), 'doneAt' => null],

            // Yamaha MT-07
            ['vehicle' => $mt07, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2024-10-15'), 'doneAt' => new \DateTime('2024-10-01')],
            ['vehicle' => $mt07, 'type' => 'Contre-visite', 'dueTimeAt' => new \DateTime('2024-12-15'), 'doneAt' => new \DateTime('2024-12-02')],
            ['vehicle' => $mt07, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2027-10-15'), 'doneAt' => null],

            // Citroën C3
            ['vehicle' => $c3, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2020-09-10'), 'doneAt' => new \DateTime('2020-08-25')],
            ['vehicle' => $c3, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2022-09-10'), 'doneAt' => new \DateTime('2022-09-01')],
            ['vehicle' => $c3, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2024-09-10'), 'doneAt' => new \DateTime('2024-09-03')],
            ['vehicle' => $c3, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2026-09-10'), 'doneAt' => null],

            // Renault Kangoo
            ['vehicle' => $kangoo, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2023-01-25'), 'doneAt' => new \DateTime('2023-01-20')],
            ['vehicle' => $kangoo, 'type' => 'Contre-visite', 'dueTimeAt' => new \DateTime('2023-03-20'), 'doneAt' => new \DateTime('2023-03-10')],
            ['vehicle' => $kangoo, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2025-01-25'), 'doneAt' => new \DateTime('2025-01-14')],
            ['vehicle' => $kangoo, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2027-01-25'), 'doneAt' => null],

            // Mercedes Classe A
            ['vehicle' => $classeA, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2026-02-14'), 'doneAt' => new \DateTime('2026-02-03')],
            ['vehicle' => $classeA, 'type' => 'Contre-visite', 'dueTimeAt' => new \DateTime('2026-04-10'), 'doneAt' => new \DateTime('2026-03-30')],
            ['vehicle' => $classeA, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2028-02-14'), 'doneAt' => null],

            // Tesla Model 3
            ['vehicle' => $tesla, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2024-11-05'), 'doneAt' => new \DateTime('2024-10-22')],
            ['vehicle' => $tesla, 'type' => 'Contre-visite', 'dueTimeAt' => new \DateTime('2024-12-20'), 'doneAt' => new \DateTime('2024-12-10')],
            ['vehicle' => $tesla, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2026-11-05'), 'doneAt' => null],

            // Toyota Yaris
            ['vehicle' => $yaris, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2021-05-30'), 'doneAt' => new \DateTime('2021-05-21')],
            ['vehicle' => $yaris, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2023-05-30'), 'doneAt' => new \DateTime('2023-05-25')],
            ['vehicle' => $yaris, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2025-05-30'), 'doneAt' => new \DateTime('2025-05-12')],
            ['vehicle' => $yaris, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2027-05-30'), 'doneAt' => null],

            // Volkswagen Golf
            ['vehicle' => $golf, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2021-07-18'), 'doneAt' => new \DateTime('2021-07-05')],
            ['vehicle' => $golf, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2023-07-18'), 'doneAt' => new \DateTime('2023-07-10')],
            ['vehicle' => $golf, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2025-07-18'), 'doneAt' => new \DateTime('2025-07-02')],
            ['vehicle' => $golf, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2027-07-18'), 'doneAt' => null],

            // Vespa Primavera
            ['vehicle' => $vespa, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2025-03-08'), 'doneAt' => new \DateTime('2025-02-20')],
            ['vehicle' => $vespa, 'type' => 'Contre-visite', 'dueTimeAt' => new \DateTime('2025-05-01'), 'doneAt' => new \DateTime('2025-04-15')],
            ['vehicle' => $vespa, 'type' => 'Périodique', 'dueTimeAt' => new \DateTime('2028-03-08'), 'doneAt' => null],
        ]);

        $manager->flush();
    }
}
