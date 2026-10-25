<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20261025180245 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE garage (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(100) NOT NULL, address VARCHAR(255) NOT NULL, type VARCHAR(50) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE repairs (id INT AUTO_INCREMENT NOT NULL, type_of_repairs VARCHAR(50) NOT NULL, repaired_at DATETIME DEFAULT NULL, description LONGTEXT DEFAULT NULL, price DOUBLE PRECISION DEFAULT NULL, vehicle_id INT NOT NULL, garage_id INT DEFAULT NULL, INDEX IDX_57E93B61545317D1 (vehicle_id), INDEX IDX_57E93B61C4FFF555 (garage_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE safety_inspection (id INT AUTO_INCREMENT NOT NULL, due_time_at DATETIME NOT NULL, done_at DATETIME DEFAULT NULL, type VARCHAR(50) NOT NULL, vehicle_id INT NOT NULL, garage_id INT DEFAULT NULL, INDEX IDX_33C1D06F545317D1 (vehicle_id), INDEX IDX_33C1D06FC4FFF555 (garage_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, uuid VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, username VARCHAR(50) NOT NULL, email VARCHAR(100) NOT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_UUID (uuid), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE vehicle (id INT AUTO_INCREMENT NOT NULL, vehicle_type VARCHAR(50) NOT NULL, registration_number VARCHAR(20) NOT NULL, brand VARCHAR(50) NOT NULL, model VARCHAR(50) NOT NULL, version VARCHAR(50) DEFAULT NULL, first_registration_date_at DATETIME NOT NULL, type_of_fuel VARCHAR(30) NOT NULL, type_of_transmission VARCHAR(30) NOT NULL, mileage INT DEFAULT NULL, km_per_day INT DEFAULT NULL, uuid VARCHAR(180) NOT NULL, user_id INT NOT NULL, INDEX IDX_1B80E486A76ED395 (user_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE repairs ADD CONSTRAINT FK_57E93B61545317D1 FOREIGN KEY (vehicle_id) REFERENCES vehicle (id)');
        $this->addSql('ALTER TABLE repairs ADD CONSTRAINT FK_57E93B61C4FFF555 FOREIGN KEY (garage_id) REFERENCES garage (id)');
        $this->addSql('ALTER TABLE safety_inspection ADD CONSTRAINT FK_33C1D06F545317D1 FOREIGN KEY (vehicle_id) REFERENCES vehicle (id)');
        $this->addSql('ALTER TABLE safety_inspection ADD CONSTRAINT FK_33C1D06FC4FFF555 FOREIGN KEY (garage_id) REFERENCES garage (id)');
        $this->addSql('ALTER TABLE vehicle ADD CONSTRAINT FK_1B80E486A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE repairs DROP FOREIGN KEY FK_57E93B61545317D1');
        $this->addSql('ALTER TABLE repairs DROP FOREIGN KEY FK_57E93B61C4FFF555');
        $this->addSql('ALTER TABLE safety_inspection DROP FOREIGN KEY FK_33C1D06F545317D1');
        $this->addSql('ALTER TABLE safety_inspection DROP FOREIGN KEY FK_33C1D06FC4FFF555');
        $this->addSql('ALTER TABLE vehicle DROP FOREIGN KEY FK_1B80E486A76ED395');
        $this->addSql('DROP TABLE garage');
        $this->addSql('DROP TABLE repairs');
        $this->addSql('DROP TABLE safety_inspection');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE vehicle');
    }
}
