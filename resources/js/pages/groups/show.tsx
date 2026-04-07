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

const memberContactLinkClassName =
    'text-sm text-on-surface-variant underline-offset-4 transition-colors duration-200 ease-out [@media(hover:hover)and(pointer:fine)]:hover:text-primary [@media(hover:hover)and(pointer:fine)]:hover:underline';

function memberInitialsFromName(name: string): string {
    const parts = name.trim().split(/\s+/u).filter((part) => part.length > 0);

    if (parts.length === 0) {
        return '?';
    }

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    const firstChar = parts[0].charAt(0);
    const lastChar = parts[parts.length - 1].charAt(0);

    return (firstChar + lastChar).toUpperCase();
}

type PublicDrpOption = {
    id: number;
    name: string;
    slug: string | null;
};

type PublicMember = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
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
        description: string | null;
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
    const showMemberPhones =
        viewer !== null && viewer.is_member === true;

    return (
        <>
            <Head title={group.title} />
            <GroupsPublicShell>
                <div className="flex flex-col gap-10 md:gap-12">
                    <div className="flex max-w-3xl flex-col gap-6">
                        <Link
                            href={groupsIndex.url()}
                            className="w-fit text-sm text-on-surface-variant transition-colors duration-200 ease-out [@media(hover:hover)and(pointer:fine)]:hover:text-primary [@media(hover:hover)and(pointer:fine)]:hover:underline underline-offset-4"
                        >
                            {t('groups.public.show.back')}
                        </Link>
                        <div className="flex flex-col gap-4">
                            <h1 className="font-headline text-4xl font-black tracking-tight text-on-background md:text-5xl">
                                {group.title}
                            </h1>
                            <span className="w-fit rounded-full bg-surface-container-high px-4 py-2 text-sm font-medium text-on-surface">
                                {group.drp.name}
                            </span>
                            {group.description !== null &&
                            group.description.trim() !== '' ? (
                                <section
                                    className="flex flex-col gap-2"
                                    aria-labelledby="groups-show-description-heading"
                                >
                                    <h2
                                        id="groups-show-description-heading"
                                        className="text-sm font-semibold text-on-surface-variant"
                                    >
                                        {t(
                                            'groups.public.show.description_heading',
                                        )}
                                    </h2>
                                    <p className="whitespace-pre-wrap text-base leading-relaxed text-on-surface">
                                        {group.description}
                                    </p>
                                </section>
                            ) : null}
                        </div>
                    </div>

                    {successMessage ? (
                        <p
                            className="rounded-2xl bg-surface-container-high px-6 py-4 text-sm text-on-surface motion-reduce:transition-none"
                            role="status"
                        >
                            {successMessage}
                        </p>
                    ) : null}

                    {viewer !== null ? (
                        <section
                            className="flex flex-col gap-4 rounded-2xl bg-surface-container-low p-6 md:p-8 motion-reduce:transition-none"
                            aria-labelledby="groups-show-join-heading"
                        >
                            <h2
                                id="groups-show-join-heading"
                                className="text-lg font-semibold text-on-surface"
                            >
                                {t('groups.public.show.join_section_title')}
                            </h2>
                            <p className="text-sm text-on-surface-variant">
                                {t('groups.public.show.members_progress', {
                                    current: viewer.member_count,
                                    max: viewer.max_members,
                                })}
                            </p>
                            {viewer.is_member ? (
                                <p className="text-sm text-on-surface">
                                    {t('groups.public.show.status_member')}
                                </p>
                            ) : null}
                            {viewer.is_owner ? (
                                <p className="text-sm text-on-surface">
                                    {t('groups.public.show.status_owner')}
                                </p>
                            ) : null}
                            {viewer.has_pending_request ? (
                                <p className="text-sm text-on-surface">
                                    {t('groups.public.show.status_pending')}
                                </p>
                            ) : null}
                            {viewer.can_request_join ? (
                                needsEmailVerification ? (
                                    <p className="text-sm text-on-surface-variant">
                                        {t('groups.public.show.verify_email_hint')}
                                    </p>
                                ) : (
                                    <Form
                                        {...joinRequestStore.form({
                                            group: group.id,
                                        })}
                                        disableWhileProcessing
                                        className="flex flex-col gap-3"
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
                                                        className="landing-primary-cta rounded-xl font-bold tracking-tight shadow-none"
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
                                <p className="text-sm text-on-surface-variant">
                                    {t('groups.join.error.same_drp_only')}
                                </p>
                            ) : null}
                        </section>
                    ) : null}

                    {viewer !== null &&
                    viewer.is_owner &&
                    viewer.pending_join_requests.length > 0 ? (
                        <section
                            className="flex flex-col gap-4"
                            aria-labelledby="groups-show-pending-heading"
                        >
                            <h2
                                id="groups-show-pending-heading"
                                className="text-lg font-semibold text-on-surface"
                            >
                                {t('groups.public.show.pending_heading')}
                            </h2>
                            <ul className="flex flex-col gap-6">
                                {viewer.pending_join_requests.map(
                                    (pendingRow) => (
                                        <li
                                            key={pendingRow.id}
                                            className="flex flex-col gap-4 rounded-xl bg-surface-container-lowest p-6 md:p-8"
                                        >
                                            <p className="text-sm font-semibold text-on-surface">
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
                                                                className="landing-primary-cta rounded-xl font-bold tracking-tight shadow-none"
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
                        className="flex flex-col gap-6"
                        aria-labelledby="groups-show-members-heading"
                    >
                        <h2
                            id="groups-show-members-heading"
                            className="text-lg font-semibold text-on-surface"
                        >
                            {t('groups.public.show.members_heading')}
                        </h2>
                        {group.members.length === 0 ? (
                            <p className="text-base text-on-surface-variant">
                                {t('groups.public.show.no_members')}
                            </p>
                        ) : (
                            <div className="rounded-2xl bg-surface-container-low p-6 md:p-8">
                                <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    {group.members.map((member) => (
                                        <li key={member.id}>
                                            <div className="flex h-full flex-col gap-4 rounded-xl bg-surface-container-lowest p-6">
                                                <div className="flex items-start gap-4">
                                                    <div
                                                        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-sm font-bold text-on-surface motion-reduce:transition-none"
                                                        aria-hidden
                                                    >
                                                        {memberInitialsFromName(
                                                            member.name,
                                                        )}
                                                    </div>
                                                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                                                        <span className="text-base font-semibold text-on-surface">
                                                            {member.name}
                                                        </span>
                                                        <div className="flex flex-col gap-0.5 text-sm">
                                                            <span className="text-on-surface-variant">
                                                                {t(
                                                                    'groups.public.show.member_email_label',
                                                                )}
                                                            </span>
                                                            <a
                                                                id={`groups-show-member-${member.id}-email`}
                                                                href={`mailto:${member.email}`}
                                                                className={
                                                                    memberContactLinkClassName
                                                                }
                                                            >
                                                                {member.email}
                                                            </a>
                                                        </div>
                                                        {showMemberPhones &&
                                                        member.phone !== null &&
                                                        member.phone !==
                                                            '' ? (
                                                            <div className="flex flex-col gap-0.5 pt-2 text-sm">
                                                                <span className="text-on-surface-variant">
                                                                    {t(
                                                                        'groups.public.show.member_phone_label',
                                                                    )}
                                                                </span>
                                                                <a
                                                                    id={`groups-show-member-${member.id}-phone`}
                                                                    href={`tel:${member.phone}`}
                                                                    className={
                                                                        memberContactLinkClassName
                                                                    }
                                                                    aria-label={t(
                                                                        'groups.public.show.member_phone_aria',
                                                                        {
                                                                            name: member.name,
                                                                        },
                                                                    )}
                                                                >
                                                                    {member.phone}
                                                                </a>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                {member.instagram_url ||
                                                member.linkedin_url ||
                                                member.twitter_url ? (
                                                    <ul className="flex flex-wrap gap-x-4 gap-y-2 border-t border-border/40 pt-4">
                                                        {member.instagram_url ? (
                                                            <li>
                                                                <a
                                                                    id={`groups-show-member-${member.id}-instagram`}
                                                                    href={
                                                                        member.instagram_url
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className={
                                                                        memberContactLinkClassName
                                                                    }
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
                                                                    className={
                                                                        memberContactLinkClassName
                                                                    }
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
                                                                    className={
                                                                        memberContactLinkClassName
                                                                    }
                                                                >
                                                                    {t(
                                                                        'groups.public.show.social_twitter',
                                                                    )}
                                                                </a>
                                                            </li>
                                                        ) : null}
                                                    </ul>
                                                ) : null}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </section>
                </div>
            </GroupsPublicShell>
        </>
    );
}
