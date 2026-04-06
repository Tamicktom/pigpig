<?php

namespace App\Http\Controllers;

use App\Http\Requests\AcceptGroupJoinRequestRequest;
use App\Http\Requests\DeclineGroupJoinRequestRequest;
use App\Http\Requests\StoreGroupJoinRequestRequest;
use App\Models\Group;
use App\Models\GroupJoinRequest;
use App\Services\GroupJoinRequestService;
use Illuminate\Http\RedirectResponse;

class GroupJoinRequestController extends Controller
{
    public function store(StoreGroupJoinRequestRequest $request, Group $group, GroupJoinRequestService $groupJoinRequestService): RedirectResponse
    {
        $groupJoinRequestService->submit($request->user(), $group);

        return redirect()
            ->route('groups.show', $group)
            ->with('success', __('groups.join.flash.sent'));
    }

    public function accept(AcceptGroupJoinRequestRequest $request, Group $group, GroupJoinRequest $joinRequest, GroupJoinRequestService $groupJoinRequestService): RedirectResponse
    {
        $groupJoinRequestService->accept($group, $joinRequest);

        return redirect()
            ->route('groups.show', $group)
            ->with('success', __('groups.join.flash.accepted'));
    }

    public function decline(DeclineGroupJoinRequestRequest $request, Group $group, GroupJoinRequest $joinRequest, GroupJoinRequestService $groupJoinRequestService): RedirectResponse
    {
        $groupJoinRequestService->decline($group, $joinRequest);

        return redirect()
            ->route('groups.show', $group)
            ->with('success', __('groups.join.flash.declined'));
    }
}
