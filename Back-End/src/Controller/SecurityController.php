<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\BrowserKit\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;


final class SecurityController extends AbstractController
{
    #[Route('/api/loginOKSOUR', name: 'api_login', methods:['POST'])]
    public function login()
    {
    }
}
