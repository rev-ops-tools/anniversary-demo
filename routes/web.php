<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('ssr-demo', function () {
    return Inertia::render('ssr-demo', [
        'serverTimestamp' => now()->toIso8601String(),
        'stats' => [
            ['label' => 'Active Users', 'value' => '2.4M+', 'description' => 'Monthly active users worldwide'],
            ['label' => 'Uptime', 'value' => '99.99%', 'description' => 'Average uptime over the last 12 months'],
            ['label' => 'Countries', 'value' => '180+', 'description' => 'Countries with active deployments'],
            ['label' => 'Response Time', 'value' => '<50ms', 'description' => 'Average API response time globally'],
        ],
        'features' => [
            ['title' => 'Server-Side Rendering', 'icon' => 'server', 'description' => 'Pages render on the server, so users see content immediately — even before JavaScript loads.'],
            ['title' => 'Instant Navigation', 'icon' => 'zap', 'description' => 'Client-side routing after hydration means page transitions feel instantaneous with no full reloads.'],
            ['title' => 'SEO Friendly', 'icon' => 'search', 'description' => 'Search engines receive fully-rendered HTML, improving indexability and ranking potential.'],
            ['title' => 'Progressive Enhancement', 'icon' => 'layers', 'description' => 'Content is visible immediately, and interactivity enhances progressively as JavaScript loads.'],
            ['title' => 'Reduced Time to Content', 'icon' => 'clock', 'description' => 'First Contentful Paint happens faster because the browser paints HTML before JS is parsed.'],
            ['title' => 'Resilient Experience', 'icon' => 'shield', 'description' => 'Even if JavaScript fails or is slow to load, users still see the full page content.'],
        ],
        'testimonials' => [
            ['name' => 'Sarah Chen', 'role' => 'Frontend Lead at Acme Corp', 'quote' => 'Switching to SSR cut our Time to First Contentful Paint by 60%. Users on slow connections finally get a great experience.'],
            ['name' => 'Marcus Johnson', 'role' => 'CTO at StartupXYZ', 'quote' => 'Our bounce rate on mobile dropped by 35% after enabling SSR. The difference on throttled networks is night and day.'],
            ['name' => 'Elena Rodriguez', 'role' => 'Performance Engineer', 'quote' => 'SSR with Inertia gives us the best of both worlds — server-rendered speed with SPA-like interactivity after hydration.'],
        ],
    ]);
})->name('ssr-demo');

require __DIR__.'/settings.php';
