<?php

namespace App\Repository;

use App\Entity\Repairs;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Repairs>
 */
class RepairsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Repairs::class);
    }

    public function findAllFromAVehicle(int $id): array
    {
        return $this->createQueryBuilder('r')
        ->join('r.vehicle', 'v')
        ->where('v.id = :id')
        ->setParameter('id', $id)
        ->orderBy('r.repairedAt', 'DESC')
        ->getQuery()
        ->getResult();
    }

//    /**
//     * @return Repairs[] Returns an array of Repairs objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('r')
//            ->andWhere('r.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('r.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Repairs
//    {
//        return $this->createQueryBuilder('r')
//            ->andWhere('r.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
