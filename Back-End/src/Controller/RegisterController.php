<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Doctrine\IdGenerator\UuidGenerator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Validator\ValidatorInterface;


final class RegisterController extends AbstractController
{
    #[Route('/api/register', name: 'api_register', methods:['POST'])]
    public function register(UserRepository $userRepository, Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $userPasswordHasher, ValidatorInterface $validator) : Response
    {
        $parameters = json_decode($request->getContent(),true);
        $userExist = $userRepository->findBy(["username"=>$parameters['username']]);
        if(count($userExist)>0){
            return new Response("This username is taken", 409);
        }
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
        $errors = $validator->validate($user);
        if(count($errors)>0){
            return new Response((string) $errors, 400);
        }
        $em->persist($user);
        $em->flush();
        return new Response();
    }
}
