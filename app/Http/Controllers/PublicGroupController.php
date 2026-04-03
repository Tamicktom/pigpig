<?php

namespace App\Http\Controllers;

use App\Models\Drp;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class PublicGroupController extends Controller
{
    /**
     * Public group directory. Optional query: {@see drp_id} filters by DRP (non–soft-deleted only).
     */
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'drp_id' => [
                'sometimes',
                'nullable',
                'integer',
                Rule::exists('drps', 'id')->whereNull('deleted_at'),
            ],
            'page' => ['sometimes', 'integer', 'min:1'],
        ]);

        $query = Group::query()
            ->whereHas('drp')
            ->with(['drp:id,name,slug'])
            ->latest('id');

        if (! empty($validated['drp_id'])) {
            $query->where('drp_id', $validated['drp_id']);
        }

        $groups = $query->paginate(15)->through(function (Group $group): array {
            return [
                'id' => $group->id,
                'title' => $group->title,
                'drp' => $group->drp === null ? null : [
                    'id' => $group->drp->id,
                    'name' => $group->drp->name,
                    'slug' => $group->drp->slug,
                ],
            ];
        });

        $drpOptions = Drp::query()
            ->orderBy('name')
            ->get(['id', 'name', 'slug'])
            ->map(fn (Drp $drp): array => [
                'id' => $drp->id,
                'name' => $drp->name,
                'slug' => $drp->slug,
            ])
            ->values()
            ->all();

        return Inertia::render('groups/index', [
            'groups' => $groups,
            'filters' => [
                'drp_id' => isset($validated['drp_id']) ? (int) $validated['drp_id'] : null,
            ],
            'drpOptions' => $drpOptions,
            'canRegister' => Features::enabled(Features::registration()),
        ]);
    }

    /**
     * Public group detail with member display names only (no email or phone).
     */
    public function show(Group $group): Response
    {
        $group->load([
            'drp:id,name,slug',
            'members' => fn ($query) => $query->select('users.id', 'users.name'),
        ]);

        if ($group->drp === null) {
            abort(404);
        }

        return Inertia::render('groups/show', [
            'group' => [
                'id' => $group->id,
                'title' => $group->title,
                'drp' => [
                    'id' => $group->drp->id,
                    'name' => $group->drp->name,
                    'slug' => $group->drp->slug,
                ],
                'members' => $group->members->map(fn ($user): array => [
                    'id' => $user->id,
                    'name' => $user->name,
                ])->values()->all(),
            ],
            'canRegister' => Features::enabled(Features::registration()),
        ]);
    }
}
