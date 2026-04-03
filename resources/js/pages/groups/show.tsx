//* Libraries imports
import { Head, Link } from '@inertiajs/react';

//* Components imports
import { GroupsPublicShell } from '@/components/groups-public-shell';

//* Routes imports
import { index as groupsIndex } from '@/routes/groups';

type PublicDrpOption = {
    id: number;
    name: string;
    slug: string | null;
};

type PublicMember = {
    id: number;
    name: string;
};

type GroupsShowPageProps = {
    group: {
        id: number;
        title: string;
        drp: PublicDrpOption;
        members: PublicMember[];
    };
};

export default function GroupsShow(groupsShowPageProps: GroupsShowPageProps) {
    const group = groupsShowPageProps.group;

    return (
        <>
            <Head title={group.title} />
            <GroupsPublicShell>
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <Link
                            href={groupsIndex.url()}
                            className="w-fit text-sm text-[#706f6c] underline-offset-4 hover:underline dark:text-[#A1A09A]"
                        >
                            Back to groups
                        </Link>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                {group.title}
                            </h1>
                            <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                {group.drp.name}
                            </p>
                        </div>
                    </div>

                    <section
                        className="flex flex-col gap-3"
                        aria-labelledby="groups-show-members-heading"
                    >
                        <h2
                            id="groups-show-members-heading"
                            className="text-lg font-medium"
                        >
                            Members
                        </h2>
                        {group.members.length === 0 ? (
                            <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                No members listed.
                            </p>
                        ) : (
                            <ul className="flex flex-col gap-2 rounded-lg border border-[#19140035] bg-white p-4 dark:border-[#3E3E3A] dark:bg-[#161615]">
                                {group.members.map((member) => (
                                    <li key={member.id} className="text-sm">
                                        {member.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            </GroupsPublicShell>
        </>
    );
}
