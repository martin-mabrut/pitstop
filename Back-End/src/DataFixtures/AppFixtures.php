<?php

namespace App\DataFixtures;

use App\Factory\UserFactory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // $product = new Product();
        // $manager->persist($product);

        UserFactory::createOne(['uuid'=>'128128128128128','email'=>'oskour@oskour.com','password'=>'$2y$13$dIG51RyMYB.kO2UAxsZgheAt301vw9Cqql2vVzz7b0mAxS2vgt70C',"username"=>'oskour']);
        $manager->flush();
    }
}
