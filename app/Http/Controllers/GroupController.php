<?php

namespace App\Http\Controllers;

use App\Actions\CreateGroup;
use App\Http\Requests\StoreGroupRequest;
use App\Models\Group;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GroupController extends Controller
{
    use AuthorizesRequests;

    /**
     * Show the form for creating a new group (always in the authenticated user's DRP).
     */
    public function create(Request $request): Response
    {
        $this->authorize('create', Group::class);

        $request->user()->load('drp');

        return Inertia::render('groups/create', [
            'drp' => [
                'name' => $request->user()->drp?->name ?? '',
            ],
        ]);
    }

    /**
     * Store a new group for the authenticated user.
     */
    public function store(StoreGroupRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $group = (new CreateGroup)->execute(
            $request->user(),
            $validated['title'],
            $validated['external_communication_link'] ?? null,
        );

        return redirect()
            ->route('groups.show', $group)
            ->with('success', 'Group created successfully.');
    }
}
