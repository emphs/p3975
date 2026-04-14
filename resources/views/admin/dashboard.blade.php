<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <style>
        body {
            font-family: sans-serif;
            background-color: #f4f4f5;
            padding: 20px;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .stats {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
        }

        .stat-card {
            background: #e0f2fe;
            padding: 15px;
            border-radius: 6px;
            flex: 1;
            text-align: center;
        }

        .nav-links a {
            display: inline-block;
            margin-right: 15px;
            color: #0284c7;
            text-decoration: none;
            font-weight: bold;
        }
    </style>
</head>

<body>

    <div class="container">
        <h1>Welcome to the Admin Panel, {{ Auth::user()->name }}</h1>

        <div class="nav-links">
            <a href="{{ route('admin.dashboard') }}">Dashboard</a>
            <a href="{{ route('admin.reports') }}">Moderation Queue</a>
        </div>

        <hr>

        <h2>Overview</h2>
        <div class="stats">
            <div class="stat-card">
                <h3>Total Users</h3>
                <p>{{ $totalUsers }}</p>
            </div>
            <div class="stat-card">
                <h3>Pending Reports</h3>
                <p>{{ $pendingReports }}</p>
            </div>
        </div>
    </div>

</body>

</html>