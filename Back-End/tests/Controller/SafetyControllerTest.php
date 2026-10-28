<?php

namespace App\Tests;

use App\Repository\SafetyInspectionRepository;
use App\Repository\VehicleRepository;
use App\Tests\AbstractWebTestCase;
use DateTime;
use PHPUnit\Framework\Attributes\TestWith;

class SafetyControllerTest extends AbstractWebTestCase
{
    #[TestWith(
        ['22',200,'{"safetyInspections":[{"id":86,"dueTimeAt":"2027-07-18T00:00:00+00:00","doneAt":null,"type":"P\u00e9riodique","vehicle":{"id":22,"vehicleType":"Voiture","registrationNumber":"CR-633-VW","brand":"Volkswagen","model":"Golf","version":"GTI","firstRegistrationDateAt":"2013-07-18T00:00:00+00:00","typeOfFuel":"Essence","typeOfTransmission":"Manuelle","mileage":176000,"kmPerDay":50}},{"id":85,"dueTimeAt":"2025-07-18T00:00:00+00:00","doneAt":"2025-07-02T00:00:00+00:00","type":"P\u00e9riodique","vehicle":{"id":22,"vehicleType":"Voiture","registrationNumber":"CR-633-VW","brand":"Volkswagen","model":"Golf","version":"GTI","firstRegistrationDateAt":"2013-07-18T00:00:00+00:00","typeOfFuel":"Essence","typeOfTransmission":"Manuelle","mileage":176000,"kmPerDay":50}},{"id":84,"dueTimeAt":"2023-07-18T00:00:00+00:00","doneAt":"2023-07-10T00:00:00+00:00","type":"P\u00e9riodique","vehicle":{"id":22,"vehicleType":"Voiture","registrationNumber":"CR-633-VW","brand":"Volkswagen","model":"Golf","version":"GTI","firstRegistrationDateAt":"2013-07-18T00:00:00+00:00","typeOfFuel":"Essence","typeOfTransmission":"Manuelle","mileage":176000,"kmPerDay":50}},{"id":83,"dueTimeAt":"2021-07-18T00:00:00+00:00","doneAt":"2021-07-05T00:00:00+00:00","type":"P\u00e9riodique","vehicle":{"id":22,"vehicleType":"Voiture","registrationNumber":"CR-633-VW","brand":"Volkswagen","model":"Golf","version":"GTI","firstRegistrationDateAt":"2013-07-18T00:00:00+00:00","typeOfFuel":"Essence","typeOfTransmission":"Manuelle","mileage":176000,"kmPerDay":50}}]}']
    )]
    #[TestWith(['20',403,"Invalid credentials"])]
    #[TestWith(['300',404,"Vehicle not found"])]
    public function testGetAll(string $route, int $code, string $res): void
    {
        $client = static::createClient();
        $this->loginUser($client, 'joe');
        $client->request('GET', self::URL_SAFETY_INSPECTION_ALL.$route);
        $response = $client->getResponse();
        $this->assertResponseStatusCodeSame($code);
        $this->assertEquals($res, $response->getContent());
    }

    #[TestWith(['23',23,200,new DateTime("2027-03-08 00:00:00"),"joe"])]
    #[TestWith(['14',14,200,new DateTime("+ 1 week"),"oskour"])]
    public function testAddFirst(string $route, int $id, int $code, DateTime $date, string $username): void
    {
        $client = static::createClient();
        $this->loginUser($client, $username);
        $client->request('POST', self::URL_SAFETY_INSPECTION_FIRST.$route);
        $this->assertResponseStatusCodeSame($code);
        if($code === 200){
            $safetyRepo = $this->getRepository(SafetyInspectionRepository::class);
            $vehicleRepo = $this->getRepository(VehicleRepository::class);
            $vehicle = $vehicleRepo->find($id);
            $safetyInspection = $safetyRepo->findOneBy(['dueTimeAt'=>$date, 'vehicle'=>$vehicle]);
            $this->removeEntity($safetyInspection);
        }
    }
}