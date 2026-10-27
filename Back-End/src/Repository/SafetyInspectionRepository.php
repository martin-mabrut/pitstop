<?php

namespace App\Repository;

use App\Entity\SafetyInspection;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<SafetyInspection>
 */
class SafetyInspectionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SafetyInspection::class);
    }
    
    public function findAllFromAVehicle(int $id): array
    {
        return $this->createQueryBuilder('s')
        ->join('s.vehicle', 'v')
        ->where('v.id = :id')
        ->setParameter('id', $id)
        ->orderBy('s.dueTimeAt', 'DESC')
        ->getQuery()
        ->getResult();
    }
//    /**
//     * @return SafetyInspection[] Returns an array of SafetyInspection objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('s')
//            ->andWhere('s.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('s.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?SafetyInspection
//    {
//        return $this->createQueryBuilder('s')
//            ->andWhere('s.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
