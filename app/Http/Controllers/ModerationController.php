<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;

class ModerationController extends Controller
{
    // Show the list of reports
    public function index()
    {
        // Fetch all pending reports, newest first. 
        // We use 'with' to eager-load the user who made the report, and the content being reported.
        $reports = Report::with(['user', 'reportable'])->latest()->get();

        return view('admin.reports', compact('reports'));
    }

    // Delete the reported content AND the report itself
    public function destroy($id)
    {
        $report = Report::findOrFail($id);
        
        // 1. Delete the actual bad content (the Review or the Learning Resource)
        if ($report->reportable) {
            $report->reportable->delete();
        }

        // 2. Delete the report from the queue since it's been handled
        $report->delete();

        return back()->with('success', 'The offending content has been removed.');
    }
}