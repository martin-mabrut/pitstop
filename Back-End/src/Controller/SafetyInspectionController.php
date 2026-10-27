<?php

namespace App\Controller;

use App\Repository\SafetyInspectionRepository;
use App\Repository\VehicleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class SafetyInspectionController extends AbstractController
{
    public function __construct(private Security $security)
    {
    }
    #[Route('/api/safetyInspection/{id}', name: 'api_safety_inspection')]
    public function findAll($id, SafetyInspectionRepository $safetyInspectionRepository, Request $request, VehicleRepository $vehicleRepository): Response
    {
        $user = $this->security->getUser(); 
        $vehicle = $vehicleRepository->find($id);
        if($vehicle === null){
            return new Response("Vehicle not found", 404);
        }
        if($vehicle->getUser() != $user){
            return new Response("Invalid credentials", 403);
        }
        $safetyInspections = $safetyInspectionRepository->findAllFromAVehicle($id);
        return $this->json(['safetyInspections'=>$safetyInspections],200,[],['groups'=>['safety:read']]);
    }
}
