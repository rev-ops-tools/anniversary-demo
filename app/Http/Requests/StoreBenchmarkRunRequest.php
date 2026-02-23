<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBenchmarkRunRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'request_count' => ['required', 'integer', 'min:1', 'max:500'],
            'avg_ms' => ['required', 'numeric', 'min:0'],
            'min_ms' => ['required', 'numeric', 'min:0'],
            'max_ms' => ['required', 'numeric', 'min:0'],
            'p95_ms' => ['required', 'numeric', 'min:0'],
            'median_ms' => ['required', 'numeric', 'min:0'],
            'total_ms' => ['required', 'numeric', 'min:0'],
            'metadata' => ['nullable', 'array'],
        ];
    }
}
