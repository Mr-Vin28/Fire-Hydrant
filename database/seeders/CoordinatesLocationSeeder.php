<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CoordinatesLocations;

class CoordinatesLocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CoordinatesLocations::create([
            'coordinates_id' => 1,
            'latitude' => 14.243217,
            'longitute' => 121.11925,
            'address' => 'Adelina'
        ]);
    }
}
