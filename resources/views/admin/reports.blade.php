<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Moderation Queue</title>
    <style>
        body { font-family: sans-serif; background-color: #f4f4f5; padding: 20px; }
        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .nav-links a { display: inline-block; margin-right: 15px; color: #0284c7; text-decoration: none; font-weight: bold; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8fafc; }
        .btn-delete { background-color: #dc2626; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; }
        .btn-delete:hover { background-color: #b91c1c; }
        .success-msg { background-color: #dcfce7; color: #166534; padding: 10px; border-radius: 4px; margin-bottom: 15px; }
    </style>
</head>
<body>

    <div class="container">
        <div class="nav-links">
            <a href="{{ route('admin.dashboard') }}">← Back to Dashboard</a>
        </div>

        <h1 style="margin-top: 0;">Moderation Queue</h1>

        @if(session('success'))
            <div class="success-msg">{{ session('success') }}</div>
        @endif

        <table>
            <thead>
                <tr>
                    <th>Report ID</th>
                    <th>Reported By</th>
                    <th>Reason</th>
                    <th>Content Type</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                @forelse($reports as $report)
                    <tr>
                        <td>#{{ $report->id }}</td>
                        <td>{{ $report->user->name ?? 'Unknown User' }}</td>
                        <td>{{ $report->reason }}</td>
                        <td>{{ class_basename($report->reportable_type) }} (ID: {{ $report->reportable_id }})</td>
                        <td>
                            <form action="{{ route('admin.reports.destroy', $report->id) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this content permanently?');">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn-delete">Delete Content</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" style="text-align: center; color: #666;">No pending reports! Good job.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

</body>
</html>