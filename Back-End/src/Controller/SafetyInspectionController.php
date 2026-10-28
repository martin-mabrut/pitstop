<?php

namespace App\Controller;

use App\Entity\SafetyInspection;
use App\Repository\SafetyInspectionRepository;
use App\Repository\VehicleRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class SafetyInspectionController extends AbstractController
{
    public function __construct(private Security $security)
    {
    }

    #[Route('/api/safetyInspection/all/{id}', name: 'api_safety_inspection_all', methods: ['GET'])]
    public function findAll(
        int $id,
        SafetyInspectionRepository $safetyInspectionRepository,
        VehicleRepository $vehicleRepository
    ): Response {
        $user = $this->security->getUser();
        $vehicle = $vehicleRepository->find($id);

        if ($vehicle === null) {
            return new Response('Vehicle not found', 404);
        }

        if ($vehicle->getUser() !== $user) {
            return new Response('Invalid credentials', 403);
        }

        $safetyInspections = $safetyInspectionRepository->findAllFromAVehicle($id);

        return $this->json(
            ['safetyInspections' => $safetyInspections],
            200,
            [],
            ['groups' => ['safety:read']]
        );
    }

    #[Route('/api/safetyInspection/one/{vId}/{id}', name: 'api_safety_inspection', methods: ['GET'])]
    public function findWithId(
        int $id,
        int $vId,
        SafetyInspectionRepository $safetyInspectionRepository,
        VehicleRepository $vehicleRepository
    ): Response {
        $user = $this->security->getUser();
        $vehicle = $vehicleRepository->find($vId);

        if ($vehicle === null) {
            return new Response('Vehicle not found', 404);
        }

        if ($vehicle->getUser() !== $user) {
            return new Response('Invalid credentials', 403);
        }

        $safetyInspection = $safetyInspectionRepository->find($id);

        if ($safetyInspection === null || $safetyInspection->getVehicle() !== $vehicle) {
            return new Response('Safety inspection not found', 404);
        }

        return $this->json(
            ['safetyInspections' => $safetyInspection],
            200,
            [],
            ['groups' => ['safety:read']]
        );
    }

    #[Route('/api/safetyInspection/addDone/{id}', name: 'api_safety_inspection_add', methods: ['POST'])]
    public function addDone(
        int $id,
        Request $request,
        EntityManagerInterface $em,
        VehicleRepository $vehicleRepository,
        ValidatorInterface $validator
    ): Response {
        $user = $this->security->getUser();
        $parameters = json_decode($request->getContent(), true);

        $vehicle = $vehicleRepository->find($id);

        if ($vehicle === null) {
            return new Response('Vehicle not found', 404);
        }

        if ($vehicle->getUser() !== $user) {
            return new Response('Invalid credentials', 403);
        }

        if (
            !is_array($parameters)
            || empty($parameters['doneAt'])
            || !array_key_exists('valid', $parameters)
            || !is_bool($parameters['valid'])
        ) {
            return $this->json([
                'message' => 'doneAt and a boolean valid are required',
            ], 400);
        }

        try {
            $doneAt = new DateTime($parameters['doneAt']);
        } catch (\Exception $e) {
            return $this->json(['message' => 'Invalid visit date'], 400);
        }

        $safetyInspection = new SafetyInspection();
        $safetyInspection->setDueTimeAt(clone $doneAt);
        $safetyInspection->setDoneAt(clone $doneAt);
        $safetyInspection->setType('regular');
        $safetyInspection->setVehicle($vehicle);

        $safetyInspectionNext = new SafetyInspection();
        $safetyInspectionNext->setVehicle($vehicle);

        $dueTimeNext = clone $doneAt;

        if ($parameters['valid']) {
            $dueTimeNext->modify('+2 years');
            $safetyInspectionNext->setType('regular');
        } else {
            $dueTimeNext->modify('+2 months');
            $safetyInspectionNext->setType('followUp');
        }

        $safetyInspectionNext->setDueTimeAt($dueTimeNext);

        $errors = $validator->validate($safetyInspection);
        $errorsNext = $validator->validate($safetyInspectionNext);

        if (count($errors) > 0 || count($errorsNext) > 0) {
            return $this->json([
                'message' => 'Validation failed',
                'errors' => [
                    'inspection' => (string) $errors,
                    'nextInspection' => (string) $errorsNext,
                ],
            ], 400);
        }

        $em->persist($safetyInspection);
        $em->persist($safetyInspectionNext);
        $em->flush();

        return new Response(null, 201);
    }

    #[Route('/api/safetyInspection/addFirst/{id}', name: 'api_safety_inspection_add_first', methods: ['POST'])]
    public function addFirst(
        int $id,
        EntityManagerInterface $em,
        VehicleRepository $vehicleRepository,
        ValidatorInterface $validator
    ): Response {
        $user = $this->security->getUser();
        $vehicle = $vehicleRepository->find($id);

        if ($vehicle === null) {
            return new Response('Vehicle not found', 404);
        }

        if ($vehicle->getUser() !== $user) {
            return new Response('Invalid credentials', 403);
        }

        $today4yearsAgo = new DateTime();
        $today4yearsAgo->modify('-4 years');

        $safetyInspection = new SafetyInspection();
        $safetyInspection->setType('regular');

        if ($vehicle->getFirstRegistrationDateAt() <= $today4yearsAgo) {
            $dueTimeAt = new DateTime();
            $dueTimeAt->modify('+1 week');
        } else {
            $dueTimeAt = new DateTime(
                $vehicle->getFirstRegistrationDateAt()->format(DateTime::ATOM)
            );
            $dueTimeAt->modify('+4 years');
        }

        $safetyInspection->setDueTimeAt($dueTimeAt);
        $safetyInspection->setVehicle($vehicle);

        $errors = $validator->validate($safetyInspection);

        if (count($errors) > 0) {
            return $this->json([
                'message' => 'Validation failed',
                'errors' => (string) $errors,
            ], 400);
        }

        $em->persist($safetyInspection);
        $em->flush();

        return new Response(null, 201);
    }

    #[Route('/api/safetyInspection/update/{vId}/{id}', name: 'api_safety_inspection_update', methods: ['PATCH'])]
    public function update(
        int $id,
        int $vId,
        SafetyInspectionRepository $safetyInspectionRepository,
        VehicleRepository $vehicleRepository,
        Request $request,
        EntityManagerInterface $em,
        ValidatorInterface $validator
    ): Response {
        $user = $this->security->getUser();
        $vehicle = $vehicleRepository->find($vId);

        if ($vehicle === null) {
            return $this->json(['message' => 'Vehicle not found'], 404);
        }

        if ($vehicle->getUser() !== $user) {
            return $this->json(['message' => 'Invalid credentials'], 403);
        }

        $inspection = $safetyInspectionRepository->find($id);

        if ($inspection === null || $inspection->getVehicle() !== $vehicle) {
            return $this->json(['message' => 'Safety inspection not found'], 404);
        }

        $lastTwo = $safetyInspectionRepository->findLastTwo(2, $vId);

        if (!in_array($inspection, $lastTwo, true)) {
            return $this->json([
                'message' => 'You cannot modify this safety inspection',
            ], 403);
        }

        $data = json_decode($request->getContent(), true);

        if (!is_array($data)) {
            return $this->json(['message' => 'Invalid JSON'], 400);
        }

        try {
            if (array_key_exists('dueTimeAt', $data)) {
                if (!$data['dueTimeAt']) {
                    return $this->json(['message' => 'dueTimeAt is required'], 400);
                }

                $inspection->setDueTimeAt(new DateTime($data['dueTimeAt']));
            }

            if (array_key_exists('doneAt', $data)) {
                $inspection->setDoneAt(
                    $data['doneAt'] !== null && $data['doneAt'] !== ''
                        ? new DateTime($data['doneAt'])
                        : null
                );
            }

            if (isset($data['type'])) {
                $inspection->setType($data['type']);
            }
        } catch (\Exception $e) {
            return $this->json(['message' => 'Invalid date or type'], 400);
        }

        $errors = $validator->validate($inspection);

        if (count($errors) > 0) {
            return $this->json([
                'message' => 'Validation failed',
                'errors' => (string) $errors,
            ], 400);
        }

        $em->flush();

        return $this->json([
            'message' => 'Safety inspection updated',
            'safetyInspection' => $inspection,
        ], 200, [], ['groups' => ['safety:read']]);
    }

    #[Route('/api/safetyInspection/validate/{vId}/{id}', name: 'api_safety_inspection_validate', methods: ['PATCH'])]
    public function validate(
        int $id,
        int $vId,
        SafetyInspectionRepository $safetyInspectionRepository,
        VehicleRepository $vehicleRepository,
        Request $request,
        EntityManagerInterface $em,
        ValidatorInterface $validator
    ): Response {
        $user = $this->security->getUser();
        $vehicle = $vehicleRepository->find($vId);

        if ($vehicle === null) {
            return $this->json(['message' => 'Vehicle not found'], 404);
        }

        if ($vehicle->getUser() !== $user) {
            return $this->json(['message' => 'Invalid credentials'], 403);
        }

        $inspection = $safetyInspectionRepository->find($id);

        if ($inspection === null || $inspection->getVehicle() !== $vehicle) {
            return $this->json(['message' => 'Safety inspection not found'], 404);
        }

        // Seul le premier contrôle non réalisé peut être validé.
        $lastNotDone = $safetyInspectionRepository->findLastNotDone($vId);

        if (
            empty($lastNotDone)
            || $inspection !== $lastNotDone[0]
            || $inspection->getDoneAt() !== null
        ) {
            return $this->json([
                'message' => 'You cannot validate this safety inspection',
            ], 403);
        }

        $data = json_decode($request->getContent(), true);

        if (
            !is_array($data)
            || empty($data['doneAt'])
            || !array_key_exists('valid', $data)
            || !is_bool($data['valid'])
        ) {
            return $this->json([
                'message' => 'doneAt and a boolean valid are required',
            ], 400);
        }

        try {
            $doneAt = new DateTime($data['doneAt']);
        } catch (\Exception $e) {
            return $this->json(['message' => 'Invalid visit date'], 400);
        }

        // Vérifier le type du contrôle existant avant toute modification.
        if (!in_array(
            $inspection->getType(),
            SafetyInspection::TYPE_SAFETYINSPECTION,
            true
        )) {
            return $this->json([
                'message' => 'The existing inspection has an invalid type',
                'inspectionId' => $inspection->getId(),
                'type' => $inspection->getType(),
                'allowedTypes' => SafetyInspection::TYPE_SAFETYINSPECTION,
            ], 400);
        }

        // Préparer le prochain contrôle.
        $nextInspection = new SafetyInspection();
        $nextInspection->setVehicle($vehicle);

        if ($data['valid'] === true) {
            $dueTimeAt = clone $doneAt;
            $dueTimeAt->modify('+2 years');
            $nextInspection->setType('regular');
        } else {
            $dueTimeAt = clone $doneAt;
            $dueTimeAt->modify('+2 months');
            $nextInspection->setType('followUp');
        }

        $nextInspection->setDueTimeAt($dueTimeAt);
        $inspection->setDoneAt($doneAt);

        $errors = $validator->validate($inspection);
        $nextErrors = $validator->validate($nextInspection);

        if (count($errors) > 0 || count($nextErrors) > 0) {
            return $this->json([
                'message' => 'Validation failed',
                'errors' => [
                    'inspection' => (string) $errors,
                    'nextInspection' => (string) $nextErrors,
                ],
            ], 400);
        }

        $em->persist($nextInspection);
        $em->flush();

        return $this->json([
            'message' => 'Safety inspection validated',
            'safetyInspection' => $inspection,
            'nextInspection' => $nextInspection,
        ], 200, [], ['groups' => ['safety:read']]);
    }

    #[Route('/api/safetyInspection/allNotDoneFromEveryVehicle', name: 'api_safety_inspection_all_vehicle', methods: ['GET'])]
    public function findAllNotDoneFromAllVehicle(
        SafetyInspectionRepository $safetyInspectionRepository,
        VehicleRepository $vehicleRepository
    ): Response {
        $user = $this->security->getUser();
        $safetyInspections = $safetyInspectionRepository->findAllNotDoneFromAllVehicle($user);

        return $this->json(
            ['safetyInspections' => $safetyInspections],
            200,
            [],
            ['groups' => ['safety:read']]
        );
    }
}