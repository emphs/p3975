<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: "1.0.0",
    title: "Learning Resources API",
    description: "API documentation for the Learning Resources React Frontend"
)]
#[OA\Server(
    url: "http://localhost:8000",
    description: "Local API Server"
)]
abstract class Controller
{
    //
}
