<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;

class Controller extends BaseController
{
    /**
     * Method untuk memproses data input.
     */
    protected function processInput(Request $request)
    {
        // Proses data input dari request
        return $request->all();
    }
}