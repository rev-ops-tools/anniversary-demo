<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBenchmarkRunRequest;
use App\Models\BenchmarkRun;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BenchmarkController extends Controller
{
    /**
     * Display the benchmark page.
     */
    public function index(): Response
    {
        $runs = BenchmarkRun::query()
            ->latest()
            ->limit(20)
            ->get();

        $latestOctane = BenchmarkRun::query()
            ->where('run_type', 'octane')
            ->latest()
            ->first();

        $latestStandard = BenchmarkRun::query()
            ->where('run_type', 'standard')
            ->latest()
            ->first();

        return Inertia::render('benchmark', [
            'runs' => $runs,
            'latestOctane' => $latestOctane,
            'latestStandard' => $latestStandard,
        ]);
    }

    /**
     * Lightweight ping endpoint for benchmarking framework overhead.
     */
    public function ping(): JsonResponse
    {
        $start = hrtime(true);

        // Realistic framework work
        config('app.name');
        config('app.env');
        config('database.default');
        app('router');
        app('db');
        BenchmarkRun::query()->count();
        route('benchmark');
        encrypt('benchmark-test');

        $elapsed = (hrtime(true) - $start) / 1e6;

        return response()->json([
            'elapsed_ms' => round($elapsed, 3),
        ]);
    }

    /**
     * Store a completed benchmark run.
     */
    public function store(StoreBenchmarkRunRequest $request): RedirectResponse
    {
        BenchmarkRun::query()->create($request->validated());

        return to_route('benchmark');
    }
}
