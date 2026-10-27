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

final class UserController extends AbstractController
{

    public function __construct(private Security $security)
    {
    }
    #[Route('/api/user', name: 'api_user', methods:['GET'])]
    public function __invoke()
    {  
       $user = $this->security->getUser();
       dd($user);
       return $this->json([
        'username'=>$user->getUsername(),
        'uuid'=>$user->getUuid()
       ]); 
    }

    #[Route('/api/user/username', name: 'api_user_username', methods:['PATCH'])]
    public function update_username(UserRepository $userRepository, Request $request, EntityManagerInterface $em):Response
    {
        $user = $this->security->getUser();
        $parameters = json_decode($request->getContent(), true);
        $userExist = $userRepository->findBy(["username"=>$parameters['username']]);
        if($userExist!==null){
            return new Response("This username is taken", 409);
        }
        $username = $parameters['username'];
        $user->setUsername($username);
        $em->persist($user);
        $em->flush();
        return new Response();
    }

    #[Route('/api/user/password', name: 'api_user_password', methods:['PATCH'])]
    public function update_password(Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $userPasswordHasher):Response
    {
        $user = $this->security->getUser();
        $parameters = json_decode($request->getContent(), true);
        $oldPassword = $parameters['oldPassword'];
        $newPassword = $parameters['newPassword'];
        if(!$userPasswordHasher->isPasswordValid($user, $oldPassword)){
            return new Response('Invalid old password', 403);
        }
        $user->setPassword($userPasswordHasher->hashPassword($user, $newPassword));
        $em->persist($user);
        $em->flush();
        return new Response();
    }

    #[Route('/api/user/email', name: 'api_user_email', methods:['PATCH'])]
    public function update_email(Request $request, EntityManagerInterface $em):Response
    {
        $user = $this->security->getUser();
        $parameters = json_decode($request->getContent(), true);
        $email = $parameters['email'];
        $user->setEmail($email);
        $em->persist($user);
        $em->flush();
        return new Response();
    }
}
