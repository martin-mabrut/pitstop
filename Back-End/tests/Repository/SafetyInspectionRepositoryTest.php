<?php

namespace App\Tests;

use App\Repository\SafetyInspectionRepository;
use App\Repository\UserRepository;
use App\Tests\AbstractKernelTestCase;
use PHPUnit\Framework\Attributes\TestWith;

class SafetyInspectionRepositoryTest extends AbstractKernelTestCase
{
    #[TestWith([23, true, 89])]
    #[TestWith([203, false, 0])]
    public function testFindLastNotDone(int $vId, bool $work, int $id): void
    {
        $repo = $this->getRepository(SafetyInspectionRepository::class);
        $safetyInspectionList = $repo->findLastNotDone($vId);
        if($work){
            $this->assertEquals($safetyInspectionList[0]->getId(), $id);
        }else{
            $this->assertEquals(count($safetyInspectionList), 0);
        }
    }

    #[TestWith([17, 2])]
    #[TestWith([18,  0])]
    public function testFindAllNotDoneFromAllVehicle(int $uId, int $number): void
    {
        $repo = $this->getRepository(SafetyInspectionRepository::class);
        $repoUser = $this->getRepository(UserRepository::class);
        $user = $repoUser->find($uId);
        $safetyInspectionList = $repo->findAllNotDoneFromAllVehicle($user);
        $this->assertEquals(count($safetyInspectionList), $number);
    }
    
    #[TestWith([23, 3])]
    #[TestWith([24,  0])]
    public function testFindAllFromAVehicle(int $vId, int $number): void
    {
        $repo = $this->getRepository(SafetyInspectionRepository::class);
        $safetyInspectionList = $repo->findAllFromAVehicle($vId);
        $this->assertEquals(count($safetyInspectionList), $number);
    }

    #[TestWith([23, 2, 2])]
    #[TestWith([23, 1, 1])]
    #[TestWith([23, 5, 3])]
    #[TestWith([40, 2, 0])]
    public function testFindLastTwo(int $vId,int $limit, int $number): void
    {
        $repo = $this->getRepository(SafetyInspectionRepository::class);
        $safetyInspectionList = $repo->findLastTwo($limit, $vId);
        $this->assertEquals(count($safetyInspectionList), $number);
    }
    
}
