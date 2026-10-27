<?php

namespace App\Controller;

use App\Repository\GarageRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class GarageController extends AbstractController
{
    #[Route('/api/garage', name: 'api_garage')]
    public function index(GarageRepository $garageRepository): Response
    {
        $listGarage = $garageRepository->findAll();
        return $this->json(['garage' => $listGarage], 200, [], ['groups' => ['test']]);
    }
}
