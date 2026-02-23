<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BenchmarkRun extends Model
{
    /** @use HasFactory<\Database\Factories\BenchmarkRunFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'run_type',
        'request_count',
        'avg_ms',
        'min_ms',
        'max_ms',
        'p95_ms',
        'median_ms',
        'total_ms',
        'metadata',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'avg_ms' => 'float',
            'min_ms' => 'float',
            'max_ms' => 'float',
            'p95_ms' => 'float',
            'median_ms' => 'float',
            'total_ms' => 'float',
            'request_count' => 'integer',
            'metadata' => 'array',
        ];
    }
}
