//* Libraries imports
import { Form, Head, Link, usePage } from '@inertiajs/react';

//* Components imports
import {
    accept as joinRequestAccept,
    decline as joinRequestDecline,
    store as joinRequestStore,
} from '@/actions/App/Http/Controllers/GroupJoinRequestController';
import { GroupsPublicShell } from '@/components/groups-public-shell';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

//* Hooks imports
import { useTranslations } from '@/lib/i18n';

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
    instagram_url: string | null;
    linkedin_url: string | null;
    twitter_url: string | null;
};

type PendingJoinRequestRow = {
    id: number;
    user_name: string;
};

type GroupsShowViewer = {
    is_member: boolean;
    is_owner: boolean;
    has_pending_request: boolean;
    same_drp: boolean;
    member_count: number;
    max_members: number;
    can_request_join: boolean;
    pending_join_requests: PendingJoinRequestRow[];
};

type GroupsShowPageProps = {
    group: {
        id: number;
        title: string;
        drp: PublicDrpOption;
        members: PublicMember[];
    };
    viewer: GroupsShowViewer | null;
};

type GroupsShowSharedPageProps = GroupsShowPageProps & {
    success?: string | null;
};

export default function GroupsShow(props: GroupsShowPageProps) {
    const page = usePage<GroupsShowSharedPageProps>();
    const { t } = useTranslations();
    const group = props.group;
    const viewer = props.viewer;
    const successMessage = page.props.success ?? null;
    const needsEmailVerification =
        page.props.auth.needsEmailVerification;

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
                            {t('groups.public.show.back')}
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

                    {successMessage ? (
                        <p
                            className="rounded-lg border border-[#19140035] bg-white px-4 py-3 text-sm text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]"
                            role="status"
                        >
                            {successMessage}
                        </p>
                    ) : null}

                    {viewer !== null ? (
                        <section
                            className="flex flex-col gap-3 rounded-lg border border-[#19140035] bg-white p-4 dark:border-[#3E3E3A] dark:bg-[#161615]"
                            aria-labelledby="groups-show-join-heading"
                        >
                            <h2
                                id="groups-show-join-heading"
                                className="text-lg font-medium"
                            >
                                {t('groups.public.show.join_section_title')}
                            </h2>
                            <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                {t('groups.public.show.members_progress', {
                                    current: viewer.member_count,
                                    max: viewer.max_members,
                                })}
                            </p>
                            {viewer.is_member ? (
                                <p className="text-sm text-[#1b1b18] dark:text-[#EDEDEC]">
                                    {t('groups.public.show.status_member')}
                                </p>
                            ) : null}
                            {viewer.is_owner ? (
                                <p className="text-sm text-[#1b1b18] dark:text-[#EDEDEC]">
                                    {t('groups.public.show.status_owner')}
                                </p>
                            ) : null}
                            {viewer.has_pending_request ? (
                                <p className="text-sm text-[#1b1b18] dark:text-[#EDEDEC]">
                                    {t('groups.public.show.status_pending')}
                                </p>
                            ) : null}
                            {viewer.can_request_join ? (
                                needsEmailVerification ? (
                                    <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                        {t('groups.public.show.verify_email_hint')}
                                    </p>
                                ) : (
                                    <Form
                                        {...joinRequestStore.form({
                                            group: group.id,
                                        })}
                                        disableWhileProcessing
                                        className="flex flex-col gap-2"
                                    >
                                        {(formRenderProps) => (
                                            <>
                                                <InputError
                                                    message={
                                                        formRenderProps.errors
                                                            .join
                                                    }
                                                />
                                                <div>
                                                    <Button
                                                        id="groups-show-request-join-submit"
                                                        type="submit"
                                                        disabled={
                                                            formRenderProps.processing
                                                        }
                                                    >
                                                        {formRenderProps.processing ? (
                                                            <Spinner />
                                                        ) : null}
                                                        {t(
                                                            'groups.public.show.request_join',
                                                        )}
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </Form>
                                )
                            ) : null}
                            {!viewer.same_drp &&
                            !viewer.is_member &&
                            !viewer.is_owner ? (
                                <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                    {t('groups.join.error.same_drp_only')}
                                </p>
                            ) : null}
                        </section>
                    ) : null}

                    {viewer !== null &&
                    viewer.is_owner &&
                    viewer.pending_join_requests.length > 0 ? (
                        <section
                            className="flex flex-col gap-3"
                            aria-labelledby="groups-show-pending-heading"
                        >
                            <h2
                                id="groups-show-pending-heading"
                                className="text-lg font-medium"
                            >
                                {t('groups.public.show.pending_heading')}
                            </h2>
                            <ul className="flex flex-col gap-4">
                                {viewer.pending_join_requests.map(
                                    (pendingRow) => (
                                        <li
                                            key={pendingRow.id}
                                            className="flex flex-col gap-3 rounded-lg border border-[#19140035] bg-white p-4 dark:border-[#3E3E3A] dark:bg-[#161615]"
                                        >
                                            <p className="text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                                                {pendingRow.user_name}
                                            </p>
                                            <div className="flex flex-wrap gap-3">
                                                <Form
                                                    {...joinRequestAccept.form({
                                                        group: group.id,
                                                        joinRequest:
                                                            pendingRow.id,
                                                    })}
                                                    disableWhileProcessing
                                                    className="inline"
                                                >
                                                    {(acceptFormProps) => (
                                                        <>
                                                            <InputError
                                                                message={
                                                                    acceptFormProps
                                                                        .errors
                                                                        .join_request
                                                                }
                                                            />
                                                            <Button
                                                                id={`groups-show-accept-${pendingRow.id}`}
                                                                type="submit"
                                                                disabled={
                                                                    acceptFormProps.processing
                                                                }
                                                            >
                                                                {acceptFormProps.processing ? (
                                                                    <Spinner />
                                                                ) : null}
                                                                {t(
                                                                    'groups.public.show.accept',
                                                                )}
                                                            </Button>
                                                        </>
                                                    )}
                                                </Form>
                                                <Form
                                                    {...joinRequestDecline.form({
                                                        group: group.id,
                                                        joinRequest:
                                                            pendingRow.id,
                                                    })}
                                                    disableWhileProcessing
                                                    className="inline"
                                                >
                                                    {(declineFormProps) => (
                                                        <>
                                                            <InputError
                                                                message={
                                                                    declineFormProps
                                                                        .errors
                                                                        .join_request
                                                                }
                                                            />
                                                            <Button
                                                                id={`groups-show-decline-${pendingRow.id}`}
                                                                type="submit"
                                                                variant="secondary"
                                                                disabled={
                                                                    declineFormProps.processing
                                                                }
                                                            >
                                                                {declineFormProps.processing ? (
                                                                    <Spinner />
                                                                ) : null}
                                                                {t(
                                                                    'groups.public.show.decline',
                                                                )}
                                                            </Button>
                                                        </>
                                                    )}
                                                </Form>
                                            </div>
                                        </li>
                                    ),
                                )}
                            </ul>
                        </section>
                    ) : null}

                    <section
                        className="flex flex-col gap-3"
                        aria-labelledby="groups-show-members-heading"
                    >
                        <h2
                            id="groups-show-members-heading"
                            className="text-lg font-medium"
                        >
                            {t('groups.public.show.members_heading')}
                        </h2>
                        {group.members.length === 0 ? (
                            <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                {t('groups.public.show.no_members')}
                            </p>
                        ) : (
                            <ul className="flex flex-col gap-3 rounded-lg border border-[#19140035] bg-white p-4 dark:border-[#3E3E3A] dark:bg-[#161615]">
                                {group.members.map((member) => (
                                    <li
                                        key={member.id}
                                        className="flex flex-col gap-2 text-sm"
                                    >
                                        <span className="font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                                            {member.name}
                                        </span>
                                        {member.instagram_url ||
                                        member.linkedin_url ||
                                        member.twitter_url ? (
                                            <ul className="flex flex-wrap gap-x-3 gap-y-1">
                                                {member.instagram_url ? (
                                                    <li>
                                                        <a
                                                            id={`groups-show-member-${member.id}-instagram`}
                                                            href={
                                                                member.instagram_url
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-[#706f6c] underline-offset-4 hover:underline dark:text-[#A1A09A]"
                                                        >
                                                            {t(
                                                                'groups.public.show.social_instagram',
                                                            )}
                                                        </a>
                                                    </li>
                                                ) : null}
                                                {member.linkedin_url ? (
                                                    <li>
                                                        <a
                                                            id={`groups-show-member-${member.id}-linkedin`}
                                                            href={
                                                                member.linkedin_url
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-[#706f6c] underline-offset-4 hover:underline dark:text-[#A1A09A]"
                                                        >
                                                            {t(
                                                                'groups.public.show.social_linkedin',
                                                            )}
                                                        </a>
                                                    </li>
                                                ) : null}
                                                {member.twitter_url ? (
                                                    <li>
                                                        <a
                                                            id={`groups-show-member-${member.id}-twitter`}
                                                            href={
                                                                member.twitter_url
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-[#706f6c] underline-offset-4 hover:underline dark:text-[#A1A09A]"
                                                        >
                                                            {t(
                                                                'groups.public.show.social_twitter',
                                                            )}
                                                        </a>
                                                    </li>
                                                ) : null}
                                            </ul>
                                        ) : null}
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
