<?php

namespace App\Controller;

use App\Entity\Vehicle;
use App\Repository\VehicleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Bundle\SecurityBundle\Security;
use Doctrine\ORM\EntityManagerInterface;
use DateTimeImmutable;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\HttpFoundation\Request;

final class VehicleController extends AbstractController
{
    private const GROUPS = ['safety:read', 'vehicle:read'];

    public function __construct(
        private Security $security
    ) {}

    #[Route('/api/vehicle/all', name: 'api_vehicle_all', methods: ['GET'])]
    public function findAll(
        VehicleRepository $vehicleRepository
    ): Response {
        $user = $this->security->getUser();

        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        $vehicleList = $vehicleRepository->findBy(['user' => $user]);

        return $this->json(
            ['vehicles' => $vehicleList],
            200,
            [],
            ['groups' => self::GROUPS]
        );
    }

    #[Route('/api/vehicle/one/{id}', name: 'api_vehicle_one', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function index(
        int $id,
        VehicleRepository $vehicleRepository
    ): Response {
        $user = $this->security->getUser();
        $vehicle = $vehicleRepository->find($id);

        if (!$vehicle) {
            return $this->json(['message' => 'Véhicule introuvable'], 404);
        }

        if (!$user || $vehicle->getUser() !== $user) {
            return $this->json(['message' => 'Accès refusé'], 403);
        }

        return $this->json(
            ['vehicle' => $vehicle],
            200,
            [],
            ['groups' => self::GROUPS]
        );
    }

    #[Route('/api/vehicle/add/', name: 'api_vehicle_add', methods: ['POST'])]
    public function addDone(
        Request $request,
        EntityManagerInterface $em
    ): Response {
        $user = $this->security->getUser();

        if (!$user) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        $parameters = json_decode($request->getContent(), true);

        if (!is_array($parameters)) {
            return $this->json(['message' => 'JSON invalide'], 400);
        }

        foreach ([
            'vehicleType',
            'registrationNumber',
            'brand',
            'model',
            'firstRegistrationDateAt',
            'typeOfFuel',
            'typeOfTransmission',
        ] as $field) {
            if (!isset($parameters[$field]) || $parameters[$field] === '') {
                return $this->json(
                    ['message' => "Le champ $field est obligatoire"],
                    400
                );
            }
        }

        try {
            $vehicle = new Vehicle();
            $vehicle->setUser($user);
            $vehicle->setVehicleType($parameters['vehicleType']);
            $vehicle->setRegistrationNumber($parameters['registrationNumber']);
            $vehicle->setBrand($parameters['brand']);
            $vehicle->setModel($parameters['model']);
            $vehicle->setVersion($parameters['version'] ?? null);
            $vehicle->setFirstRegistrationDateAt(
                new DateTimeImmutable($parameters['firstRegistrationDateAt'])
            );
            $vehicle->setTypeOfFuel($parameters['typeOfFuel']);
            $vehicle->setTypeOfTransmission($parameters['typeOfTransmission']);

            $vehicle->setMileage(
                isset($parameters['mileage']) && $parameters['mileage'] !== ''
                    ? (int) $parameters['mileage']
                    : null
            );

            $vehicle->setKmPerDay(
                isset($parameters['kmPerDay']) && $parameters['kmPerDay'] !== ''
                    ? (int) $parameters['kmPerDay']
                    : null
            );

            $vehicle->setUuid((string) Uuid::v7());

            $em->persist($vehicle);
            $em->flush();

            return $this->json(
                ['vehicle' => $vehicle],
                201,
                [],
                ['groups' => self::GROUPS]
            );
        } catch (\Throwable $error) {
            return $this->json(
                ['message' => 'Impossible de créer le véhicule'],
                400
            );
        }
    }

    #[Route('/api/vehicle/update/{id}', name: 'api_vehicle_update', methods: ['PATCH'], requirements: ['id' => '\d+'])]
    public function update(
        int $id,
        Request $request,
        VehicleRepository $vehicleRepository,
        EntityManagerInterface $em
    ): Response {
        $user = $this->security->getUser();
        $vehicle = $vehicleRepository->find($id);

        if (!$vehicle) {
            return $this->json(['message' => 'Véhicule introuvable'], 404);
        }

        if (!$user || $vehicle->getUser() !== $user) {
            return $this->json(['message' => 'Accès refusé'], 403);
        }

        $parameters = json_decode($request->getContent(), true);

        if (!is_array($parameters)) {
            return $this->json(['message' => 'JSON invalide'], 400);
        }

        try {
            if (isset($parameters['vehicleType']) && $parameters['vehicleType'] !== '') {
                $vehicle->setVehicleType($parameters['vehicleType']);
            }

            if (isset($parameters['registrationNumber']) && $parameters['registrationNumber'] !== '') {
                $vehicle->setRegistrationNumber($parameters['registrationNumber']);
            }

            if (isset($parameters['brand']) && $parameters['brand'] !== '') {
                $vehicle->setBrand($parameters['brand']);
            }

            if (isset($parameters['model']) && $parameters['model'] !== '') {
                $vehicle->setModel($parameters['model']);
            }

            if (array_key_exists('version', $parameters)) {
                $vehicle->setVersion($parameters['version'] ?: null);
            }

            if (!empty($parameters['firstRegistrationDateAt'])) {
                $vehicle->setFirstRegistrationDateAt(
                    new DateTimeImmutable($parameters['firstRegistrationDateAt'])
                );
            }

            if (isset($parameters['typeOfFuel']) && $parameters['typeOfFuel'] !== '') {
                $vehicle->setTypeOfFuel($parameters['typeOfFuel']);
            }

            if (isset($parameters['typeOfTransmission']) && $parameters['typeOfTransmission'] !== '') {
                $vehicle->setTypeOfTransmission($parameters['typeOfTransmission']);
            }

            if (array_key_exists('mileage', $parameters)) {
                $vehicle->setMileage(
                    $parameters['mileage'] === '' || $parameters['mileage'] === null
                        ? null
                        : (int) $parameters['mileage']
                );
            }

            if (array_key_exists('kmPerDay', $parameters)) {
                $vehicle->setKmPerDay(
                    $parameters['kmPerDay'] === '' || $parameters['kmPerDay'] === null
                        ? null
                        : (int) $parameters['kmPerDay']
                );
            }

            $em->flush();

            return $this->json(
                ['vehicle' => $vehicle],
                200,
                [],
                ['groups' => self::GROUPS]
            );
        } catch (\Throwable $error) {
            return $this->json(
                ['message' => 'Impossible de modifier le véhicule'],
                400
            );
        }
    }

    #[Route('/api/vehicle/delete/{id}', name: 'api_vehicle_delete', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function delete(
        int $id,
        VehicleRepository $vehicleRepository,
        EntityManagerInterface $em
    ): Response {
        $user = $this->security->getUser();
        $vehicle = $vehicleRepository->find($id);

        if (!$vehicle) {
            return $this->json(['message' => 'Véhicule introuvable'], 404);
        }

        if (!$user || $vehicle->getUser() !== $user) {
            return $this->json(['message' => 'Accès refusé'], 403);
        }

        $em->remove($vehicle);
        $em->flush();

        return new Response(null, 204);
    }
}
