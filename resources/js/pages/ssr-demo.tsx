import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Stat {
    label: string;
    value: string;
    description: string;
}

interface Feature {
    title: string;
    icon: string;
    description: string;
}

interface Testimonial {
    name: string;
    role: string;
    quote: string;
}

interface SsrDemoProps {
    serverTimestamp: string;
    stats: Stat[];
    features: Feature[];
    testimonials: Testimonial[];
}

const iconMap: Record<string, React.ReactNode> = {
    server: (
        <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 0 0-.12-1.03l-2.268-9.64a3.375 3.375 0 0 0-3.285-2.602H7.923a3.375 3.375 0 0 0-3.285 2.602l-2.268 9.64a4.5 4.5 0 0 0-.12 1.03v.228m19.5 0a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3m19.5 0a3 3 0 0 0-3-3H5.25a3 3 0 0 0-3 3m16.5 0h.008v.008h-.008v-.008Zm-3 0h.008v.008h-.008v-.008Z" />
        </svg>
    ),
    zap: (
        <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
        </svg>
    ),
    search: (
        <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
    ),
    layers: (
        <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
        </svg>
    ),
    clock: (
        <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    ),
    shield: (
        <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
    ),
};

export default function SsrDemo({ serverTimestamp, stats, features, testimonials }: SsrDemoProps) {
    const [hydrated, setHydrated] = useState(false);
    const [hydrationTime, setHydrationTime] = useState<string | null>(null);

    useEffect(() => {
        setHydrated(true);
        setHydrationTime(new Date().toISOString());
    }, []);

    return (
        <>
            <Head title="SSR Demo" />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
                {/* Render Indicator */}
                <div className="fixed right-4 top-4 z-50 flex flex-col items-end gap-1">
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold shadow-lg ${
                            hydrated
                                ? 'bg-green-500 text-white'
                                : 'bg-yellow-500 text-gray-900'
                        }`}
                    >
                        {hydrated ? 'Hydrated (Interactive)' : 'SSR (Static HTML)'}
                    </span>
                    {hydrationTime && (
                        <span className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300 shadow-lg">
                            Hydrated at: {new Date(hydrationTime).toLocaleTimeString()}
                        </span>
                    )}
                </div>

                {/* Instructions Banner */}
                <div className="border-b border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
                    <div className="mx-auto max-w-5xl px-6 py-5">
                        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-amber-800 dark:text-amber-300">
                            How to See SSR in Action
                        </h2>
                        <ol className="space-y-1.5 text-sm text-amber-900 dark:text-amber-200">
                            <li>
                                <span className="mr-2 inline-flex size-5 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800 dark:text-amber-200">1</span>
                                Open DevTools → Network tab → Throttle to <strong>"Slow 3G"</strong>
                            </li>
                            <li>
                                <span className="mr-2 inline-flex size-5 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800 dark:text-amber-200">2</span>
                                Reload — the full page appears <strong>instantly</strong> because the server sent rendered HTML
                            </li>
                            <li>
                                <span className="mr-2 inline-flex size-5 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800 dark:text-amber-200">3</span>
                                Stop the SSR server (<code className="rounded bg-amber-200 px-1 dark:bg-amber-800">php artisan inertia:stop-ssr</code>), throttle, reload — <strong>blank screen</strong> for seconds
                            </li>
                        </ol>
                    </div>
                </div>

                {/* Hero Section */}
                <section className="mx-auto max-w-5xl px-6 py-20 text-center">
                    <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
                        Server-Side Rendering
                        <span className="mt-2 block bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                            Changes Everything
                        </span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                        This entire page was rendered on the server at{' '}
                        <time className="font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                            {new Date(serverTimestamp).toLocaleTimeString()}
                        </time>
                        . Every piece of content you see arrived as plain HTML — no JavaScript needed for the first paint.
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <a
                            href="#features"
                            className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700"
                        >
                            Explore Features
                        </a>
                        <a
                            href="#how-it-works"
                            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            How It Works
                        </a>
                    </div>
                </section>

                {/* Stats Grid */}
                <section className="border-y border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                    <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px bg-gray-200 sm:grid-cols-4 dark:bg-gray-800">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="flex flex-col items-center gap-1 bg-white px-6 py-10 dark:bg-gray-900"
                            >
                                <span className="text-3xl font-extrabold text-indigo-600 sm:text-4xl dark:text-indigo-400">
                                    {stat.value}
                                </span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {stat.label}
                                </span>
                                <span className="text-center text-xs text-gray-500 dark:text-gray-400">
                                    {stat.description}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Features */}
                <section id="features" className="mx-auto max-w-5xl px-6 py-20">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Why SSR Matters
                        </h2>
                        <p className="mt-3 text-gray-600 dark:text-gray-400">
                            Every one of these benefits is visible right now — because this page was server-rendered.
                        </p>
                    </div>
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                            >
                                <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                    {iconMap[feature.icon]}
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                                    {feature.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* How It Works */}
                <section id="how-it-works" className="border-y border-gray-200 bg-white px-6 py-20 dark:border-gray-800 dark:bg-gray-900">
                    <div className="mx-auto max-w-5xl">
                        <div className="mb-12 text-center">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                How SSR Works with Inertia
                            </h2>
                        </div>
                        <div className="grid gap-8 sm:grid-cols-3">
                            {[
                                { step: '1', title: 'Server Renders', description: 'Laravel processes the request and Inertia\'s SSR server renders the React component to HTML on the server.' },
                                { step: '2', title: 'HTML Delivered', description: 'The fully-rendered HTML is sent to the browser. The user sees content immediately, even on slow networks.' },
                                { step: '3', title: 'Hydration', description: 'React "hydrates" the static HTML, attaching event listeners and making the page fully interactive.' },
                            ].map((item) => (
                                <div key={item.step} className="text-center">
                                    <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                        {item.step}
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="mx-auto max-w-5xl px-6 py-20">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            What Developers Say
                        </h2>
                    </div>
                    <div className="grid gap-8 sm:grid-cols-3">
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial.name}
                                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                            >
                                <svg className="mb-4 size-8 text-indigo-300 dark:text-indigo-700" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                </svg>
                                <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                    {testimonial.quote}
                                </p>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-gray-200 dark:border-gray-800">
                    <div className="mx-auto max-w-5xl px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        <p>
                            Server rendered at{' '}
                            <time className="font-mono font-semibold">
                                {serverTimestamp}
                            </time>
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
