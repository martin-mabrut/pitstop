<?php

namespace App\Entity;

use App\Repository\RepairsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RepairsRepository::class)]
class Repairs
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private ?string $typeOfRepairs = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $repairedAt = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(nullable: true)]
    private ?float $price = null;

    #[ORM\ManyToOne(inversedBy: 'repairs')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Vehicle $vehicle = null;

    #[ORM\ManyToOne(inversedBy: 'repairs')]
    private ?Garage $garage = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTypeOfRepairs(): ?string
    {
        return $this->typeOfRepairs;
    }

    public function setTypeOfRepairs(string $typeOfRepairs): static
    {
        $this->typeOfRepairs = $typeOfRepairs;

        return $this;
    }

    public function getRepairedAt(): ?\DateTimeImmutable
    {
        return $this->repairedAt;
    }

    public function setRepairedAt(?\DateTimeImmutable $repairedAt): static
    {
        $this->repairedAt = $repairedAt;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(?float $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getVehicle(): ?Vehicle
    {
        return $this->vehicle;
    }

    public function setVehicle(?Vehicle $vehicle): static
    {
        $this->vehicle = $vehicle;

        return $this;
    }

    public function getGarage(): ?Garage
    {
        return $this->garage;
    }

    public function setGarage(?Garage $garage): static
    {
        $this->garage = $garage;

        return $this;
    }
}
