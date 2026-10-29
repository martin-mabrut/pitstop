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
use Symfony\Component\Validator\Constraints\Date;
use Symfony\Component\Validator\Validator\ValidatorInterface;


final class SafetyInspectionController extends AbstractController
{
    public function __construct(private Security $security) {}
    #[Route('/api/safetyInspection/all/{id}', name: 'api_safety_inspection_all', methods: ['GET'])]
    public function findAll(int $id, SafetyInspectionRepository $safetyInspectionRepository, VehicleRepository $vehicleRepository): Response
    {
        $user = $this->security->getUser();
        $vehicle = $vehicleRepository->find($id);
        if ($vehicle === null) {
            return new Response("Vehicle not found", 404);
        }
        if ($vehicle->getUser() != $user) {
            return new Response("Invalid credentials", 403);
        }
        $safetyInspections = $safetyInspectionRepository->findAllFromAVehicle($id);
        return $this->json(['safetyInspections' => $safetyInspections], 200, [], ['groups' => ['safety:read']]);
    }

    #[Route('/api/safetyInspection/one/{vId}/{id}', name: 'api_safety_inspection', methods: ['GET'])]
    public function findWithId(int $id, int $vId, SafetyInspectionRepository $safetyInspectionRepository, VehicleRepository $vehicleRepository): Response
    {
        $user = $this->security->getUser();
        $vehicle = $vehicleRepository->find($vId);
        if ($vehicle === null) {
            return new Response("Vehicle not found", 404);
        }
        if ($vehicle->getUser() != $user) {
            return new Response("Invalid credentials", 403);
        }
        $safetyInspection = $safetyInspectionRepository->find($id);
        if ($safetyInspection->getVehicle() !== $vehicle) {
            return new Response("Invalid credentials", 403);
        }
        return $this->json(['safetyInspections' => $safetyInspection], 200, [], ['groups' => ['safety:read']]);
    }

    #[Route('/api/safetyInspection/addDone/{id}', name: 'api_safety_inspection_add', methods: ['POST'])]
    public function addDone(int $id, Request $request, EntityManagerInterface $em, VehicleRepository $vehicleRepository, ValidatorInterface $validator): Response
    {
        $user = $this->security->getUser();
        $parameters = json_decode($request->getContent(), true);
        $vehicle = $vehicleRepository->find($id);
        if ($vehicle === null) {
            return new Response("Vehicle not found", 404);
        }
        if ($vehicle->getUser() != $user) {
            return new Response("Invalid credentials", 403);
        }
        $dueTimeAt = new DateTime($parameters['doneAt']);
        $doneAt = new DateTime($parameters['doneAt']);
        $type = 'regular';
        $safetyInspection = new SafetyInspection();
        $safetyInspection->setDueTimeAt($dueTimeAt);
        $safetyInspection->setDoneAt($doneAt);
        $safetyInspection->setType($type);
        $safetyInspection->setVehicle($vehicle);
        $safetyInspectionNext = new SafetyInspection();
        if ($parameters['valid']) {
            $dueTimeNext = new DateTime($parameters['doneAt']);
            $dueTimeNext->modify('+2 year');
            $typeNext = "regular";
        } else {
            $dueTimeNext = new DateTime($parameters['doneAt']);
            $dueTimeNext->modify('+2 month');
            $typeNext = "followUp";
        }
        $safetyInspectionNext->setDueTimeAt($dueTimeNext);
        $safetyInspectionNext->setType($typeNext);
        $safetyInspectionNext->setVehicle($vehicle);
        $em->persist($safetyInspection);
        $em->persist($safetyInspectionNext);
        $errors = $validator->validate($safetyInspection);
        if (count($errors) > 0) {
            return new Response((string) $errors, 400);
        }
        $errorsNext = $validator->validate($safetyInspectionNext);
        if (count($errorsNext) > 0) {
            return new Response((string) $errorsNext, 400);
        }
        $em->flush();
        return new Response();
    }

    #[Route('/api/safetyInspection/addFirst/{id}', name: 'api_safety_inspection_add_first', methods: ['POST'])]
    public function addFirst(int $id, EntityManagerInterface $em, VehicleRepository $vehicleRepository, ValidatorInterface $validator): Response
    {
        $user = $this->security->getUser();
        $vehicle = $vehicleRepository->find($id);
        if ($vehicle === null) {
            return new Response("Vehicle not found", 404);
        }
        if ($vehicle->getUser() != $user) {
            return new Response("Invalid credentials", 403);
        }
        $today4yearsAgo = new DateTime("");
        $today4yearsAgo->modify("- 4 year");
        $safetyInspection = new SafetyInspection();
        $type = "regular";
        if ($vehicle->getFirstRegistrationDateAt() <= $today4yearsAgo) {
            $dueTimeAt = new DateTime("");
            $dueTimeAt->modify("+ 1 week");
        } else {
            $dueTimeAt = new DateTime($vehicle->getFirstRegistrationDateAt()->format(DateTime::ATOM));
            $dueTimeAt->modify("+ 4 year");
        }
        $safetyInspection->setDueTimeAt($dueTimeAt);
        $safetyInspection->setType($type);
        $safetyInspection->setVehicle($vehicle);
        $errors = $validator->validate($safetyInspection);
        if (count($errors) > 0) {
            return new Response((string) $errors, 400);
        }
        $em->persist($safetyInspection);
        $em->flush();
        return new Response();
    }

    #[Route('/api/safetyInspection/update/{vId}/{id}', name: 'api_safety_inspection_update', methods: ['PATCH'])]
    public function update(int $id, int $vId, SafetyInspectionRepository $safetyInspectionRepository, VehicleRepository $vehicleRepository, Request $request, EntityManagerInterface $em, ValidatorInterface $validator): Response
    {
        $user = $this->security->getUser();
        $vehicle = $vehicleRepository->find($vId);
        $parameters = json_decode($request->getContent(), true);
        if ($vehicle === null) {
            return new Response("Vehicle not found", 404);
        }
        if ($vehicle->getUser() != $user) {
            return new Response("Invalid credentials", 403);
        }
        $safetyInspection = $safetyInspectionRepository->find($id);
        if ($safetyInspection->getVehicle() !== $vehicle) {
            return new Response("Invalid credentials", 403);
        }
        $safetyInspectionLastTwo = $safetyInspectionRepository->findLastTwo(2, $vId);
        if (!in_array($safetyInspection, $safetyInspectionLastTwo)) {
            return new Response("You cannot modify this Safety Inspection", 403);
        }
        if ($safetyInspection->getDoneAt() === null) {
            $dueTimeAt = new DateTime($parameters['dueTimeAt']);
            $type = $parameters['type'];
            $safetyInspection->setDueTimeAt($dueTimeAt);
            $safetyInspection->setType($type);
        } else {
            $doneAt = new DateTime($parameters['doneAt']);
            $type = $parameters['type'];
            $safetyInspection->setDoneAt($doneAt);
            $safetyInspection->setType($type);
            $safetyInspectionNext = $safetyInspectionLastTwo[0];

            if ($parameters['valid']) {
                $dueTimeNext = new DateTime($parameters['doneAt']);
                $dueTimeNext->modify('+2 year');
                $typeNext = "regular";
            } else {
                $dueTimeNext = new DateTime($parameters['doneAt']);
                $dueTimeNext->modify('+2 month');
                $typeNext = "followUp";
            }
            $safetyInspectionNext->setDueTimeAt($dueTimeNext);
            $safetyInspectionNext->setType($typeNext);
            $em->persist($safetyInspectionNext);
            $errorsNext = $validator->validate($safetyInspectionNext);
            if (count($errorsNext) > 0) {
                return new Response((string) $errorsNext, 400);
            }
        }
        $errors = $validator->validate($safetyInspection);
        if (count($errors) > 0) {
            return new Response((string) $errors, 400);
        }
        $em->persist($safetyInspection);
        $em->flush();
        return $this->json(['safetyInspection' => $safetyInspection], 200, [], ['groups' => ['safety:read']]);
    }

    #[Route('/api/safetyInspection/validate/{vId}/{id}', name: 'api_safety_inspection_validate', methods: ['PATCH'])]
    public function validate(int $id, int $vId, SafetyInspectionRepository $safetyInspectionRepository, VehicleRepository $vehicleRepository, Request $request, EntityManagerInterface $em, ValidatorInterface $validator): Response
    {
        $user = $this->security->getUser();
        $vehicle = $vehicleRepository->find($vId);
        $parameters = json_decode($request->getContent(), true);
        if ($vehicle === null) {
            return new Response("Vehicle not found", 404);
        }
        if ($vehicle->getUser() != $user) {
            return new Response("Invalid credentials", 403);
        }
        $safetyInspection = $safetyInspectionRepository->find($id);
        if ($safetyInspection->getVehicle() !== $vehicle) {
            return new Response("Invalid credentials", 403);
        }
        $safetyInspectionLast = $safetyInspectionRepository->findLastNotDone($vId);
        if ($safetyInspection !== $safetyInspectionLast[0]) {
            return new Response("You cannot validate this Safety Inspection", 403);
        }
        $doneAt = new DateTime($parameters['doneAt']);
        $safetyInspection->setDoneAt($doneAt);
        $safetyInspection->setDueTimeAt($doneAt);
        $safetyInspectionNext = new SafetyInspection();
        $safetyInspectionNext->setVehicle($vehicle);
        if ($parameters['valid']) {
            $dueTimeNext = new DateTime($parameters['doneAt']);
            $dueTimeNext->modify('+2 year');
            $typeNext = "regular";
        } else {
            $dueTimeNext = new DateTime($parameters['doneAt']);
            $dueTimeNext->modify('+2 month');
            $typeNext = "followUp";
        }
        $safetyInspectionNext->setDueTimeAt($dueTimeNext);
        $safetyInspectionNext->setType($typeNext);
        $errors = $validator->validate($safetyInspection);
        if (count($errors) > 0) {
            return new Response((string) $errors, 400);
        }
        $errorsNext = $validator->validate($safetyInspectionNext);
        if (count($errorsNext) > 0) {
            return new Response((string) $errorsNext, 400);
        }
        $em->persist($safetyInspectionNext);
        $em->persist($safetyInspection);
        $em->flush();

        return $this->json(['safetyInspection' => $safetyInspection, 'safetyInspectionNext' => $safetyInspectionNext], 200, [], ['groups' => ['safety:read']]);
    }

    #[Route('/api/safetyInspection/allNotDoneFromEveryVehicle', name: 'api_safety_inspection_all_vehicle', methods: ['GET'])]
    public function findAllNotDoneFromAllVehicle(SafetyInspectionRepository $safetyInspectionRepository, VehicleRepository $vehicleRepository): Response
    {
        $user = $this->security->getUser();
        $safetyInspections = $safetyInspectionRepository->findAllNotDoneFromAllVehicle($user);
        return $this->json(['safetyInspections' => $safetyInspections], 200, [], ['groups' => ['safety:read']]);
    }
}
