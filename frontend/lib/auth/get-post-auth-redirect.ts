/**
 * Decides the landing page immediately after login/register.
 *
 * SUPER_ADMIN goes to the platform admin panel; everyone else (OWNER,
 * MANAGER, CASHIER, WAITER, KITCHEN_STAFF, DELIVERY_RIDER, CUSTOMER) goes
 * to the regular restaurant dashboard. Extend this if you ever need a
 * different landing page per role (e.g. CUSTOMER → a public order-tracking
 * page instead of the staff dashboard).
 */
export function getPostAuthRedirect(roles: string[]): string {
  if (roles.includes('SUPER_ADMIN')) {
    return '/admin';
  }
  return '/dashboard';
}