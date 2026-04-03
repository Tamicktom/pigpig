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
     * Paginated groups in the authenticated user's DRP (DRP context after login).
     */
    public function myDrpIndex(Request $request): Response
    {
        $user = $request->user();

        if ($user->drp_id === null) {
            abort(403);
        }

        $request->validate([
            'page' => ['sometimes', 'integer', 'min:1'],
        ]);

        $user->load('drp');

        $groups = Group::query()
            ->whereHas('drp')
            ->where('drp_id', $user->drp_id)
            ->with(['drp:id,name,slug'])
            ->withExists(['members' => fn ($query) => $query->where('users.id', $user->id)])
            ->latest('id')
            ->paginate(15)
            ->through(function (Group $group): array {
                return [
                    'id' => $group->id,
                    'title' => $group->title,
                    'is_member' => (bool) $group->members_exists,
                    'drp' => $group->drp === null ? null : [
                        'id' => $group->drp->id,
                        'name' => $group->drp->name,
                        'slug' => $group->drp->slug,
                    ],
                ];
            });

        return Inertia::render('my-groups/index', [
            'groups' => $groups,
            'drp' => [
                'name' => $user->drp?->name ?? '',
            ],
        ]);
    }

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
