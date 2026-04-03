<?php

namespace App\Http\Requests;

use App\Models\Group;
use App\Models\GroupJoinRequest;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class AcceptGroupJoinRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        $group = $this->route('group');
        $joinRequest = $this->route('joinRequest');

        return $group instanceof Group
            && $joinRequest instanceof GroupJoinRequest
            && $this->user() !== null
            && Gate::forUser($this->user())->allows('acceptJoinRequest', [$group, $joinRequest]);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [];
    }
}
