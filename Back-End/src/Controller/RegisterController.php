<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Doctrine\IdGenerator\UuidGenerator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Uid\Uuid;

final class RegisterController extends AbstractController
{
    #[Route('/api/register', name: 'api_register', methods:['POST'])]
    public function register(Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $userPasswordHasher) : Response
    {
        $parameters = json_decode($request->getContent(),true);
        $username = $parameters['username'];
        $password = $parameters['password'];
        $email = $parameters['email'];
        $uuid = Uuid::v7();
        $roles = [];
        $user = new User();
        $user->setUsername($username);
        $user->setPassword($userPasswordHasher->hashPassword($user, $password));
        $user->setEmail($email);
        $user->setUuid($uuid);
        $user->setRoles($roles);

        $em->persist($user);
        $em->flush();
        return new Response();
    }
}
