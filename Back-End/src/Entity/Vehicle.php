<?php

namespace App\Entity;

use App\Repository\VehicleRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: VehicleRepository::class)]
class Vehicle
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private ?string $vehicleType = null;

    #[ORM\Column(length: 20)]
    #[Groups(['safety:read'])]
    private ?string $registrationNumber = null;

    #[ORM\Column(length: 50)]
    #[Groups(['safety:read'])]
    private ?string $brand = null;

    #[ORM\Column(length: 50)]
    #[Groups(['safety:read'])]
    private ?string $model = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['safety:read'])]
    private ?string $version = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $firstRegistrationDateAt = null;

    #[ORM\Column(length: 30)]
    private ?string $typeOfFuel = null;

    #[ORM\Column(length: 30)]
    private ?string $typeOfTransmission = null;

    #[ORM\Column(nullable: true)]
    private ?int $mileage = null;

    #[ORM\Column(nullable: true)]
    private ?int $kmPerDay = null;

    #[ORM\ManyToOne(inversedBy: 'vehicles')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column(length: 180)]
    private ?string $uuid = null;

    /**
     * @var Collection<int, Repairs>
     */
    #[ORM\OneToMany(targetEntity: Repairs::class, mappedBy: 'vehicle', orphanRemoval: true)]
    private Collection $repairs;

    /**
     * @var Collection<int, SafetyInspection>
     */
    #[ORM\OneToMany(targetEntity: SafetyInspection::class, mappedBy: 'vehicle', orphanRemoval: true)]
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

    public function getVehicleType(): ?string
    {
        return $this->vehicleType;
    }

    public function setVehicleType(string $vehicleType): static
    {
        $this->vehicleType = $vehicleType;

        return $this;
    }

    public function getRegistrationNumber(): ?string
    {
        return $this->registrationNumber;
    }

    public function setRegistrationNumber(string $registrationNumber): static
    {
        $this->registrationNumber = $registrationNumber;

        return $this;
    }

    public function getBrand(): ?string
    {
        return $this->brand;
    }

    public function setBrand(string $brand): static
    {
        $this->brand = $brand;

        return $this;
    }

    public function getModel(): ?string
    {
        return $this->model;
    }

    public function setModel(string $model): static
    {
        $this->model = $model;

        return $this;
    }

    public function getVersion(): ?string
    {
        return $this->version;
    }

    public function setVersion(?string $version): static
    {
        $this->version = $version;

        return $this;
    }

    public function getFirstRegistrationDateAt(): ?\DateTimeImmutable
    {
        return $this->firstRegistrationDateAt;
    }

    public function setFirstRegistrationDateAt(\DateTimeImmutable $firstRegistrationDateAt): static
    {
        $this->firstRegistrationDateAt = $firstRegistrationDateAt;

        return $this;
    }

    public function getTypeOfFuel(): ?string
    {
        return $this->typeOfFuel;
    }

    public function setTypeOfFuel(string $typeOfFuel): static
    {
        $this->typeOfFuel = $typeOfFuel;

        return $this;
    }

    public function getTypeOfTransmission(): ?string
    {
        return $this->typeOfTransmission;
    }

    public function setTypeOfTransmission(string $typeOfTransmission): static
    {
        $this->typeOfTransmission = $typeOfTransmission;

        return $this;
    }

    public function getMileage(): ?int
    {
        return $this->mileage;
    }

    public function setMileage(?int $mileage): static
    {
        $this->mileage = $mileage;

        return $this;
    }

    public function getKmPerDay(): ?int
    {
        return $this->kmPerDay;
    }

    public function setKmPerDay(?int $kmPerDay): static
    {
        $this->kmPerDay = $kmPerDay;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getUuid(): ?string
    {
        return $this->uuid;
    }

    public function setUuid(string $uuid): static
    {
        $this->uuid = $uuid;

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
            $repair->setVehicle($this);
        }

        return $this;
    }

    public function removeRepair(Repairs $repair): static
    {
        if ($this->repairs->removeElement($repair)) {
            // set the owning side to null (unless already changed)
            if ($repair->getVehicle() === $this) {
                $repair->setVehicle(null);
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
            $safetyInspection->setVehicle($this);
        }

        return $this;
    }

    public function removeSafetyInspection(SafetyInspection $safetyInspection): static
    {
        if ($this->safetyInspections->removeElement($safetyInspection)) {
            // set the owning side to null (unless already changed)
            if ($safetyInspection->getVehicle() === $this) {
                $safetyInspection->setVehicle(null);
            }
        }

        return $this;
    }
}
