/**
 * Decides the landing page immediately after login/register.
 *
 * - SUPER_ADMIN → platform admin panel
 * - OWNER (or MANAGER/CASHIER/WAITER/KITCHEN_STAFF/DELIVERY_RIDER, i.e.
 *   anyone already attached to a restaurant as staff) → the regular
 *   restaurant dashboard
 * - CUSTOMER only, with none of the above → onboarding, since that role
 *   combination means "just registered, hasn't created or joined a
 *   restaurant yet." createRestaurant assigns OWNER, which is what moves
 *   a user out of this bucket on their next login.
 */
export function getPostAuthRedirect(roles: string[]): string {
  if (roles.includes('SUPER_ADMIN')) {
    return '/admin';
  }

  const staffRoles = ['OWNER', 'MANAGER', 'CASHIER', 'WAITER', 'KITCHEN_STAFF', 'DELIVERY_RIDER'];
  const hasStaffRole = roles.some((role) => staffRoles.includes(role));

  if (!hasStaffRole) {
    return '/onboarding';
  }

  return '/dashboard';
}
