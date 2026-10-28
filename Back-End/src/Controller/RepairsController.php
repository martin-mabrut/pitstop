<?php

namespace App\Controller;

use App\Entity\Repairs;
use App\Repository\RepairsRepository;
use App\Repository\VehicleRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class RepairsController extends AbstractController
{
    public function __construct(private Security $security)
    {
    }
    #[Route('/api/repairs/all/{id}', name: 'api_repairs_all', methods:['GET'])]
    public function findAll(int $id, RepairsRepository $repairsRepository, VehicleRepository $vehicleRepository): Response
    {
        $user = $this->security->getUser(); 
        $vehicle = $vehicleRepository->find($id);
        if($vehicle === null){
            return new Response("Vehicle not found", 404);
        }
        if($vehicle->getUser() != $user){
            return new Response("Invalid credentials", 403);
        }
        $repairsList = $repairsRepository->findAllFromAVehicle($id);
        return $this->json(['repairs'=>$repairsList],200,[],['groups'=>['repairs:read']]);
    }

    #[Route('/api/repairs/one/{vId}/{id}', name: 'api_repairs', methods:['GET'])]
    public function findWithId(int $id, int $vId, RepairsRepository $repairsRepository, VehicleRepository $vehicleRepository): Response
    {
        $user = $this->security->getUser();
        $vehicle = $vehicleRepository->find($vId);
        if($vehicle === null){
            return new Response("Vehicle not found", 404);
        }
        if($vehicle->getUser() != $user){
            return new Response("Invalid credentials", 403);
        }
        $repairs = $repairsRepository->find($id);
        if($repairs->getVehicle()!== $vehicle){
            return new Response("Invalid credentials", 403);
        }
        return $this->json(['repairs'=>$repairs],200,[],['groups'=>['repairs:read']]);
    }

    #[Route('/api/repairs/add/{vId}', name: 'api_repairs_add', methods:['POST'])]
    public function add(int $vId, Request $request, EntityManagerInterface $em, VehicleRepository $vehicleRepository, ValidatorInterface $validator):Response
    {
        $user = $this->security->getUser();
        $parameters = json_decode($request->getContent(),true);
        $vehicle = $vehicleRepository->find($vId);
        if($vehicle === null){
            return new Response("Vehicle not found", 404);
        }
        if($vehicle->getUser() != $user){
            return new Response("Invalid credentials", 403);
        }
        $typeOfRepairs = $parameters['typeOfRepairs'];
        $description = $parameters['description'];
        $price = $parameters['price'];
        $repairs = new Repairs();
        $repairs->setTypeOfRepairs($typeOfRepairs);
        if($description!=="") $repairs->setDescription($description);
        if($price!==0) $repairs->setPrice($price);
        if($parameters['repairedAt']!==""){
            $repairedAt = new DateTimeImmutable($parameters['repairedAt']);
            $repairs->setRepairedAt($repairedAt);
        }
        $repairs->setVehicle($vehicle);
        $errors = $validator->validate($repairs);
        if(count($errors)>0){
            return new Response((string) $errors, 400);
        }
        $em->persist($repairs);
        $em->flush();
        return new Response();
    }

    #[Route('/api/repairs/update/{vId}/{id}', name: 'api_repairs_update', methods:['PATCH'])]
    public function update(int $id, int $vId, RepairsRepository $repairsRepository, VehicleRepository $vehicleRepository, Request $request, EntityManagerInterface $em, ValidatorInterface $validator):Response{
        $user = $this->security->getUser();
        $parameters = json_decode($request->getContent(),true);
        $vehicle = $vehicleRepository->find($vId);
        if($vehicle === null){
            return new Response("Vehicle not found", 404);
        }
        if($vehicle->getUser() != $user){
            return new Response("Invalid credentials", 403);
        }
        $repairs = $repairsRepository->find($id);
        if($repairs->getVehicle()!== $vehicle){
            return new Response("Invalid credentials", 403);
        }
        $typeOfRepairs = $parameters['typeOfRepairs'];
        $description = $parameters['description'];
        $price = $parameters['price'];
        $repairs->setTypeOfRepairs($typeOfRepairs);
        if($description!=="") $repairs->setDescription($description);
        if($price!==0) $repairs->setPrice($price);
        if($parameters['repairedAt']!==""){
            $repairedAt = new DateTimeImmutable($parameters['repairedAt']);
            $repairs->setRepairedAt($repairedAt);
        }
        $errors = $validator->validate($repairs);
        if(count($errors)>0){
            return new Response((string) $errors, 400);
        }
        $em->persist($repairs);
        $em->flush();
        return new Response();
    }

    #[Route('/api/repairs/delete/{vId}/{id}', name: 'api_repairs_delete', methods:['DELETE'])]
    public function delete(int $id, int $vId, RepairsRepository $repairsRepository, VehicleRepository $vehicleRepository, EntityManagerInterface $em):Response
    {
        $user = $this->security->getUser();
        $vehicle = $vehicleRepository->find($vId);
        if($vehicle === null){
            return new Response("Vehicle not found", 404);
        }
        if($vehicle->getUser() != $user){
            return new Response("Invalid credentials", 403);
        }
        $repairs = $repairsRepository->find($id);
        if($repairs->getVehicle()!== $vehicle){
            return new Response("Invalid credentials", 403);
        }
        $em->remove($repairs);
        $em->flush();
        return new Response();
    }
}