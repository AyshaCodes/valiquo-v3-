<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Country;

class CountrySeeder extends Seeder
{
    public function run(): void
    {
        Country::create([
            'code' => 'MA',
            'name' => 'Maroc',
            'currency' => 'MAD',
            'language' => 'fr',
            'cities' => [
                ['code' => 'CMN', 'name' => 'Casablanca', 'region' => 'Grand Casablanca', 'economicWeight' => 35, 'population' => 3400000],
                ['code' => 'RBA', 'name' => 'Rabat', 'region' => 'Rabat-Salé', 'economicWeight' => 12, 'population' => 1900000],
                ['code' => 'MKR', 'name' => 'Marrakech', 'region' => 'Marrakech-Safi', 'economicWeight' => 8, 'population' => 1100000],
                ['code' => 'TNG', 'name' => 'Tanger', 'region' => 'Tanger-Tétouan', 'economicWeight' => 10, 'population' => 1000000],
                ['code' => 'FES', 'name' => 'Fès', 'region' => 'Fès-Meknès', 'economicWeight' => 6, 'population' => 1200000],
                ['code' => 'AGD', 'name' => 'Agadir', 'region' => 'Souss-Massa', 'economicWeight' => 5, 'population' => 900000],
                ['code' => 'MEK', 'name' => 'Meknès', 'region' => 'Fès-Meknès', 'economicWeight' => 3, 'population' => 600000],
            ],
            'sectors' => [
                ['code' => 'TECH', 'name' => 'Tech & Digital', 'maturity' => 'growing', 'trends' => ['fintech', 'edtech', 'e-commerce']],
                ['code' => 'FOOD', 'name' => 'Foodtech', 'maturity' => 'emerging', 'trends' => ['delivery', 'dark kitchens', 'bio']],
                ['code' => 'EDU', 'name' => 'Edtech', 'maturity' => 'growing', 'trends' => ['online learning', 'certification']],
                ['code' => 'FIN', 'name' => 'Fintech', 'maturity' => 'emerging', 'trends' => ['mobile payment', 'crypto']],
                ['code' => 'HEALTH', 'name' => 'Santé', 'maturity' => 'growing', 'trends' => ['telemedicine', 'healthtech']],
                ['code' => 'AGR', 'name' => 'Agriculture', 'maturity' => 'mature', 'trends' => ['agritech', 'sustainable']],
                ['code' => 'TOUR', 'name' => 'Tourisme', 'maturity' => 'mature', 'trends' => ['eco-tourism', 'digital']],
                ['code' => 'TRANS', 'name' => 'Transport & Logistique', 'maturity' => 'growing', 'trends' => ['last mile', 'green']],
            ],
            'economic_data' => [
                'gdpGrowth' => 3.2,
                'digitalPenetration' => 87,
                'startupDensity' => 400,
                'averageSalary' => 8500,
                'marketSize' => 140000000000,
            ],
        ]);

        Country::create([
            'code' => 'FR',
            'name' => 'France',
            'currency' => 'EUR',
            'language' => 'fr',
            'cities' => [
                ['code' => 'PAR', 'name' => 'Paris', 'region' => 'Île-de-France', 'economicWeight' => 30, 'population' => 2200000],
                ['code' => 'LYN', 'name' => 'Lyon', 'region' => 'Auvergne-Rhône-Alpes', 'economicWeight' => 8, 'population' => 520000],
                ['code' => 'MAR', 'name' => 'Marseille', 'region' => 'Provence-Alpes-Côte d\'Azur', 'economicWeight' => 6, 'population' => 870000],
                ['code' => 'TLS', 'name' => 'Toulouse', 'region' => 'Occitanie', 'economicWeight' => 5, 'population' => 480000],
                ['code' => 'NIC', 'name' => 'Nice', 'region' => 'Provence-Alpes-Côte d\'Azur', 'economicWeight' => 3, 'population' => 340000],
                ['code' => 'NAN', 'name' => 'Nantes', 'region' => 'Pays de la Loire', 'economicWeight' => 4, 'population' => 320000],
                ['code' => 'STR', 'name' => 'Strasbourg', 'region' => 'Grand Est', 'economicWeight' => 3, 'population' => 280000],
                ['code' => 'BOR', 'name' => 'Bordeaux', 'region' => 'Nouvelle-Aquitaine', 'economicWeight' => 3, 'population' => 260000],
            ],
            'sectors' => [
                ['code' => 'TECH', 'name' => 'Tech & Digital', 'maturity' => 'mature', 'trends' => ['AI', 'web3', 'sustainability']],
                ['code' => 'FIN', 'name' => 'Fintech', 'maturity' => 'mature', 'trends' => ['neobanks', 'crypto', 'insurtech']],
                ['code' => 'HEALTH', 'name' => 'Healthtech', 'maturity' => 'mature', 'trends' => ['telemedicine', 'biotech']],
                ['code' => 'GREEN', 'name' => 'Green Tech', 'maturity' => 'growing', 'trends' => ['clean energy', 'circular economy']],
                ['code' => 'FOOD', 'name' => 'Foodtech', 'maturity' => 'growing', 'trends' => ['organic', 'local sourcing']],
                ['code' => 'EDU', 'name' => 'Edtech', 'maturity' => 'growing', 'trends' => ['online degrees', 'corporate training']],
                ['code' => 'RETAIL', 'name' => 'Retail Tech', 'maturity' => 'mature', 'trends' => ['omnichannel', 'personalization']],
                ['code' => 'MOB', 'name' => 'Mobility', 'maturity' => 'growing', 'trends' => ['electric', 'shared mobility']],
            ],
            'economic_data' => [
                'gdpGrowth' => 0.9,
                'digitalPenetration' => 95,
                'startupDensity' => 12000,
                'averageSalary' => 35000,
                'marketSize' => 2800000000000,
            ],
        ]);

        Country::create([
            'code' => 'CA',
            'name' => 'Canada',
            'currency' => 'CAD',
            'language' => 'en',
            'cities' => [
                ['code' => 'TOR', 'name' => 'Toronto', 'region' => 'Ontario', 'economicWeight' => 20, 'population' => 2900000],
                ['code' => 'MON', 'name' => 'Montréal', 'region' => 'Québec', 'economicWeight' => 12, 'population' => 1800000],
                ['code' => 'VAN', 'name' => 'Vancouver', 'region' => 'British Columbia', 'economicWeight' => 8, 'population' => 680000],
                ['code' => 'CAL', 'name' => 'Calgary', 'region' => 'Alberta', 'economicWeight' => 6, 'population' => 1400000],
                ['code' => 'OTT', 'name' => 'Ottawa', 'region' => 'Ontario', 'economicWeight' => 4, 'population' => 1000000],
                ['code' => 'EDM', 'name' => 'Edmonton', 'region' => 'Alberta', 'economicWeight' => 4, 'population' => 1000000],
                ['code' => 'QUE', 'name' => 'Québec', 'region' => 'Québec', 'economicWeight' => 3, 'population' => 540000],
                ['code' => 'WIN', 'name' => 'Winnipeg', 'region' => 'Manitoba', 'economicWeight' => 2, 'population' => 750000],
            ],
            'sectors' => [
                ['code' => 'TECH', 'name' => 'Tech & Digital', 'maturity' => 'growing', 'trends' => ['AI', 'fintech', 'cleantech']],
                ['code' => 'FIN', 'name' => 'Fintech', 'maturity' => 'growing', 'trends' => ['digital banking', 'payments']],
                ['code' => 'CLEAN', 'name' => 'Clean Tech', 'maturity' => 'growing', 'trends' => ['renewable energy', 'sustainability']],
                ['code' => 'HEALTH', 'name' => 'Healthtech', 'maturity' => 'mature', 'trends' => ['digital health', 'biotech']],
                ['code' => 'EDU', 'name' => 'Edtech', 'maturity' => 'growing', 'trends' => ['online learning', 'skills training']],
                ['code' => 'ECOM', 'name' => 'E-commerce', 'maturity' => 'mature', 'trends' => ['marketplaces', 'DTC']],
                ['code' => 'PROP', 'name' => 'PropTech', 'maturity' => 'emerging', 'trends' => ['smart buildings', 'real estate tech']],
                ['code' => 'FOOD', 'name' => 'Foodtech', 'maturity' => 'growing', 'trends' => ['meal kits', 'sustainable food']],
            ],
            'economic_data' => [
                'gdpGrowth' => 1.5,
                'digitalPenetration' => 94,
                'startupDensity' => 8000,
                'averageSalary' => 55000,
                'marketSize' => 2000000000000,
            ],
        ]);
    }
}
