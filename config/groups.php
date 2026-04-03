<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Maximum group members
    |--------------------------------------------------------------------------
    |
    | Join requests can only be accepted while the group is below this count.
    | Aligns with product rules (e.g. Univesp PI group size). Phase 8 may add
    | minimum size and UI messaging around these limits.
    |
    */

    'max_members' => (int) env('GROUPS_MAX_MEMBERS', 8),

];
