<?php

namespace App\Entity;

use App\Repository\RepairsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;


#[ORM\Entity(repositoryClass: RepairsRepository::class)]
class Repairs
{
    public const TYPE_REPAIRS = ['Carrosserie', 'Vitre', 'Autre'];
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['repairs:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    #[Assert\NotBlank(message: 'typeOfRepairs must not be null')]
    #[Assert\Choice(choices: Repairs::TYPE_REPAIRS, message: 'Choose a valid type.')]
    #[Assert\Type(
        type: 'string',
        message: 'The value {{ value }} is not a valid {{ type }}.',
    )]
    #[Groups(['repairs:read'])]
    private ?string $typeOfRepairs = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['repairs:read'])]
    private ?\DateTimeImmutable $repairedAt = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Assert\Length(
        min: 0,
        max: 200,
        minMessage: 'Your first name must be at least {{ limit }} characters long',
        maxMessage: 'Your first name cannot be longer than {{ limit }} characters',
    )]
    #[Assert\Type(
        type: 'string',
        message: 'The value {{ value }} is not a valid {{ type }}.',
    )]
    #[Groups(['repairs:read'])]
    private ?string $description = null;

    #[ORM\Column(nullable: true)]
    #[Assert\Type(
        type: 'float',
        message: 'The value {{ value }} is not a valid {{ type }}.',
    )]
    #[Groups(['repairs:read'])]
    private ?float $price = null;

    #[ORM\ManyToOne(inversedBy: 'repairs')]
    #[Assert\NotBlank(message: 'the repairs must be linked to a vehicle')]
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
