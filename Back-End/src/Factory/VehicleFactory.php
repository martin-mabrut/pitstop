<?php

namespace App\Factory;

use App\Entity\Vehicle;
use App\Repository\VehicleRepository;
use Doctrine\ORM\EntityRepository;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;
use Zenstruck\Foundry\Persistence\Proxy;
use Zenstruck\Foundry\Persistence\ProxyRepositoryDecorator;

/**
 * @extends PersistentObjectFactory<Vehicle>
 */
final class VehicleFactory extends PersistentObjectFactory
{
    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#factories-as-services
     *
     * @todo inject services if required
     */
    public function __construct()
    {
    }

    #[\Override]
    public static function class(): string
    {
        return Vehicle::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    #[\Override]
    protected function defaults(): array|callable
    {
        return [
            'brand' => self::faker()->text(50),
            'firstRegistrationDateAt' => \DateTimeImmutable::createFromMutable(self::faker()->dateTime()),
            'model' => self::faker()->text(50),
            'registrationNumber' => self::faker()->text(20),
            'typeOfFuel' => self::faker()->text(30),
            'typeOfTransmission' => self::faker()->text(30),
            'user' => UserFactory::new(),
            'uuid' => self::faker()->text(180),
            'vehicleType' => self::faker()->text(50),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    #[\Override]
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(Vehicle $vehicle): void {})
        ;
    }
}
