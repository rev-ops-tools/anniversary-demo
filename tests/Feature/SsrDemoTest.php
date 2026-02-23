<?php

use Inertia\Testing\AssertableInertia as Assert;

test('ssr demo page renders successfully', function () {
    $this->get('/ssr-demo')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('ssr-demo')
            ->has('serverTimestamp')
            ->has('stats', 4)
            ->has('features', 6)
            ->has('testimonials', 3)
        );
});
