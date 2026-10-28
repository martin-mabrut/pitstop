<?php

namespace App\Entity;

use App\Repository\SafetyInspectionRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;


#[ORM\Entity(repositoryClass: SafetyInspectionRepository::class)]
class SafetyInspection
{
    public const TYPE_SAFETYINSPECTION = ['regular', 'followUp'];
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['safety:read'])]
    private ?int $id = null;

    #[ORM\Column]
    // #[Assert\DateTime]
    #[Assert\NotBlank(message: 'dueTimeAt must not be null')]
    #[Groups(['safety:read'])]
    private ?\DateTime $dueTimeAt = null;

    #[ORM\Column(nullable: true)]
    // #[Assert\DateTime]
    #[Groups(['safety:read'])]
    private ?\DateTime $doneAt = null;

    #[ORM\Column(length: 50)]
    #[Assert\Choice(choices: SafetyInspection::TYPE_SAFETYINSPECTION, message: 'Choose a valid type.')]
    #[Assert\Type(
        type: 'string',
        message: 'The value {{ value }} is not a valid {{ type }}.',
    )]
    #[Groups(['safety:read'])]
    private ?string $type = null;

    #[ORM\ManyToOne(inversedBy: 'safetyInspections')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['safety:read'])]
    private ?Vehicle $vehicle = null;

    #[ORM\ManyToOne(inversedBy: 'safetyInspections')]
    private ?Garage $garage = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDueTimeAt(): ?\DateTime
    {
        return $this->dueTimeAt;
    }

    public function setDueTimeAt(\DateTime $dueTimeAt): static
    {
        $this->dueTimeAt = $dueTimeAt;

        return $this;
    }

    public function getDoneAt(): ?\DateTime
    {
        return $this->doneAt;
    }

    public function setDoneAt(?\DateTime $doneAt): static
    {
        $this->doneAt = $doneAt;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

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
