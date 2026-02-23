<?php

use App\Models\BenchmarkRun;
use Inertia\Testing\AssertableInertia as Assert;

test('ping endpoint returns elapsed_ms', function () {
    $response = $this->getJson(route('benchmark.ping'));

    $response->assertOk()
        ->assertJsonStructure(['elapsed_ms']);

    expect($response->json('elapsed_ms'))->toBeFloat();
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
        );
});

test('store endpoint creates a benchmark run', function () {
    $data = [
        'run_type' => 'octane',
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
        'run_type' => 'octane',
        'request_count' => 100,
    ]);
});

test('store validation rejects invalid data', function () {
    $response = $this->post(route('benchmark.store'), [
        'run_type' => 'invalid',
        'request_count' => 1000,
        'avg_ms' => -1,
    ]);

    $response->assertSessionHasErrors(['run_type', 'request_count', 'avg_ms']);
});
