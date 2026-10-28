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
use Symfony\Component\Validator\Constraints as Assert;

final class VehicleController extends AbstractController
{
    public function __construct(private Security $security) {}
    #[Route('/api/vehicle/all', name: 'api_vehicle_all', methods: ['GET'])]
    public function findAll(VehicleRepository $vehicleRepository): Response
    {
        $user = $this->security->getUser();
        $vehicleList = $vehicleRepository->findBy(["user" => $user]);
        return $this->json(['vehicles' => $vehicleList], 200, [], ['groups' => ['safety:read']]);
    }

    #[Route('/api/vehicle/one/{id}', name: 'api_vehicle_one', methods: ['GET'])]
    public function index(int $id, VehicleRepository $vehicleRepository): Response
    {
        $user = $this->security->getUser();
        $vehicle = $vehicleRepository->find($id);
        if ($vehicle === null) {
            return new Response("Vehicle not found", 404);
        }
        if ($vehicle->getUser() != $user) {
            return new Response("Invalid credentials", 403);
        }
        return $this->json(['vehicle' => $vehicle], 200, [], ['groups' => ['safety:read']]);
    }

    #[Route('/api/vehicle/add/', name: 'api_vehicle_add', methods: ['POST'])]
    public function addDone(Request $request, EntityManagerInterface $em): Response
    {
        $user = $this->security->getUser();
        $parameters = json_decode($request->getContent(), true);

        if (!is_array($parameters)) {
            return new Response('Invalid JSON', 400);
        }

        $vehicle = new Vehicle();
        $vehicle->setUser($user);
        $vehicle->setVehicleType($parameters['vehicleType']);
        $vehicle->setRegistrationNumber($parameters['registrationNumber']);
        $vehicle->setBrand($parameters['brand']);
        $vehicle->setModel($parameters['model']);
        if ($parameters['version'] !== "") {
            $vehicle->setVersion($parameters['version']);
        }
        $vehicle->setFirstRegistrationDateAt(new DateTimeImmutable($parameters['firstRegistrationDateAt']));
        $vehicle->setTypeOfFuel($parameters['typeOfFuel']);
        $vehicle->setTypeOfTransmission($parameters['typeOfTransmission']);
        if ($parameters['mileage'] !== "") {
            $vehicle->setMileage($parameters['mileage']);
        }

        if ($parameters['kmPerDay'] !== "") {
            $vehicle->setKmPerDay($parameters['kmPerDay']);
        }
        $uuid = Uuid::v7();
        $vehicle->setUuid($uuid);
        $em->persist($vehicle);
        $em->flush();

        return $this->json(['vehicle' => $vehicle], 201, [], ['groups' => ['vehicle:read']]);
    }

    #[Route('/api/vehicle/update/{id}', name: 'api_vehicle_update', methods: ['PATCH'], requirements: ['id' => '\d+'])]
    public function update(int $id, Request $request, VehicleRepository $vehicleRepository, EntityManagerInterface $em): Response
    {
        $user = $this->security->getUser();
        $vehicle = $vehicleRepository->find($id);

        if ($vehicle === null) {
            return new Response('Vehicle not found', 404);
        }
        if ($vehicle->getUser() !== $user) {
            return new Response('Invalid credentials', 403);
        }

        $parameters = json_decode($request->getContent(), true);
        if (!is_array($parameters)) {
            return new Response('Invalid JSON', 400);
        }

        if ($parameters['vehicleType'] !== "") {
            $vehicle->setVehicleType($parameters['vehicleType']);
        }
        if ($parameters['registrationNumber'] !== "") {
            $vehicle->setRegistrationNumber($parameters['registrationNumber']);
        }
        if ($parameters['brand'] !== "") {
            $vehicle->setBrand($parameters['brand']);
        }
        if ($parameters['model'] !== "") {
            $vehicle->setModel($parameters['model']);
        }
        if ($parameters['version'] !== "") {
            $vehicle->setVersion($parameters['version']);
        }
        if ($parameters['firstRegistrationDateAt'] !== "") {
            try {
                $vehicle->setFirstRegistrationDateAt(new DateTimeImmutable($parameters['firstRegistrationDateAt']));
            } catch (\Exception) {
                return new Response('Invalid firstRegistrationDateAt', 400);
            }
        }
        if ($parameters['typeOfFuel'] !== "") {
            $vehicle->setTypeOfFuel($parameters['typeOfFuel']);
        }
        if ($parameters['typeOfTransmission'] !== "") {
            $vehicle->setTypeOfTransmission($parameters['typeOfTransmission']);
        }
        if ($parameters['mileage'] !== 0) {
            $vehicle->setMileage($parameters['mileage']);
        }
        if ($parameters['kmPerDay'] !== 0) {
            $vehicle->setKmPerDay($parameters['kmPerDay']);
        }
        $em->persist($vehicle);
        $em->flush();

        return $this->json(['vehicle' => $vehicle], 200, [], ['groups' => ['vehicle:read']]);
    }

    #[Route('/api/vehicle/delete/{id}', name: 'api_vehicle_delete', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function delete(int $id, VehicleRepository $vehicleRepository, EntityManagerInterface $em): Response
    {
        $user = $this->security->getUser();
        $vehicle = $vehicleRepository->find($id);

        if ($vehicle === null) {
            return new Response('Vehicle not found', 404);
        }
        if ($vehicle->getUser() !== $user) {
            return new Response('Invalid credentials', 403);
        }

        $em->remove($vehicle);
        $em->flush();

        return new Response(null, 204);
    }
}
