<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],


    'github_models' => [
    'endpoint' => env('GITHUB_MODELS_ENDPOINT', 'https://models.github.ai'),
    'api_version' => env('GITHUB_MODELS_API_VERSION', '2026-03-10'),
    'token' => env('GITHUB_MODELS_TOKEN'),
    'model' => env('GITHUB_MODELS_MODEL', 'openai/gpt-4.1'),
    'temperature' => env('GITHUB_MODELS_TEMPERATURE', 0.2),
    'max_tokens' => env('GITHUB_MODELS_MAX_TOKENS', 350),
    'refresh_after_new_reviews' => env('AI_SUMMARY_REFRESH_AFTER_NEW_REVIEWS', 3),
    'refresh_interval_hours' => env('AI_SUMMARY_REFRESH_INTERVAL_HOURS', 24),

    ],

];
