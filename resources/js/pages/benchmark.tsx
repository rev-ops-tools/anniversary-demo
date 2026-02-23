import { Head, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';

interface BenchmarkRunData {
    id: number;
    run_type: 'octane' | 'standard';
    request_count: number;
    avg_ms: number;
    min_ms: number;
    max_ms: number;
    p95_ms: number;
    median_ms: number;
    total_ms: number;
    created_at: string;
}

interface BenchmarkProps {
    runs: BenchmarkRunData[];
    latestOctane: BenchmarkRunData | null;
    latestStandard: BenchmarkRunData | null;
}

function formatMs(ms: number): string {
    return ms.toFixed(2);
}

function deltaPercent(octane: number, standard: number): string {
    if (standard === 0) return '—';
    const delta = ((standard - octane) / standard) * 100;
    return `${delta > 0 ? '-' : '+'}${Math.abs(delta).toFixed(1)}%`;
}

function StatCard({
    label,
    octaneValue,
    standardValue,
}: {
    label: string;
    octaneValue: number | undefined;
    standardValue: number | undefined;
}) {
    const hasComparison = octaneValue !== undefined && standardValue !== undefined;
    const delta = hasComparison ? deltaPercent(octaneValue, standardValue) : null;
    const isFaster = hasComparison && octaneValue < standardValue;

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <p className="mb-1 text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">{label}</p>
            <div className="flex items-end gap-3">
                <div className="flex-1">
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Octane</p>
                    <p className="font-mono text-2xl font-bold text-gray-900 dark:text-white">
                        {octaneValue !== undefined ? formatMs(octaneValue) : '—'}
                        <span className="ml-1 text-sm font-normal text-gray-400">ms</span>
                    </p>
                </div>
                <div className="flex-1">
                    <p className="text-xs font-medium text-amber-600 dark:text-amber-400">Standard</p>
                    <p className="font-mono text-2xl font-bold text-gray-900 dark:text-white">
                        {standardValue !== undefined ? formatMs(standardValue) : '—'}
                        <span className="ml-1 text-sm font-normal text-gray-400">ms</span>
                    </p>
                </div>
                {delta && (
                    <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            isFaster ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                        }`}
                    >
                        {delta}
                    </span>
                )}
            </div>
        </div>
    );
}

export default function Benchmark({ runs, latestOctane, latestStandard }: BenchmarkProps) {
    const [requestCount, setRequestCount] = useState(100);
    const [runType, setRunType] = useState<'octane' | 'standard'>('octane');
    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [liveStats, setLiveStats] = useState<{ avg: number; min: number; max: number; count: number } | null>(null);

    const runBenchmark = useCallback(async () => {
        setIsRunning(true);
        setProgress(0);
        setLiveStats(null);

        const timings: number[] = [];

        for (let i = 0; i < requestCount; i++) {
            try {
                const response = await fetch('/benchmark/ping');
                const data = await response.json();
                timings.push(data.elapsed_ms);
            } catch {
                timings.push(0);
            }

            const completed = i + 1;
            setProgress(Math.round((completed / requestCount) * 100));

            if (completed % 5 === 0 || completed === requestCount) {
                const valid = timings.filter((t) => t > 0);
                if (valid.length > 0) {
                    setLiveStats({
                        avg: valid.reduce((a, b) => a + b, 0) / valid.length,
                        min: Math.min(...valid),
                        max: Math.max(...valid),
                        count: valid.length,
                    });
                }
            }
        }

        const valid = timings.filter((t) => t > 0);
        if (valid.length === 0) {
            setIsRunning(false);
            return;
        }

        const sorted = [...valid].sort((a, b) => a - b);
        const avg = sorted.reduce((a, b) => a + b, 0) / sorted.length;
        const p95Index = Math.floor(sorted.length * 0.95);
        const medianIndex = Math.floor(sorted.length * 0.5);

        router.post(
            '/benchmark/runs',
            {
                run_type: runType,
                request_count: valid.length,
                avg_ms: Number(avg.toFixed(3)),
                min_ms: Number(sorted[0].toFixed(3)),
                max_ms: Number(sorted[sorted.length - 1].toFixed(3)),
                p95_ms: Number(sorted[p95Index].toFixed(3)),
                median_ms: Number(sorted[medianIndex].toFixed(3)),
                total_ms: Number(sorted.reduce((a, b) => a + b, 0).toFixed(3)),
            },
            {
                onFinish: () => {
                    setIsRunning(false);
                    setProgress(0);
                    setLiveStats(null);
                },
            },
        );
    }, [requestCount, runType]);

    return (
        <>
            <Head title="Octane Benchmark" />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
                {/* Hero */}
                <section className="mx-auto max-w-5xl px-6 py-20 text-center">
                    <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
                        Octane Performance
                        <span className="mt-2 block bg-gradient-to-r from-emerald-500 to-cyan-600 bg-clip-text text-transparent">
                            Benchmark
                        </span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                        Measure the real difference Octane makes. Run benchmarks on standard and Octane deployments, then compare results
                        side-by-side.
                    </p>
                </section>

                {/* Controls */}
                <section className="mx-auto max-w-5xl px-6 pb-12">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex flex-wrap items-end gap-4">
                            <div>
                                <label htmlFor="runType" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Deployment Type
                                </label>
                                <select
                                    id="runType"
                                    value={runType}
                                    onChange={(e) => setRunType(e.target.value as 'octane' | 'standard')}
                                    disabled={isRunning}
                                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                >
                                    <option value="octane">Octane</option>
                                    <option value="standard">Standard</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="requestCount" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Requests
                                </label>
                                <input
                                    id="requestCount"
                                    type="number"
                                    min={1}
                                    max={500}
                                    value={requestCount}
                                    onChange={(e) => setRequestCount(Math.min(500, Math.max(1, Number(e.target.value))))}
                                    disabled={isRunning}
                                    className="w-24 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                />
                            </div>
                            <button
                                onClick={runBenchmark}
                                disabled={isRunning}
                                className={`rounded-lg px-6 py-2 text-sm font-semibold text-white shadow-md transition ${
                                    isRunning
                                        ? 'cursor-not-allowed bg-gray-400'
                                        : runType === 'octane'
                                          ? 'bg-emerald-600 hover:bg-emerald-700'
                                          : 'bg-amber-600 hover:bg-amber-700'
                                }`}
                            >
                                {isRunning ? 'Running...' : 'Run Benchmark'}
                            </button>
                        </div>

                        {/* Progress Bar */}
                        {isRunning && (
                            <div className="mt-4">
                                <div className="mb-2 flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>Progress</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div
                                        className={`h-full rounded-full transition-all duration-200 ${
                                            runType === 'octane' ? 'bg-emerald-500' : 'bg-amber-500'
                                        }`}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Live Stats */}
                        {liveStats && (
                            <div className="mt-4 grid grid-cols-4 gap-4">
                                {[
                                    { label: 'Requests', value: liveStats.count.toString() },
                                    { label: 'Avg', value: `${formatMs(liveStats.avg)} ms` },
                                    { label: 'Min', value: `${formatMs(liveStats.min)} ms` },
                                    { label: 'Max', value: `${formatMs(liveStats.max)} ms` },
                                ].map((stat) => (
                                    <div key={stat.label} className="text-center">
                                        <p className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">{stat.label}</p>
                                        <p className="font-mono text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Comparison */}
                {(latestOctane || latestStandard) && (
                    <section className="mx-auto max-w-5xl px-6 pb-12">
                        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Latest Comparison</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <StatCard label="Average" octaneValue={latestOctane?.avg_ms} standardValue={latestStandard?.avg_ms} />
                            <StatCard label="Median" octaneValue={latestOctane?.median_ms} standardValue={latestStandard?.median_ms} />
                            <StatCard label="P95" octaneValue={latestOctane?.p95_ms} standardValue={latestStandard?.p95_ms} />
                            <StatCard label="Minimum" octaneValue={latestOctane?.min_ms} standardValue={latestStandard?.min_ms} />
                            <StatCard label="Maximum" octaneValue={latestOctane?.max_ms} standardValue={latestStandard?.max_ms} />
                            <StatCard label="Total" octaneValue={latestOctane?.total_ms} standardValue={latestStandard?.total_ms} />
                        </div>
                    </section>
                )}

                {/* Historical Runs */}
                {runs.length > 0 && (
                    <section className="mx-auto max-w-5xl px-6 pb-20">
                        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Historical Runs</h2>
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
                                        <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Type</th>
                                        <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Requests</th>
                                        <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Avg</th>
                                        <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">P95</th>
                                        <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Min</th>
                                        <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Max</th>
                                        <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">When</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                    {runs.map((run) => (
                                        <tr key={run.id} className="hover:bg-gray-50 dark:hover:bg-gray-950">
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                        run.run_type === 'octane'
                                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                                                    }`}
                                                >
                                                    {run.run_type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-mono text-gray-900 dark:text-white">{run.request_count}</td>
                                            <td className="px-4 py-3 font-mono text-gray-900 dark:text-white">
                                                {formatMs(run.avg_ms)} ms
                                            </td>
                                            <td className="px-4 py-3 font-mono text-gray-900 dark:text-white">
                                                {formatMs(run.p95_ms)} ms
                                            </td>
                                            <td className="px-4 py-3 font-mono text-gray-900 dark:text-white">
                                                {formatMs(run.min_ms)} ms
                                            </td>
                                            <td className="px-4 py-3 font-mono text-gray-900 dark:text-white">
                                                {formatMs(run.max_ms)} ms
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                                {new Date(run.created_at).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}
