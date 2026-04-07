<?php

namespace App\Http\Requests;

use App\Models\Group;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreGroupRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();

        return $user !== null && Gate::forUser($user)->allows('create', Group::class);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'external_communication_link' => ['nullable', 'string', 'url', 'max:2048'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'title' => __('groups.create.attribute.title'),
            'description' => __('groups.create.attribute.description'),
            'external_communication_link' => __('groups.create.attribute.external_communication_link'),
        ];
    }
}
