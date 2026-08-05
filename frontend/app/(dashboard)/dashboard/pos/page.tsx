'use client';

import { useMemo, useState } from 'react';
import {
  Search,
  Plus,
  Minus,
  X,
  UtensilsCrossed,
  ShoppingBag,
  Bike,
  Pause,
  Printer,
  CircleCheck,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Mock data — swap for real GraphQL queries (menuItems, tables, employees,
// customers) once those resolvers exist on the backend.
// ---------------------------------------------------------------------------

type OrderType = 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  emoji: string;
}

const CATEGORIES = ['All', 'Starters', 'Mains', 'Grill', 'Drinks', 'Desserts'] as const;

const MENU_ITEMS: MenuItem[] = [
  { id: 'm1', name: 'Chicken Wings', price: 8.5, category: 'Starters', emoji: '🍗' },
  { id: 'm2', name: 'Spring Rolls', price: 6.0, category: 'Starters', emoji: '🥟' },
  { id: 'm3', name: 'Garlic Bread', price: 4.5, category: 'Starters', emoji: '🍞' },
  { id: 'm4', name: 'Beef Burger', price: 12.9, category: 'Mains', emoji: '🍔' },
  { id: 'm5', name: 'Margherita Pizza', price: 14.0, category: 'Mains', emoji: '🍕' },
  { id: 'm6', name: 'Grilled Salmon', price: 18.5, category: 'Mains', emoji: '🐟' },
  { id: 'm7', name: 'Chicken Tikka', price: 13.5, category: 'Grill', emoji: '🍢' },
  { id: 'm8', name: 'Beef Steak', price: 22.0, category: 'Grill', emoji: '🥩' },
  { id: 'm9', name: 'Lamb Kebab', price: 16.0, category: 'Grill', emoji: '🍖' },
  { id: 'm10', name: 'Lemonade', price: 3.5, category: 'Drinks', emoji: '🍋' },
  { id: 'm11', name: 'Iced Coffee', price: 4.0, category: 'Drinks', emoji: '🧋' },
  { id: 'm12', name: 'Sparkling Water', price: 2.5, category: 'Drinks', emoji: '🥤' },
  { id: 'm13', name: 'Chocolate Cake', price: 6.5, category: 'Desserts', emoji: '🍰' },
  { id: 'm14', name: 'Ice Cream', price: 5.0, category: 'Desserts', emoji: '🍨' },
];

const TABLES = ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6', 'Table 7', 'Table 8'];
const WAITERS = ['Test Owner', 'Amara Khan', 'Leo Fischer', 'Priya Nair'];
const CUSTOMERS = ['Walk-in', 'Dana Reyes', 'Ahmed Karim', 'Sofia Marin'];

const ORDER_TYPES: { value: OrderType; label: string; icon: typeof UtensilsCrossed }[] = [
  { value: 'DINE_IN', label: 'Dine In', icon: UtensilsCrossed },
  { value: 'TAKEAWAY', label: 'Takeaway', icon: ShoppingBag },
  { value: 'DELIVERY', label: 'Delivery', icon: Bike },
];

interface CartLine {
  item: MenuItem;
  quantity: number;
}

// ---------------------------------------------------------------------------

export default function POSPage() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartLine[]>([]);

  const [orderType, setOrderType] = useState<OrderType>('DINE_IN');
  const [table, setTable] = useState(TABLES[0]);
  const [waiter, setWaiter] = useState(WAITERS[0]);
  const [customer, setCustomer] = useState(CUSTOMERS[0]);
  const [notes, setNotes] = useState('');
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(5);
  const [cashReceived, setCashReceived] = useState<string>('');

  const filteredMenu = useMemo(() => {
    return MENU_ITEMS.filter((m) => {
      const matchesCategory = category === 'All' || m.category === category;
      const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const subtotal = useMemo(
    () => cart.reduce((sum, line) => sum + line.item.price * line.quantity, 0),
    [cart],
  );
  const taxAmount = subtotal * (taxRate / 100);
  const total = Math.max(subtotal - discount + taxAmount, 0);
  const cashValue = parseFloat(cashReceived) || 0;
  const change = Math.max(cashValue - total, 0);

  function addToCart(item: MenuItem) {
    setCart((prev) => {
      const existing = prev.find((l) => l.item.id === item.id);
      if (existing) {
        return prev.map((l) => (l.item.id === item.id ? { ...l, quantity: l.quantity + 1 } : l));
      }
      return [...prev, { item, quantity: 1 }];
    });
  }

  function updateQuantity(itemId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((l) => (l.item.id === itemId ? { ...l, quantity: l.quantity + delta } : l))
        .filter((l) => l.quantity > 0),
    );
  }

  function removeFromCart(itemId: string) {
    setCart((prev) => prev.filter((l) => l.item.id !== itemId));
  }

  function fmt(n: number) {
    return `$${n.toFixed(2)}`;
  }

  return (
    <div className="flex h-full gap-4 p-4">
      {/* ------------------------------------------------------------ */}
      {/* LEFT — Menu                                                   */}
      {/* ------------------------------------------------------------ */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
          <Search size={16} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search menu..."
            className="w-full text-sm outline-none"
          />
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={[
                'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                category === c
                  ? 'border-ink bg-ink text-paper'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300',
              ].join(' ')}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid flex-1 grid-cols-2 gap-3 overflow-y-auto pb-2 sm:grid-cols-3 xl:grid-cols-4">
          {filteredMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => addToCart(item)}
              className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white text-left shadow-sm transition hover:border-orange-200 hover:shadow-md"
            >
              <div className="flex h-24 items-center justify-center bg-gray-50 text-4xl">
                {item.emoji}
              </div>
              <div className="flex flex-1 flex-col gap-1 px-3 py-2.5">
                <p className="text-sm font-medium text-ink">{item.name}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-sm font-semibold text-orange-600">{fmt(item.price)}</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-50 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white">
                    <Plus size={14} />
                  </span>
                </div>
              </div>
            </button>
          ))}

          {filteredMenu.length === 0 && (
            <div className="col-span-full py-16 text-center text-sm text-gray-400">
              No items match your search.
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* RIGHT — Current order                                         */}
      {/* ------------------------------------------------------------ */}
      <div className="flex w-[380px] shrink-0 flex-col rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Order type */}
        <div className="grid grid-cols-3 gap-1.5 border-b border-gray-100 p-3">
          {ORDER_TYPES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setOrderType(value)}
              className={[
                'flex flex-col items-center gap-1 rounded-lg border py-2 text-xs transition-colors',
                orderType === value
                  ? 'border-ink bg-ink text-paper'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300',
              ].join(' ')}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Table / waiter / customer */}
        <div className="grid grid-cols-2 gap-2 border-b border-gray-100 p-3">
          {orderType === 'DINE_IN' && (
            <label className="col-span-2 flex flex-col gap-1">
              <span className="text-xs text-gray-400">Table</span>
              <select
                value={table}
                onChange={(e) => setTable(e.target.value)}
                className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm text-ink outline-none"
              >
                {TABLES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
          )}

          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-400">Waiter</span>
            <select
              value={waiter}
              onChange={(e) => setWaiter(e.target.value)}
              className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm text-ink outline-none"
            >
              {WAITERS.map((w) => (
                <option key={w}>{w}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-400">Customer</span>
            <select
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm text-ink outline-none"
            >
              {CUSTOMERS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-3">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-gray-400">
              <ShoppingBag size={28} className="text-gray-200" />
              <p className="text-sm">No items yet</p>
              <p className="text-xs">Tap a menu item to add it here.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {cart.map((line) => (
                <div key={line.item.id} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-lg">
                    {line.item.emoji}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{line.item.name}</p>
                    <p className="text-xs text-gray-400">{fmt(line.item.price)} each</p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQuantity(line.item.id, -1)}
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-gray-300"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-4 text-center text-sm text-ink">{line.quantity}</span>
                    <button
                      onClick={() => updateQuantity(line.item.id, 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-gray-300"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <span className="w-14 shrink-0 text-right text-sm font-medium text-ink">
                    {fmt(line.item.price * line.quantity)}
                  </span>

                  <button
                    onClick={() => removeFromCart(line.item.id)}
                    className="shrink-0 text-gray-300 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="border-t border-gray-100 p-3">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Order notes (allergies, special requests...)"
            rows={2}
            className="w-full resize-none rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm text-ink outline-none placeholder:text-gray-400"
          />
        </div>

        {/* Totals */}
        <div className="border-t border-gray-100 p-3">
          <div className="flex items-center justify-between py-1 text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="text-ink">{fmt(subtotal)}</span>
          </div>

          <div className="flex items-center justify-between py-1 text-sm">
            <span className="text-gray-500">Discount</span>
            <div className="flex items-center gap-1">
              <span className="text-gray-400">$</span>
              <input
                type="number"
                min={0}
                value={discount}
                onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-16 rounded-md border border-gray-200 px-1.5 py-0.5 text-right text-sm text-ink outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-1 text-sm">
            <span className="text-gray-500">Tax</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                value={taxRate}
                onChange={(e) => setTaxRate(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-12 rounded-md border border-gray-200 px-1.5 py-0.5 text-right text-sm text-ink outline-none"
              />
              <span className="text-gray-400">%</span>
              <span className="w-14 text-right text-ink">{fmt(taxAmount)}</span>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2">
            <span className="font-medium text-ink">Total</span>
            <span className="text-lg font-semibold text-ink">{fmt(total)}</span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-gray-400">Cash received</span>
              <input
                type="number"
                min={0}
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                placeholder="0.00"
                className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm text-ink outline-none placeholder:text-gray-400"
              />
            </label>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400">Change</span>
              <div className="flex h-[34px] items-center rounded-lg bg-gray-50 px-2.5 text-sm font-medium text-ink">
                {fmt(change)}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2 border-t border-gray-100 p-3">
          <button
            disabled={cart.length === 0}
            className="flex flex-col items-center gap-1 rounded-lg border border-gray-200 py-2 text-xs text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Pause size={16} />
            Hold
          </button>

          <button
            disabled={cart.length === 0}
            className="flex flex-col items-center gap-1 rounded-lg border border-gray-200 py-2 text-xs text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Printer size={16} />
            Print
          </button>

          <button
            disabled={cart.length === 0}
            className="flex flex-col items-center gap-1 rounded-lg bg-orange-500 py-2 text-xs font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CircleCheck size={16} />
            Complete
          </button>
        </div>
      </div>
    </div>
  );
}
