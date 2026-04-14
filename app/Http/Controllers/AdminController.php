<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Report;

class AdminController extends Controller
{
    public function index()
    {
        $totalUsers = User::count();
        $pendingReports = Report::count();

        return view('admin.dashboard', compact('totalUsers', 'pendingReports'));
    }
}
