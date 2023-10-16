<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CoordinatesLocations;

class CoordinateLocationController extends Controller
{
    public function displayLocations(){
        $test = CoordinatesLocations::get();
        dd($test);
    }

}
