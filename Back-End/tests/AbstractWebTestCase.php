<?php

namespace App\Tests;

use App\Repository\UserRepository;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

abstract class AbstractWebTestCase extends WebTestCase
{

    const string URL_SAFETY_INSPECTION_ALL = '/api/safetyInspection/all/';
    const string URL_SAFETY_INSPECTION_FIRST = '/api/safetyInspection/addFirst/';

    protected function loginUser(
        KernelBrowser $client,
        string        $username
    ): void
    {
        $userRepo = $this->getRepository(UserRepository::class);
        $client->loginUser($userRepo->findOneBy(['username' => $username]));
    }

    protected function getRepository(string $repoClass): ServiceEntityRepository {
        return $this->getContainer()->get($repoClass);
    }

    protected function removeEntity(?object $object):void{
        if($object !== null){
            $em = $this->getContainer()->get('doctrine.orm.entity_manager');
            $em->remove($object);
            $em->flush();
        }
    }
}
