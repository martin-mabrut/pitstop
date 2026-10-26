<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class UserController extends AbstractController
{

    public function __construct(private Security $security)
    {
    }
    #[Route('/api/user', name: 'app_user', methods:['GET'])]
    public function __invoke()
    {  
       $user = $this->security->getUser();
       return $this->json([
        'username'=>$user->getUsername(),
        'uuid'=>$user->getUuid()
       ]); 
    }
}
