'use client';

import { useEffect, useMemo, useState } from 'react';
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
  StickyNote,
  Wallet,
  CreditCard,
  Smartphone,
  Trash2,
  ArchiveRestore,
  Check,
  Star,
  Soup,
  Beef,
  Flame,
  CupSoda,
  IceCreamCone,
  LayoutGrid,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Mock data — swap for real GraphQL queries (menuItems, tables, employees,
// customers) once those resolvers exist on the backend.
// ---------------------------------------------------------------------------

type OrderType = 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
type PaymentMethod = 'CASH' | 'CARD' | 'MOBILE';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  emoji: string;
  popular?: boolean;
}

const CATEGORIES = [
  { value: 'All', icon: LayoutGrid },
  { value: 'Starters', icon: Soup },
  { value: 'Mains', icon: Beef },
  { value: 'Grill', icon: Flame },
  { value: 'Drinks', icon: CupSoda },
  { value: 'Desserts', icon: IceCreamCone },
] as const;

const MENU_ITEMS: MenuItem[] = [
  { id: 'm1', name: 'Chicken Wings', price: 8.5, category: 'Starters', emoji: '🍗', popular: true },
  { id: 'm2', name: 'Spring Rolls', price: 6.0, category: 'Starters', emoji: '🥟' },
  { id: 'm3', name: 'Garlic Bread', price: 4.5, category: 'Starters', emoji: '🍞' },
  { id: 'm4', name: 'Beef Burger', price: 12.9, category: 'Mains', emoji: '🍔', popular: true },
  { id: 'm5', name: 'Margherita Pizza', price: 14.0, category: 'Mains', emoji: '🍕', popular: true },
  { id: 'm6', name: 'Grilled Salmon', price: 18.5, category: 'Mains', emoji: '🐟' },
  { id: 'm7', name: 'Chicken Tikka', price: 13.5, category: 'Grill', emoji: '🍢' },
  { id: 'm8', name: 'Beef Steak', price: 22.0, category: 'Grill', emoji: '🥩' },
  { id: 'm9', name: 'Lamb Kebab', price: 16.0, category: 'Grill', emoji: '🍖' },
  { id: 'm10', name: 'Lemonade', price: 3.5, category: 'Drinks', emoji: '🍋' },
  { id: 'm11', name: 'Iced Coffee', price: 4.0, category: 'Drinks', emoji: '🧋', popular: true },
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

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: typeof Wallet }[] = [
  { value: 'CASH', label: 'Cash', icon: Wallet },
  { value: 'CARD', label: 'Card', icon: CreditCard },
  { value: 'MOBILE', label: 'Mobile', icon: Smartphone },
];

const CASH_SHORTCUTS = [5, 10, 20, 50];
const QUICK_NOTES = ['No onion', 'Extra spicy', 'Less sugar', 'Well done', 'No ice'];

interface CartLine {
  item: MenuItem;
  quantity: number;
  note: string;
}

interface HeldOrder {
  id: string;
  label: string;
  heldAt: string;
  orderType: OrderType;
  table: string;
  waiter: string;
  customer: string;
  notes: string;
  discount: number;
  taxRate: number;
  serviceCharge: number;
  cart: CartLine[];
}

interface Toast {
  id: number;
  message: string;
}

// ---------------------------------------------------------------------------

export default function POSPage() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]['value']>('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartLine[]>([]);
  const [openNoteFor, setOpenNoteFor] = useState<string | null>(null);

  const [orderType, setOrderType] = useState<OrderType>('DINE_IN');
  const [table, setTable] = useState(TABLES[0]);
  const [waiter, setWaiter] = useState(WAITERS[0]);
  const [customer, setCustomer] = useState(CUSTOMERS[0]);
  const [notes, setNotes] = useState('');
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(5);
  const [serviceCharge, setServiceCharge] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [cashReceived, setCashReceived] = useState<string>('');

  const [orderNumber, setOrderNumber] = useState(1042);
  const [heldOrders, setHeldOrders] = useState<HeldOrder[]>([]);
  const [showHeld, setShowHeld] = useState(false);
  const [showReceipt, setShowReceipt] = useState<'preview' | 'confirm' | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  const [toasts, setToasts] = useState<Toast[]>([]);

  function pushToast(message: string) {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2600);
  }

  const filteredMenu = useMemo(() => {
    return MENU_ITEMS.filter((m) => {
      const matchesCategory = category === 'All' || m.category === category;
      const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const popularItems = useMemo(
    () => (category === 'All' && !search ? MENU_ITEMS.filter((m) => m.popular) : []),
    [category, search],
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, line) => sum + line.item.price * line.quantity, 0),
    [cart],
  );
  const taxAmount = subtotal * (taxRate / 100);
  const serviceAmount = subtotal * (serviceCharge / 100);
  const total = Math.max(subtotal - discount + taxAmount + serviceAmount, 0);
  const cashValue = parseFloat(cashReceived) || 0;
  const change = Math.max(cashValue - total, 0);
  const itemCount = cart.reduce((n, l) => n + l.quantity, 0);

  function fmt(n: number) {
    return `$${n.toFixed(2)}`;
  }

  function addToCart(item: MenuItem) {
    setCart((prev) => {
      const existing = prev.find((l) => l.item.id === item.id);
      if (existing) {
        return prev.map((l) => (l.item.id === item.id ? { ...l, quantity: l.quantity + 1 } : l));
      }
      return [...prev, { item, quantity: 1, note: '' }];
    });
  }

  function updateQuantity(itemId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((l) => (l.item.id === itemId ? { ...l, quantity: l.quantity + delta } : l))
        .filter((l) => l.quantity > 0),
    );
  }

  function setQuantityDirect(itemId: string, value: number) {
    const qty = Math.max(0, Math.floor(value) || 0);
    setCart((prev) =>
      qty === 0
        ? prev.filter((l) => l.item.id !== itemId)
        : prev.map((l) => (l.item.id === itemId ? { ...l, quantity: qty } : l)),
    );
  }

  function removeFromCart(itemId: string) {
    setCart((prev) => prev.filter((l) => l.item.id !== itemId));
    if (openNoteFor === itemId) setOpenNoteFor(null);
  }

  function setLineNote(itemId: string, note: string) {
    setCart((prev) => prev.map((l) => (l.item.id === itemId ? { ...l, note } : l)));
  }

  function toggleQuickNote(itemId: string, current: string, phrase: string) {
    const parts = current.split(', ').map((p) => p.trim()).filter(Boolean);
    const has = parts.includes(phrase);
    const next = has ? parts.filter((p) => p !== phrase) : [...parts, phrase];
    setLineNote(itemId, next.join(', '));
  }

  function resetOrderMeta() {
    setCart([]);
    setOrderType('DINE_IN');
    setTable(TABLES[0]);
    setWaiter(WAITERS[0]);
    setCustomer(CUSTOMERS[0]);
    setNotes('');
    setDiscount(0);
    setTaxRate(5);
    setServiceCharge(0);
    setPaymentMethod('CASH');
    setCashReceived('');
  }

  function handleClearOrder() {
    resetOrderMeta();
    setShowClearConfirm(false);
    pushToast('Order cleared');
  }

  function handleHold() {
    if (cart.length === 0) return;
    const held: HeldOrder = {
      id: `H-${Date.now()}`,
      label: `#${orderNumber}`,
      heldAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      orderType,
      table,
      waiter,
      customer,
      notes,
      discount,
      taxRate,
      serviceCharge,
      cart,
    };
    setHeldOrders((prev) => [held, ...prev]);
    resetOrderMeta();
    setOrderNumber((n) => n + 1);
    setMobileCartOpen(false);
    pushToast(`Order ${held.label} held`);
  }

  function resumeHeldOrder(id: string) {
    const held = heldOrders.find((h) => h.id === id);
    if (!held) return;
    setCart(held.cart);
    setOrderType(held.orderType);
    setTable(held.table);
    setWaiter(held.waiter);
    setCustomer(held.customer);
    setNotes(held.notes);
    setDiscount(held.discount);
    setTaxRate(held.taxRate);
    setServiceCharge(held.serviceCharge);
    setHeldOrders((prev) => prev.filter((h) => h.id !== id));
    setShowHeld(false);
    pushToast(`Resumed ${held.label}`);
  }

  function discardHeldOrder(id: string) {
    setHeldOrders((prev) => prev.filter((h) => h.id !== id));
  }

  function handleCompleteOrder() {
    setShowReceipt(null);
    setMobileCartOpen(false);
    pushToast(`Order #${orderNumber} completed`);
    setOrderNumber((n) => n + 1);
    resetOrderMeta();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setShowHeld(false);
        setShowReceipt(null);
        setShowClearConfirm(false);
        setMobileCartOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const canPay = paymentMethod !== 'CASH' || cashValue >= total;

  // -------------------------------------------------------------------------
  // Shared cart panel JSX (rendered once for desktop sidebar, once for the
  // mobile bottom-sheet drawer — same state, same handlers, just a different
  // container around it).
  // -------------------------------------------------------------------------
  function renderCartPanel() {
    return (
      <>
        <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2.5">
          <div>
            <p className="text-sm font-semibold text-ink">Order #{orderNumber}</p>
            <p className="text-xs text-gray-400">
              {itemCount} item{itemCount === 1 ? '' : 's'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => cart.length > 0 && setShowClearConfirm(true)}
              disabled={cart.length === 0}
              className="flex items-center gap-1 text-xs text-gray-400 transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 size={13} />
              Clear
            </button>
            <button
              onClick={() => setMobileCartOpen(false)}
              className="text-gray-400 hover:text-gray-600 lg:hidden"
            >
              <X size={18} />
            </button>
          </div>
        </div>

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
                <div key={line.item.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 sm:gap-3">
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
                      <input
                        type="number"
                        value={line.quantity}
                        onChange={(e) => setQuantityDirect(line.item.id, parseInt(e.target.value, 10))}
                        className="w-8 rounded-md border border-transparent text-center text-sm text-ink outline-none focus:border-gray-200"
                      />
                      <button
                        onClick={() => updateQuantity(line.item.id, 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-gray-300"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <span className="w-12 shrink-0 text-right text-sm font-medium text-ink sm:w-14">
                      {fmt(line.item.price * line.quantity)}
                    </span>

                    <button
                      onClick={() => setOpenNoteFor(openNoteFor === line.item.id ? null : line.item.id)}
                      className={[
                        'shrink-0 transition',
                        line.note ? 'text-orange-500' : 'text-gray-300 hover:text-gray-500',
                      ].join(' ')}
                      title="Item note"
                    >
                      <StickyNote size={14} />
                    </button>

                    <button
                      onClick={() => removeFromCart(line.item.id)}
                      className="shrink-0 text-gray-300 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {(openNoteFor === line.item.id || line.note) && (
                    <div className="ml-11 flex flex-col gap-1.5">
                      <input
                        value={line.note}
                        onChange={(e) => setLineNote(line.item.id, e.target.value)}
                        placeholder="Add a note..."
                        autoFocus={openNoteFor === line.item.id}
                        className="rounded-md border border-gray-200 px-2 py-1 text-xs text-ink outline-none placeholder:text-gray-400"
                      />
                      {openNoteFor === line.item.id && (
                        <div className="flex flex-wrap gap-1">
                          {QUICK_NOTES.map((q) => {
                            const active = line.note.split(', ').map((p) => p.trim()).includes(q);
                            return (
                              <button
                                key={q}
                                onClick={() => toggleQuickNote(line.item.id, line.note, q)}
                                className={[
                                  'rounded-full border px-2 py-0.5 text-[11px] transition-colors',
                                  active
                                    ? 'border-orange-400 bg-orange-50 text-orange-600'
                                    : 'border-gray-200 text-gray-500 hover:border-gray-300',
                                ].join(' ')}
                              >
                                {q}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 p-3">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Order notes (allergies, special requests...)"
            rows={2}
            className="w-full resize-none rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm text-ink outline-none placeholder:text-gray-400"
          />
        </div>

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
            <span className="text-gray-500">Service</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                value={serviceCharge}
                onChange={(e) => setServiceCharge(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-12 rounded-md border border-gray-200 px-1.5 py-0.5 text-right text-sm text-ink outline-none"
              />
              <span className="text-gray-400">%</span>
              <span className="w-14 text-right text-ink">{fmt(serviceAmount)}</span>
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

          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {PAYMENT_METHODS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setPaymentMethod(value)}
                className={[
                  'flex flex-col items-center gap-1 rounded-lg border py-1.5 text-xs transition-colors',
                  paymentMethod === value
                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300',
                ].join(' ')}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {paymentMethod === 'CASH' && (
            <div className="mt-3">
              <div className="grid grid-cols-2 gap-2">
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

              <div className="mt-2 flex flex-wrap gap-1.5">
                <button
                  onClick={() => setCashReceived(total.toFixed(2))}
                  className="rounded-full border border-gray-200 px-2.5 py-1 text-xs text-gray-500 hover:border-gray-300"
                >
                  Exact
                </button>
                {CASH_SHORTCUTS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setCashReceived(amt.toFixed(2))}
                    className="rounded-full border border-gray-200 px-2.5 py-1 text-xs text-gray-500 hover:border-gray-300"
                  >
                    {fmt(amt)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-gray-100 p-3">
          <button
            onClick={handleHold}
            disabled={cart.length === 0}
            className="flex flex-col items-center gap-1 rounded-lg border border-gray-200 py-2 text-xs text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Pause size={16} />
            Hold
          </button>

          <button
            onClick={() => cart.length > 0 && setShowReceipt('preview')}
            disabled={cart.length === 0}
            className="flex flex-col items-center gap-1 rounded-lg border border-gray-200 py-2 text-xs text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Printer size={16} />
            Print
          </button>

          <button
            onClick={() => cart.length > 0 && setShowReceipt('confirm')}
            disabled={cart.length === 0}
            className="flex flex-col items-center gap-1 rounded-lg bg-orange-500 py-2 text-xs font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CircleCheck size={16} />
            Complete
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="relative flex h-full flex-col gap-3 p-3 lg:flex-row lg:gap-4 lg:p-4">
      {/* ------------------------------------------------------------ */}
      {/* Menu                                                          */}
      {/* ------------------------------------------------------------ */}
      <div className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">
        <div className="mb-3 flex items-center justify-between gap-2 sm:mb-4 sm:gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
            <Search size={16} className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search menu..."
              className="w-full text-sm outline-none"
            />
          </div>

          <button
            onClick={() => setShowHeld(true)}
            className="relative flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-sm text-gray-600 transition hover:border-gray-300 sm:px-3"
          >
            <ArchiveRestore size={16} />
            <span className="hidden sm:inline">Held orders</span>
            {heldOrders.length > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[11px] font-medium text-white">
                {heldOrders.length}
              </span>
            )}
          </button>
        </div>

        <div className="mb-3 flex gap-2 overflow-x-auto pb-1 sm:mb-4 sm:flex-wrap sm:overflow-visible">
          {CATEGORIES.map(({ value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setCategory(value)}
              className={[
                'flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                category === value
                  ? 'border-ink bg-ink text-paper'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300',
              ].join(' ')}
            >
              <Icon size={14} />
              {value}
            </button>
          ))}
        </div>

        {popularItems.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gray-400">
              <Star size={12} className="fill-orange-400 text-orange-400" />
              Popular
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {popularItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="flex shrink-0 items-center gap-2 rounded-full border border-orange-200 bg-orange-50 py-1.5 pl-1.5 pr-3 text-sm text-orange-700 transition hover:bg-orange-100"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-base">
                    {item.emoji}
                  </span>
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid flex-1 grid-cols-2 gap-2.5 overflow-y-auto pb-2 sm:grid-cols-3 sm:gap-3 xl:grid-cols-4 2xl:grid-cols-5">
          {filteredMenu.map((item) => {
            const inCart = cart.find((l) => l.item.id === item.id);
            return (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white text-left shadow-sm transition hover:border-orange-200 hover:shadow-md active:scale-[0.98]"
              >
                {inCart && (
                  <span className="absolute right-2 top-2 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[11px] font-medium text-white">
                    {inCart.quantity}
                  </span>
                )}
                <div className="flex h-20 items-center justify-center bg-gray-50 text-3xl sm:h-24 sm:text-4xl">
                  {item.emoji}
                </div>
                <div className="flex flex-1 flex-col gap-1 px-2.5 py-2 sm:px-3 sm:py-2.5">
                  <p className="truncate text-sm font-medium text-ink">{item.name}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm font-semibold text-orange-600">{fmt(item.price)}</span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-50 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white">
                      <Plus size={14} />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}

          {filteredMenu.length === 0 && (
            <div className="col-span-full py-16 text-center text-sm text-gray-400">
              No items match your search.
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Desktop cart sidebar                                          */}
      {/* ------------------------------------------------------------ */}
      <div className="hidden w-[400px] shrink-0 flex-col rounded-xl border border-gray-100 bg-white shadow-sm lg:flex">
        {renderCartPanel()}
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Mobile floating cart bar                                      */}
      {/* ------------------------------------------------------------ */}
      {cart.length > 0 && !mobileCartOpen && (
        <button
          onClick={() => setMobileCartOpen(true)}
          className="fixed inset-x-3 bottom-3 z-20 flex items-center justify-between rounded-xl bg-orange-500 px-4 py-3 text-white shadow-lg lg:hidden"
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs">
              {itemCount}
            </span>
            View order
          </span>
          <span className="text-sm font-semibold">{fmt(total)}</span>
        </button>
      )}

      {/* ------------------------------------------------------------ */}
      {/* Mobile cart drawer (bottom sheet)                             */}
      {/* ------------------------------------------------------------ */}
      {mobileCartOpen && (
        <div className="fixed inset-0 z-30 flex flex-col justify-end bg-black/30 lg:hidden">
          <div className="flex max-h-[88vh] flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl">
            {renderCartPanel()}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------ */}
      {/* Held orders panel                                             */}
      {/* ------------------------------------------------------------ */}
      {showHeld && (
        <div className="fixed inset-0 z-30 flex items-start justify-center bg-black/20 p-3 sm:justify-end sm:p-4">
          <div className="flex max-h-full w-full max-w-[400px] flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <p className="text-sm font-semibold text-ink">Held orders</p>
              <button onClick={() => setShowHeld(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {heldOrders.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-400">No held orders.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {heldOrders.map((h) => {
                    const heldTotal = h.cart.reduce((s, l) => s + l.item.price * l.quantity, 0);
                    return (
                      <div
                        key={h.id}
                        className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 px-3 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-ink">
                            {h.label} ·{' '}
                            {h.orderType === 'DINE_IN'
                              ? h.table
                              : h.orderType === 'TAKEAWAY'
                              ? 'Takeaway'
                              : 'Delivery'}
                          </p>
                          <p className="text-xs text-gray-400">
                            {h.cart.length} item{h.cart.length === 1 ? '' : 's'} · {fmt(heldTotal)} · held{' '}
                            {h.heldAt}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            onClick={() => resumeHeldOrder(h.id)}
                            className="rounded-lg bg-ink px-2.5 py-1.5 text-xs font-medium text-paper hover:bg-ink/90"
                          >
                            Resume
                          </button>
                          <button
                            onClick={() => discardHeldOrder(h.id)}
                            className="rounded-lg p-1.5 text-gray-300 hover:text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------ */}
      {/* Receipt preview / complete confirmation                       */}
      {/* ------------------------------------------------------------ */}
      {showReceipt && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 p-3 sm:p-4">
          <div className="flex max-h-full w-full max-w-[380px] flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <p className="text-sm font-semibold text-ink">
                {showReceipt === 'confirm' ? 'Confirm order' : 'Receipt preview'}
              </p>
              <button onClick={() => setShowReceipt(null)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-3 text-center">
                <p className="text-sm font-semibold text-ink">Order #{orderNumber}</p>
                <p className="text-xs text-gray-400">
                  {orderType === 'DINE_IN' ? table : orderType === 'TAKEAWAY' ? 'Takeaway' : 'Delivery'} ·{' '}
                  {waiter}
                </p>
              </div>

              <div className="flex flex-col gap-1.5 border-y border-dashed border-gray-200 py-3">
                {cart.map((line) => (
                  <div key={line.item.id} className="flex items-start justify-between text-sm">
                    <span className="text-ink">
                      {line.quantity}× {line.item.name}
                      {line.note && <span className="block text-xs text-gray-400">{line.note}</span>}
                    </span>
                    <span className="shrink-0 text-ink">{fmt(line.item.price * line.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex flex-col gap-1 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span>Discount</span>
                    <span>-{fmt(discount)}</span>
                  </div>
                )}
                {serviceCharge > 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span>Service ({serviceCharge}%)</span>
                    <span>{fmt(serviceAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>Tax ({taxRate}%)</span>
                  <span>{fmt(taxAmount)}</span>
                </div>
                <div className="mt-1 flex justify-between border-t border-gray-100 pt-1 font-semibold text-ink">
                  <span>Total</span>
                  <span>{fmt(total)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Payment</span>
                  <span>{PAYMENT_METHODS.find((p) => p.value === paymentMethod)?.label}</span>
                </div>
                {paymentMethod === 'CASH' && (
                  <>
                    <div className="flex justify-between text-gray-500">
                      <span>Cash received</span>
                      <span>{fmt(cashValue)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Change</span>
                      <span>{fmt(change)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 p-3">
              {showReceipt === 'confirm' ? (
                <>
                  {paymentMethod === 'CASH' && !canPay && (
                    <p className="mb-2 text-center text-xs text-red-500">
                      Cash received is less than the total.
                    </p>
                  )}
                  <button
                    onClick={handleCompleteOrder}
                    disabled={!canPay}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-orange-500 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Check size={16} />
                    Confirm and complete
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    pushToast('Sent to printer');
                    setShowReceipt(null);
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-ink py-2.5 text-sm font-medium text-paper transition hover:bg-ink/90"
                >
                  <Printer size={16} />
                  Print receipt
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------ */}
      {/* Clear order confirm                                           */}
      {/* ------------------------------------------------------------ */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 p-3">
          <div className="w-full max-w-[320px] rounded-xl border border-gray-100 bg-white p-5 shadow-xl">
            <p className="text-sm font-semibold text-ink">Clear this order?</p>
            <p className="mt-1 text-sm text-gray-500">
              All items and details for order #{orderNumber} will be removed. This can't be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleClearOrder}
                className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600"
              >
                Clear order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------ */}
      {/* Toasts                                                        */}
      {/* ------------------------------------------------------------ */}
      <div className="pointer-events-none fixed bottom-20 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-2 lg:bottom-4 lg:right-4 lg:left-auto lg:translate-x-0">
        {toasts.map((t) => (
          <div key={t.id} className="rounded-lg bg-ink px-4 py-2.5 text-sm text-paper shadow-lg">
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
