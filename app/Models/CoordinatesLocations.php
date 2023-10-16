<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoordinatesLocations extends Model
{
    use HasFactory;

    protected $table = 'coordinates_locations';
    
    protected $primaryKey = 'coordinates_id';

    protected $fillable = [
        'latitude',
        'longitude',
        'address'
    ];
}
