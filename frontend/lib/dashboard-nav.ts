import {
  BarChart3,
  Building2,
  GitBranch,
  Users,
  UserRound,
  LayoutGrid,
  UtensilsCrossed,
  Store,
  ClipboardPlus,
  ClipboardList,
  ChefHat,
  Package,
  FileBarChart2,
  Settings,
  UserCircle2,
} from 'lucide-react';

export const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
  },
  {
    label: 'Restaurant',
    href: '/dashboard/restaurant',
    icon: Building2,
  },
  {
    label: 'Branches',
    href: '/dashboard/branches',
    icon: GitBranch,
  },
  {
    label: 'Employees',
    href: '/dashboard/employees',
    icon: Users,
  },
  {
    label: 'Customers',
    href: '/dashboard/customers',
    icon: UserRound,
  },
  {
    label: 'Categories',
    href: '/dashboard/categories',
    icon: LayoutGrid,
  },
  {
    label: 'Menu',
    href: '/dashboard/menu',
    icon: UtensilsCrossed,
  },
  {
    label: 'Tables',
    href: '/dashboard/tables',
    icon: Store,
  },
  {
    label: 'POS',
    href: '/dashboard/pos',
    icon: ClipboardPlus,
  },
  {
    label: 'Orders',
    href: '/dashboard/orders',
    icon: ClipboardList,
  },
  {
    label: 'Kitchen',
    href: '/dashboard/kitchen',
    icon: ChefHat,
  },
  {
    label: 'Inventory',
    href: '/dashboard/inventory',
    icon: Package,
  },
  {
    label: 'Reports',
    href: '/dashboard/reports',
    icon: FileBarChart2,
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
  {
    label: 'Profile',
    href: '/dashboard/profile',
    icon: UserCircle2,
  },
] as const;