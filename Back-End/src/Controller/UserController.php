<?php

namespace App\Controller;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;


final class UserController extends AbstractController
{

    public function __construct(private Security $security)
    {
    }
    #[Route('/api/user', name: 'api_user', methods:['GET'])]
    public function __invoke()
    {  
       $user = $this->security->getUser();
       return $this->json([
        'username'=>$user->getUsername(),
        'uuid'=>$user->getUuid(),
        'email'=>$user->getEmail()
       ]); 
    }

    #[Route('/api/user/username', name: 'api_user_username', methods:['PATCH'])]
    public function update_username(UserRepository $userRepository, Request $request, EntityManagerInterface $em, ValidatorInterface $validator):Response
    {
        $user = $this->security->getUser();
        $parameters = json_decode($request->getContent(), true);
        $userExist = $userRepository->findBy(["username"=>$parameters['username']]);
        if(count($userExist)>0){
            return new Response("This username is taken", 409);
        }
        $username = $parameters['username'];
        $user->setUsername($username);
        $errors = $validator->validate($user);
        if(count($errors)>0){
            return new Response((string) $errors, 400);
        }
        $em->persist($user);
        $em->flush();
        return new Response();
    }

    #[Route('/api/user/password', name: 'api_user_password', methods:['PATCH'])]
    public function update_password(Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $userPasswordHasher,ValidatorInterface $validator):Response
    {
        $user = $this->security->getUser();
        $parameters = json_decode($request->getContent(), true);
        $oldPassword = $parameters['oldPassword'];
        $newPassword = $parameters['newPassword'];
        if(!$userPasswordHasher->isPasswordValid($user, $oldPassword)){
            return new Response('Invalid old password', 403);
        }
        $user->setPassword($userPasswordHasher->hashPassword($user, $newPassword));
        $errors = $validator->validate($user);
        if(count($errors)>0){
            return new Response((string) $errors, 400);
        }
        $em->persist($user);
        $em->flush();
        return new Response();
    }

    #[Route('/api/user/email', name: 'api_user_email', methods:['PATCH'])]
    public function update_email(Request $request, EntityManagerInterface $em, ValidatorInterface $validator):Response
    {
        $user = $this->security->getUser();
        $parameters = json_decode($request->getContent(), true);
        $email = $parameters['email'];
        $user->setEmail($email);
        $errors = $validator->validate($user);
        if(count($errors)>0){
            return new Response((string) $errors, 400);
        }
        $em->persist($user);
        $em->flush();
        return new Response();
    }
}
