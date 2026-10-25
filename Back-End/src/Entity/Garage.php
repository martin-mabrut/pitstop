<?php

namespace App\Entity;

use App\Repository\GarageRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: GarageRepository::class)]
class Garage
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Groups(['test'])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Groups(['test'])]
    private ?string $address = null;

    #[ORM\Column(length: 50)]
    #[Groups(['test'])]
    private ?string $type = null;

    /**
     * @var Collection<int, Repairs>
     */
    #[ORM\OneToMany(targetEntity: Repairs::class, mappedBy: 'garage')]
    private Collection $repairs;

    /**
     * @var Collection<int, SafetyInspection>
     */
    #[ORM\OneToMany(targetEntity: SafetyInspection::class, mappedBy: 'garage')]
    private Collection $safetyInspections;

    public function __construct()
    {
        $this->repairs = new ArrayCollection();
        $this->safetyInspections = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(string $address): static
    {
        $this->address = $address;

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

    /**
     * @return Collection<int, Repairs>
     */
    public function getRepairs(): Collection
    {
        return $this->repairs;
    }

    public function addRepair(Repairs $repair): static
    {
        if (!$this->repairs->contains($repair)) {
            $this->repairs->add($repair);
            $repair->setGarage($this);
        }

        return $this;
    }

    public function removeRepair(Repairs $repair): static
    {
        if ($this->repairs->removeElement($repair)) {
            // set the owning side to null (unless already changed)
            if ($repair->getGarage() === $this) {
                $repair->setGarage(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, SafetyInspection>
     */
    public function getSafetyInspections(): Collection
    {
        return $this->safetyInspections;
    }

    public function addSafetyInspection(SafetyInspection $safetyInspection): static
    {
        if (!$this->safetyInspections->contains($safetyInspection)) {
            $this->safetyInspections->add($safetyInspection);
            $safetyInspection->setGarage($this);
        }

        return $this;
    }

    public function removeSafetyInspection(SafetyInspection $safetyInspection): static
    {
        if ($this->safetyInspections->removeElement($safetyInspection)) {
            // set the owning side to null (unless already changed)
            if ($safetyInspection->getGarage() === $this) {
                $safetyInspection->setGarage(null);
            }
        }

        return $this;
    }
}
