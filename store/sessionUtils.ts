import { User, UserRole, Organization } from '../types';
import { sessionHelper } from '@/lib/session';

function mapSessionUser(raw: Record<string, unknown>): User {
  const firstName = typeof raw.firstName === 'string' ? raw.firstName : '';
  const lastName = typeof raw.lastName === 'string' ? raw.lastName : '';
  const name =
    typeof raw.name === 'string' && raw.name
      ? raw.name
      : [firstName, lastName].filter(Boolean).join(' ') || 'User';
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const roleStr = typeof raw.role === 'string' ? raw.role.toLowerCase() : '';
  const role =
    roleStr === 'admin' ? UserRole.ADMIN :
    roleStr === 'editor' ? UserRole.EDITOR :
    roleStr === 'reviewer' ? UserRole.REVIEWER :
    UserRole.GUEST;

  return {
    id: (typeof raw._id === 'string' ? raw._id : null) ?? (typeof raw.id === 'string' ? raw.id : ''),
    name,
    email: typeof raw.email === 'string' ? raw.email : '',
    role,
    avatar:
      typeof raw.avatar === 'string' && raw.avatar
        ? raw.avatar
        : `https://placehold.co/100x100?text=${initials}`,
    organizationId: typeof raw.organizationId === 'string' ? raw.organizationId : '',
  };
}

export function getSessionOrganization(): Organization | null {
  const raw = sessionHelper.getCompany();
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  // userinfo structure: { id, firstName, ..., company: { id, name } }
  const nested = r.company && typeof r.company === 'object'
    ? r.company as Record<string, unknown>
    : r;
  const planRaw = typeof nested.plan === 'string' ? nested.plan : '';
  const plan: Organization['plan'] =
    planRaw === 'Pro' ? 'Pro' : planRaw === 'Enterprise' ? 'Enterprise' : 'Free';
  return {
    id: (typeof nested._id === 'string' ? nested._id : null) ?? (typeof nested.id === 'string' ? nested.id : 'org-api'),
    name: (typeof nested.name === 'string' && nested.name ? nested.name : 'Organization'),
    plan,
  };
}

export function getSessionUser(): User | null {
  const raw = sessionHelper.getUser();
  if (raw && typeof raw === 'object') {
    return mapSessionUser(raw as Record<string, unknown>);
  }
  return null;
}
