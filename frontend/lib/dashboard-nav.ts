import {
  BarChart3,
  ClipboardList,
  ChefHat,
  UtensilsCrossed,
  Store,
  Package,
  Users,
  Settings,
} from 'lucide-react';

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { label: 'Orders', href: '/dashboard/orders', icon: ClipboardList },
  { label: 'Kitchen', href: '/dashboard/kitchen', icon: ChefHat },
  { label: 'Menu', href: '/dashboard/menu', icon: UtensilsCrossed },
  { label: 'Tables', href: '/dashboard/tables', icon: Store },
  { label: 'Inventory', href: '/dashboard/inventory', icon: Package },
  { label: 'Employees', href: '/dashboard/employees', icon: Users },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
] as const;
