import { LayoutDashboard, Store, CreditCard, Users, Settings } from 'lucide-react';

export const ADMIN_NAV_ITEMS = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Restaurants', href: '/admin/restaurants', icon: Store },
  { label: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
] as const;
