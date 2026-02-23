<?php

use App\Models\BenchmarkRun;
use Inertia\Testing\AssertableInertia as Assert;

test('ping endpoint returns elapsed_ms and octane status', function () {
    $response = $this->getJson(route('benchmark.ping'));

    $response->assertOk()
        ->assertJsonStructure(['elapsed_ms', 'octane']);

    expect($response->json('elapsed_ms'))->toBeFloat();
    expect($response->json('octane'))->toBeBool();
});

test('index page renders with props', function () {
    BenchmarkRun::factory()->octane()->create();
    BenchmarkRun::factory()->standard()->create();

    $response = $this->get(route('benchmark'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('benchmark')
            ->has('runs')
            ->has('latestOctane')
            ->has('latestStandard')
            ->has('octaneRunning')
        );
});

test('store endpoint creates a benchmark run with auto-detected run type', function () {
    $data = [
        'request_count' => 100,
        'avg_ms' => 2.5,
        'min_ms' => 1.0,
        'max_ms' => 10.0,
        'p95_ms' => 8.0,
        'median_ms' => 2.2,
        'total_ms' => 250.0,
    ];

    $response = $this->post(route('benchmark.store'), $data);

    $response->assertRedirect(route('benchmark'));

    $this->assertDatabaseHas('benchmark_runs', [
        'run_type' => 'standard',
        'request_count' => 100,
    ]);
});

test('store validation rejects bad data', function () {
    $response = $this->post(route('benchmark.store'), [
        'request_count' => 1000,
        'avg_ms' => -1,
    ]);

    $response->assertSessionHasErrors(['request_count', 'avg_ms']);
});
