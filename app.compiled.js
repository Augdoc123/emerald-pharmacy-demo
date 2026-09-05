"use strict";

const e = React.createElement;
const { useState, useEffect, useMemo, useRef } = React;

const INITIAL_INVENTORY = [
    { id: 1, name: "Tab Augmentin 625mg (GSK)", code: "AUG-625", category: "DRUGS", price: 8500, cost: 7000, stock: 45, exp: "2027-11-20", batch: "B-AUG41", status: "In Stock" },
    { id: 2, name: "Coartem 80/480 Tablets", code: "COA-80", category: "DRUGS", price: 3200, cost: 2400, stock: 80, exp: "2028-04-15", batch: "B-COA99", status: "In Stock" },
    { id: 3, name: "Paracetamol Syrup 100ml (Emzor)", code: "PCM-SYR", category: "DRUGS", price: 650, cost: 450, stock: 120, exp: "2027-09-30", batch: "B-EMZ12", status: "In Stock" },
    { id: 4, name: "IV Ceftriaxone 1g Vial", code: "CEF-1G", category: "DRUGS", price: 2100, cost: 1600, stock: 32, exp: "2027-01-10", batch: "B-CEF03", status: "In Stock" },
    { id: 5, name: "Ringers Lactate 500ml Infusion", code: "RL-500", category: "DRUGS", price: 1400, cost: 950, stock: 18, exp: "2028-07-22", batch: "B-RL88", status: "Low Stock" },
    { id: 6, name: "Crepe Bandage 10cm x 4.5m", code: "CR-BDG", category: "PROVISIONS", price: 950, cost: 600, stock: 65, exp: "2029-12-01", batch: "B-CRP01", status: "In Stock" },
    { id: 7, name: "Aboniki Balm 25g", code: "ABN-25", category: "PROVISIONS", price: 1100, cost: 800, stock: 95, exp: "2029-07-14", batch: "B-ABN05", status: "In Stock" },
    { id: 8, name: "Acirab (Rabeprazole) 20mg", code: "ACI-20", category: "DRUGS", price: 1100, cost: 750, stock: 40, exp: "2027-10-18", batch: "B-ACI12", status: "In Stock" },
    { id: 9, name: "Amatem Softgel", code: "AMT-SF", category: "DRUGS", price: 3700, cost: 2800, stock: 26, exp: "2028-04-20", batch: "B-AMT77", status: "In Stock" },
    { id: 10, name: "Insulin Mixtard 100IU/ml Penfill", code: "INS-MIX", category: "DRUGS", price: 12500, cost: 9800, stock: 4, exp: "2026-10-05", batch: "B-INS02", status: "Critical Low" }
];

const INITIAL_CARDS = [
    { id: 1, uid: "CRD-8821", name: "Dr. Godwin Udele", phone: "0803-123-4567", tier: "Gold", balance: 45000, debt: 0, status: "Active", limit: 200000 },
    { id: 2, uid: "CRD-3109", name: "Hajia Fatima Aliyu", phone: "0802-987-6543", tier: "Silver", balance: 5200, debt: 12800, status: "Active", limit: 50000 },
    { id: 3, uid: "CRD-7704", name: "Chief Mike Adeleke", phone: "0814-555-9012", tier: "Platinum", balance: 85000, debt: 0, status: "Active", limit: 500000 },
    { id: 4, uid: "CRD-4412", name: "Nurse Grace Danladi", phone: "0706-333-8899", tier: "Standard", balance: 1400, debt: 6500, status: "Active", limit: 30000 }
];

const INITIAL_EXPENSES = [
    { id: 1, title: "Generator Diesel (50 Litres)", category: "Utilities", amount: 65000, approvedBy: "Dr. Godwin", date: "Today 10:30 AM" },
    { id: 2, title: "80mm Thermal Receipt Paper (10 Rolls)", category: "Supplies", amount: 12000, approvedBy: "Superintendent Pharm", date: "Today 09:15 AM" },
    { id: 3, title: "Dispensary Sanitization & Cleaning", category: "Maintenance", amount: 4500, approvedBy: "Lead Cashier", date: "Yesterday" },
    { id: 4, title: "High-Speed Internet LAN Router", category: "Utilities", amount: 25000, approvedBy: "Dr. Godwin", date: "3 Days ago" }
];

const INITIAL_HELD_CARTS = [
    { id: 1, ref: "HOLD-101", customer: "Dr. Godwin Clinic Ward 2", cashier: "Pharmacist Grace", itemsCount: 3, total: 13800, time: "10:15 AM", items: [
        { id: 1, name: "Tab Augmentin 625mg (GSK)", price: 8500, qty: 1 },
        { id: 2, name: "Coartem 80/480 Tablets", price: 3200, qty: 1 },
        { id: 4, name: "IV Ceftriaxone 1g Vial", price: 2100, qty: 1 }
    ]},
    { id: 2, ref: "HOLD-102", customer: "Walk-in Patient (Prescription Check)", cashier: "Blessing Okon", itemsCount: 2, total: 4350, time: "11:40 AM", items: [
        { id: 3, name: "Paracetamol Syrup 100ml (Emzor)", price: 650, qty: 1 },
        { id: 9, name: "Amatem Softgel", price: 3700, qty: 1 }
    ]}
];

const INITIAL_SALES = [
    { ref: "EM-782103", items: [{ name: "Tab Augmentin 625mg (GSK)", qty: 2, price: 8500 }], total: 17000, method: "Cash", date: "11:30 AM", cashier: "Blessing Okon", status: "Completed" },
    { ref: "EM-782104", items: [{ name: "Coartem 80/480 Tablets", qty: 3, price: 3200 }, { name: "Paracetamol Syrup 100ml", qty: 2, price: 650 }], total: 10900, method: "Moniepoint POS", rrn: "MP-98421044", date: "11:45 AM", cashier: "Blessing Okon", status: "Completed" },
    { ref: "EM-782105", items: [{ name: "Ringers Lactate 500ml Infusion", qty: 4, price: 1400 }], total: 5600, method: "Bank Transfer", rrn: "TRF-771203", date: "12:10 PM", cashier: "Pharmacist Grace", status: "Completed" }
];

function PharmacyPOSApp() {
    // Navigation State
    const [activePage, setActivePage] = useState("pos");
    const [activeDropdown, setActiveDropdown] = useState(null);

    // Business Data State (persisted to localStorage)
    const [inventory, setInventory] = useState(() => {
        const saved = localStorage.getItem("em_demo_inventory");
        return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    });
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState("");
    const [sector, setSector] = useState("ALL");
    const [isCashier, setIsCashier] = useState(false);

    const [dailySales, setDailySales] = useState(() => {
        const saved = localStorage.getItem("em_demo_sales");
        return saved ? JSON.parse(saved) : INITIAL_SALES;
    });
    const [cards, setCards] = useState(() => {
        const saved = localStorage.getItem("em_demo_cards");
        return saved ? JSON.parse(saved) : INITIAL_CARDS;
    });
    const [expenses, setExpenses] = useState(() => {
        const saved = localStorage.getItem("em_demo_expenses");
        return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    });
    const [heldCarts, setHeldCarts] = useState(() => {
        const saved = localStorage.getItem("em_demo_held_carts");
        return saved ? JSON.parse(saved) : INITIAL_HELD_CARTS;
    });

    // Modals
    const [paymentModal, setPaymentModal] = useState(false);
    const [receiptModal, setReceiptModal] = useState(false);
    const [zReportModal, setZReportModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [moniepointRrn, setMoniepointRrn] = useState("");
    const [completedSale, setCompletedSale] = useState(null);

    // Sync to local storage
    useEffect(() => { localStorage.setItem("em_demo_inventory", JSON.stringify(inventory)); }, [inventory]);
    useEffect(() => { localStorage.setItem("em_demo_sales", JSON.stringify(dailySales)); }, [dailySales]);
    useEffect(() => { localStorage.setItem("em_demo_cards", JSON.stringify(cards)); }, [cards]);
    useEffect(() => { localStorage.setItem("em_demo_expenses", JSON.stringify(expenses)); }, [expenses]);
    useEffect(() => { localStorage.setItem("em_demo_held_carts", JSON.stringify(heldCarts)); }, [heldCarts]);

    // Close dropdowns on outside click or mobile touch
    useEffect(() => {
        const handleOutsideClick = (evt) => {
            if (!evt.target.closest(".nav-dropdown-wrapper")) {
                setActiveDropdown(null);
            }
        };
        window.addEventListener("click", handleOutsideClick);
        window.addEventListener("touchstart", handleOutsideClick, { passive: true });
        return () => {
            window.removeEventListener("click", handleOutsideClick);
            window.removeEventListener("touchstart", handleOutsideClick);
        };
    }, []);

    // Cart calculations
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const addToCart = (product) => {
        if (product.stock <= 0) return alert("Product out of stock!");
        setCart(prev => {
            const exists = prev.find(i => i.id === product.id);
            if (exists) {
                if (exists.qty >= product.stock) { alert("Batch stock limit reached!"); return prev; }
                return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const updateQty = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = item.qty + delta;
                return newQty > 0 ? { ...item, qty: newQty } : null;
            }
            return item;
        }).filter(Boolean));
    };

    const holdCart = () => {
        if (cart.length === 0) return;
        const ref = "HOLD-" + Math.floor(100 + Math.random() * 900);
        const newHold = {
            id: Date.now(),
            ref: ref,
            customer: "Patient (" + ref + ")",
            cashier: "Dr. Godwin",
            itemsCount: cart.length,
            total: subtotal,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            items: [...cart]
        };
        setHeldCarts(prev => [newHold, ...prev]);
        setCart([]);
        alert("Cart successfully placed on hold: " + ref);
    };

    const recallCart = (held) => {
        setCart([...held.items]);
        setHeldCarts(prev => prev.filter(h => h.id !== held.id));
        setActivePage("pos");
    };

    const finalizeCheckout = () => {
        if (cart.length === 0) return;
        const saleRef = "EM-" + Math.floor(100000 + Math.random() * 900000);
        const record = {
            ref: saleRef,
            items: [...cart],
            total: subtotal,
            method: paymentMethod,
            rrn: paymentMethod === "Moniepoint POS" ? (moniepointRrn || "MP-REF-" + Math.floor(10000000 + Math.random()*90000000)) : null,
            date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            cashier: "Dr. Godwin Udele",
            status: "Completed"
        };

        // FEFO Stock deduction
        setInventory(prev => prev.map(inv => {
            const cItem = cart.find(c => c.id === inv.id);
            return cItem ? { ...inv, stock: Math.max(0, inv.stock - cItem.qty) } : inv;
        }));

        setCompletedSale(record);
        setDailySales(prev => [record, ...prev]);
        setCart([]);
        setPaymentModal(false);
        setReceiptModal(true);
        setMoniepointRrn("");
    };

    const resetDemo = () => {
        if (!confirm("Reset demo database back to default factory state?")) return;
        localStorage.removeItem("em_demo_inventory");
        localStorage.removeItem("em_demo_sales");
        localStorage.removeItem("em_demo_cards");
        localStorage.removeItem("em_demo_expenses");
        localStorage.removeItem("em_demo_held_carts");
        setInventory(INITIAL_INVENTORY);
        setDailySales(INITIAL_SALES);
        setCards(INITIAL_CARDS);
        setExpenses(INITIAL_EXPENSES);
        setHeldCarts(INITIAL_HELD_CARTS);
        setCart([]);
        setActivePage("pos");
        setZReportModal(false);
        alert("Demo state restored to factory seed!");
    };

    // Filter products
    const filteredProducts = inventory.filter(i => {
        const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.code.toLowerCase().includes(search.toLowerCase());
        const matchesSector = sector === "ALL" || i.category === sector;
        return matchesSearch && matchesSector;
    });

    // Helper for active page styling in nav
    const isNavActive = (pageKeys) => pageKeys.includes(activePage);

    return e("div", { className: "min-h-screen flex flex-col bg-[#F4F7FB]" },
        
        // ─────────────────────────────────────────────────────────────
        // LAYER 1: TELEMETRY TOP BAR (#072946 Royal Sovereign Navy)
        // ─────────────────────────────────────────────────────────────
        e("div", { className: "bg-[#072946] text-white px-6 py-2 border-b border-[#00D2FF]/30 relative z-50 flex flex-wrap items-center justify-between gap-4 shadow-sm" },
            // Left Branding
            e("div", { className: "flex items-center gap-3 cursor-pointer", onClick: () => setActivePage("dashboard") },
                e("div", { className: "w-9 h-9 rounded-lg bg-gradient-to-br from-[#00D2FF] to-[#0284C7] text-[#072946] font-black flex items-center justify-center text-sm shadow-md" }, "EM"),
                e("div", null,
                    e("div", { className: "text-sm font-extrabold tracking-wider uppercase leading-none flex items-center gap-2" },
                        "EII PHARMACY & STORES LTD",
                        e("span", { className: "px-2 py-0.5 rounded text-[9px] font-extrabold bg-[#00D2FF]/20 text-[#00D2FF] border border-[#00D2FF]/40" }, "LAN POS")
                    ),
                    e("div", { className: "text-[11px] text-slate-300 font-mono mt-0.5" }, "Powered by Emerald POS • Offline-First Edge Node")
                )
            ),

            // Controls Cluster (Sector, Store Mode, User Profile, Z-Report, Reset)
            // (EXEMPT GHOST CONSOLE AS REQUESTED)
            e("div", { className: "flex items-center gap-3 flex-wrap text-xs" },
                // Sector Filter
                e("div", { className: "flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-md border border-white/20" },
                    e("span", { className: "text-slate-300 text-[11px]" }, "Sector:"),
                    e("select", {
                        value: sector,
                        onChange: (e) => setSector(e.target.value),
                        className: "bg-white text-slate-800 font-bold text-xs py-0.5 px-1.5 rounded border-none cursor-pointer focus:outline-none"
                    },
                        e("option", { value: "ALL" }, "All Products"),
                        e("option", { value: "DRUGS" }, "Drugs"),
                        e("option", { value: "PROVISIONS" }, "Provisions")
                    )
                ),

                // Store Mode Cashier Switch
                e("div", { className: "flex items-center gap-2 bg-white/10 px-2.5 py-1 rounded-full border border-white/20" },
                    e("span", { className: "text-slate-300 text-[11px]" }, "Cashier Mode:"),
                    e("button", {
                        type: "button",
                        onClick: () => setIsCashier(!isCashier),
                        className: `w-9 h-4 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${isCashier ? "bg-emerald-500 justify-end" : "bg-white/30 justify-start"}`
                    },
                        e("div", { className: "bg-white w-3 h-3 rounded-full shadow-sm" })
                    ),
                    e("span", { className: "text-[10px] font-bold" }, isCashier ? "ON" : "OFF")
                ),

                // Notification Bell
                e("div", { className: "relative p-1 bg-white/10 rounded-full cursor-pointer hover:bg-white/20 transition-colors" },
                    e("span", { className: "text-sm" }, "🔔"),
                    e("span", { className: "absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center" }, "3")
                ),

                // User Badge
                e("div", { className: "flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-md border border-white/20" },
                    e("div", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse" }),
                    e("span", { className: "font-bold text-white text-[11px]" }, "DR. GODWIN UDELE"),
                    e("span", { className: "px-1.5 py-0.2 bg-[#F43F5E] text-white rounded text-[9px] font-extrabold tracking-wide" }, "SUPER ADMIN")
                ),

                // Z-Report Trigger
                e("button", {
                    onClick: () => setZReportModal(true),
                    className: "px-2.5 py-1 bg-[#0A3A63] hover:bg-[#00D2FF] hover:text-[#072946] border border-cyan-400/40 rounded text-[11px] font-bold transition-all cursor-pointer"
                }, "📊 Z-Report"),

                // Reset Factory Seed
                e("button", {
                    onClick: resetDemo,
                    title: "Restore demo inventory and sales seed",
                    className: "px-2.5 py-1 bg-rose-600/80 hover:bg-rose-600 text-white rounded text-[11px] font-bold transition-colors cursor-pointer"
                }, "🔄 Reset Demo")
            )
        ),

        // ─────────────────────────────────────────────────────────────
        // LAYER 2: SUB-NAV RUNWAY (All Clickable Menus & Dropdowns)
        // ─────────────────────────────────────────────────────────────
        e("nav", { 
            className: "bg-white border-b border-slate-200 shadow-sm relative px-6 flex items-center justify-between min-h-[48px]",
            style: { zIndex: 1000, overflow: "visible" }
        },
            // Left: Top Navigation Tabs
            e("div", { className: "flex items-center gap-1 text-[13px] font-semibold text-slate-700 overflow-x-auto scrollbar-none py-1 flex-1 min-w-0", style: { overflowY: "visible" } },
                
                // 1. DASHBOARD
                e("button", {
                    type: "button",
                    onClick: () => { setActivePage("dashboard"); setActiveDropdown(null); },
                    className: `px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        activePage === "dashboard" 
                            ? "bg-[#072946] text-white shadow-sm font-bold" 
                            : "hover:bg-slate-100 text-slate-700"
                    }`
                }, "📈 Dashboard"),

                // 2. POS
                e("button", {
                    type: "button",
                    onClick: () => { setActivePage("pos"); setActiveDropdown(null); },
                    className: `px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        activePage === "pos" 
                            ? "bg-[#072946] text-white shadow-sm font-bold" 
                            : "hover:bg-slate-100 text-slate-700"
                    }`
                }, "⚡ POS"),

                // 3. INVENTORY DROPDOWN
                e("div", { className: "relative nav-dropdown-wrapper", style: { overflow: "visible" } },
                    e("button", {
                        type: "button",
                        onClick: (evt) => { evt.stopPropagation(); setActiveDropdown(activeDropdown === "inventory" ? null : "inventory"); },
                        className: `px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                            isNavActive(["inventory_products", "inventory_remove"]) 
                                ? "bg-[#072946] text-white shadow-sm font-bold" 
                                : "hover:bg-slate-100 text-slate-700"
                        }`
                    },
                        e("span", null, "📦 Inventory"),
                        e("svg", { className: `w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "inventory" ? "rotate-180" : ""}`, fill: "none", stroke: "currentColor", strokeWidth: "2.5", viewBox: "0 0 24 24" },
                            e("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 9l-7 7-7-7" })
                        )
                    ),
                    activeDropdown === "inventory" && e("div", {
                        className: "absolute left-0 mt-1.5 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 divide-y divide-slate-100",
                        style: { zIndex: 9999 }
                    },
                        e("div", { className: "py-1" },
                            e("button", {
                                onClick: () => { setActivePage("inventory_products"); setActiveDropdown(null); },
                                className: "w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#0284C7] flex items-center gap-2 cursor-pointer"
                            }, "📦 All Products Catalogue"),
                            e("button", {
                                onClick: () => { setActivePage("inventory_remove"); setActiveDropdown(null); },
                                className: "w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-rose-600 flex items-center gap-2 cursor-pointer"
                            }, "🗑️ Remove Inventory (Disposals)")
                        )
                    )
                ),

                // 4. CARDS HUB
                e("button", {
                    type: "button",
                    onClick: () => { setActivePage("cards"); setActiveDropdown(null); },
                    className: `px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        activePage === "cards" 
                            ? "bg-[#072946] text-white shadow-sm font-bold" 
                            : "hover:bg-slate-100 text-slate-700"
                    }`
                }, "💳 Cards Hub"),

                // 5. SALES DROPDOWN
                e("div", { className: "relative nav-dropdown-wrapper", style: { overflow: "visible" } },
                    e("button", {
                        type: "button",
                        onClick: (evt) => { evt.stopPropagation(); setActiveDropdown(activeDropdown === "sales" ? null : "sales"); },
                        className: `px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                            isNavActive(["sales_history", "sales_pending", "sales_returns", "sales_cashier"]) 
                                ? "bg-[#072946] text-white shadow-sm font-bold" 
                                : "hover:bg-slate-100 text-slate-700"
                        }`
                    },
                        e("span", null, "🧾 Sales"),
                        e("svg", { className: `w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "sales" ? "rotate-180" : ""}`, fill: "none", stroke: "currentColor", strokeWidth: "2.5", viewBox: "0 0 24 24" },
                            e("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 9l-7 7-7-7" })
                        )
                    ),
                    activeDropdown === "sales" && e("div", {
                        className: "absolute left-0 mt-1.5 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 divide-y divide-slate-100",
                        style: { zIndex: 9999 }
                    },
                        e("div", { className: "py-1" },
                            e("button", {
                                onClick: () => { setActivePage("sales_history"); setActiveDropdown(null); },
                                className: "w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#0284C7] flex items-center gap-2 cursor-pointer"
                            }, "🧾 Seller History & Invoices"),
                            e("button", {
                                onClick: () => { setActivePage("sales_pending"); setActiveDropdown(null); },
                                className: "w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#0284C7] flex items-center justify-between cursor-pointer"
                            }, 
                                e("span", null, "⏳ Pending Sales (Held Carts)"),
                                e("span", { className: "px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800" }, heldCarts.length)
                            ),
                            e("button", {
                                onClick: () => { setActivePage("sales_returns"); setActiveDropdown(null); },
                                className: "w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-rose-600 flex items-center gap-2 cursor-pointer"
                            }, "🔄 Returns & Refunds"),
                            e("button", {
                                onClick: () => { setActivePage("sales_cashier"); setActiveDropdown(null); },
                                className: "w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#0284C7] flex items-center gap-2 cursor-pointer"
                            }, "💼 Cashier Clearance Queue")
                        )
                    )
                ),

                // 6. REPORTS DROPDOWN
                e("div", { className: "relative nav-dropdown-wrapper", style: { overflow: "visible" } },
                    e("button", {
                        type: "button",
                        onClick: (evt) => { evt.stopPropagation(); setActiveDropdown(activeDropdown === "reports" ? null : "reports"); },
                        className: `px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                            isNavActive(["reports_all", "reports_daily", "reports_expiry", "reports_customers"]) 
                                ? "bg-[#072946] text-white shadow-sm font-bold" 
                                : "hover:bg-slate-100 text-slate-700"
                        }`
                    },
                        e("span", null, "📊 Reports"),
                        e("svg", { className: `w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "reports" ? "rotate-180" : ""}`, fill: "none", stroke: "currentColor", strokeWidth: "2.5", viewBox: "0 0 24 24" },
                            e("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 9l-7 7-7-7" })
                        )
                    ),
                    activeDropdown === "reports" && e("div", {
                        className: "absolute left-0 mt-1.5 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 divide-y divide-slate-100",
                        style: { zIndex: 9999 }
                    },
                        e("div", { className: "py-1" },
                            e("button", {
                                onClick: () => { setActivePage("reports_all"); setActiveDropdown(null); },
                                className: "w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#0284C7] flex items-center gap-2 cursor-pointer"
                            }, "📊 Master BI Overview"),
                            e("button", {
                                onClick: () => { setActivePage("reports_daily"); setActiveDropdown(null); },
                                className: "w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#0284C7] flex items-center gap-2 cursor-pointer"
                            }, "📅 Daily Shift Sales"),
                            e("button", {
                                onClick: () => { setActivePage("reports_expiry"); setActiveDropdown(null); },
                                className: "w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-rose-600 flex items-center justify-between cursor-pointer"
                            }, 
                                e("span", null, "⚠️ FEFO Expiry Matrix"),
                                e("span", { className: "px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800" }, "2 Due")
                            ),
                            e("button", {
                                onClick: () => { setActivePage("reports_customers"); setActiveDropdown(null); },
                                className: "w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#0284C7] flex items-center gap-2 cursor-pointer"
                            }, "👤 Customer Sales & Debts")
                        )
                    )
                ),

                // 7. FINANCE DROPDOWN
                e("div", { className: "relative nav-dropdown-wrapper", style: { overflow: "visible" } },
                    e("button", {
                        type: "button",
                        onClick: (evt) => { evt.stopPropagation(); setActiveDropdown(activeDropdown === "finance" ? null : "finance"); },
                        className: `px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                            isNavActive(["finance_accounting", "finance_expenses"]) 
                                ? "bg-[#072946] text-white shadow-sm font-bold" 
                                : "hover:bg-slate-100 text-slate-700"
                        }`
                    },
                        e("span", null, "💰 Finance"),
                        e("svg", { className: `w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "finance" ? "rotate-180" : ""}`, fill: "none", stroke: "currentColor", strokeWidth: "2.5", viewBox: "0 0 24 24" },
                            e("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 9l-7 7-7-7" })
                        )
                    ),
                    activeDropdown === "finance" && e("div", {
                        className: "absolute left-0 mt-1.5 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 divide-y divide-slate-100",
                        style: { zIndex: 9999 }
                    },
                        e("div", { className: "py-1" },
                            e("button", {
                                onClick: () => { setActivePage("finance_accounting"); setActiveDropdown(null); },
                                className: "w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#0284C7] flex items-center gap-2 cursor-pointer"
                            }, "💰 General Ledger Accounting"),
                            e("button", {
                                onClick: () => { setActivePage("finance_profit_loss"); setActiveDropdown(null); },
                                className: "w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#0284C7] flex items-center gap-2 cursor-pointer"
                            }, "📈 Profit & Loss Statement (P&L)"),
                            e("button", {
                                onClick: () => { setActivePage("finance_expenses"); setActiveDropdown(null); },
                                className: "w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#0284C7] flex items-center gap-2 cursor-pointer"
                            }, "📋 Operating Expenses")
                        )
                    )
                ),

                // 8. USERS
                e("button", {
                    type: "button",
                    onClick: () => { setActivePage("users"); setActiveDropdown(null); },
                    className: `px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        activePage === "users" 
                            ? "bg-[#072946] text-white shadow-sm font-bold" 
                            : "hover:bg-slate-100 text-slate-700"
                    }`
                }, "👥 Users"),

                // 9. SETTINGS
                e("button", {
                    type: "button",
                    onClick: () => { setActivePage("settings"); setActiveDropdown(null); },
                    className: `px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        activePage === "settings" 
                            ? "bg-[#072946] text-white shadow-sm font-bold" 
                            : "hover:bg-slate-100 text-slate-700"
                    }`
                }, "⚙️ Settings")
            ),

            // Right Station Status
            e("div", { className: "flex items-center gap-3 text-xs font-mono font-bold text-slate-500" },
                e("span", { className: "hidden md:inline text-emerald-600 flex items-center gap-1" },
                    e("span", { className: "w-2 h-2 rounded-full bg-emerald-500" }),
                    "EDGE NODE: ONLINE"
                ),
                activePage !== "pos" && e("button", {
                    onClick: () => setActivePage("pos"),
                    className: "px-3 py-1 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-md text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                }, "⚡ Open POS")
            )
        ),

        // ─────────────────────────────────────────────────────────────
        // MAIN WORKSPACE VIEW ROUTER
        // ─────────────────────────────────────────────────────────────
        e("main", { className: "flex-1 flex flex-col overflow-hidden" },
            
            // 1. DASHBOARD VIEW
            activePage === "dashboard" && e(DashboardView, { 
                inventory, dailySales, expenses, cards, heldCarts, onNavigate: (page) => setActivePage(page) 
            }),

            // 2. POS VIEW
            activePage === "pos" && e(PosView, {
                inventory, cart, addToCart, updateQty, holdCart, subtotal, search, setSearch,
                setPaymentModal, filteredProducts
            }),

            // 3. INVENTORY: ALL PRODUCTS
            activePage === "inventory_products" && e(InventoryProductsView, {
                inventory, setInventory, onNavigate: (page) => setActivePage(page)
            }),

            // 4. INVENTORY: REMOVE INVENTORY
            activePage === "inventory_remove" && e(InventoryRemoveView, {
                inventory, onNavigate: (page) => setActivePage(page)
            }),

            // 5. CARDS HUB
            activePage === "cards" && e(CardsHubView, {
                cards, setCards, onNavigate: (page) => setActivePage(page)
            }),

            // 6. SALES: SELLER HISTORY
            activePage === "sales_history" && e(SalesHistoryView, {
                sales: dailySales, onViewReceipt: (sale) => { setCompletedSale(sale); setReceiptModal(true); }
            }),

            // 7. SALES: PENDING (HELD CARTS)
            activePage === "sales_pending" && e(SalesPendingView, {
                heldCarts, onRecall: recallCart
            }),

            // 8. SALES: RETURNS
            activePage === "sales_returns" && e(SalesReturnsView),

            // 9. SALES: CASHIER QUEUE
            activePage === "sales_cashier" && e(SalesCashierQueueView, {
                heldCarts, onRecall: recallCart
            }),

            // 10. REPORTS: ALL BI
            activePage === "reports_all" && e(ReportsAllView, {
                sales: dailySales, inventory
            }),

            // 11. REPORTS: DAILY
            activePage === "reports_daily" && e(ReportsDailyView, {
                sales: dailySales
            }),

            // 12. REPORTS: EXPIRY (FEFO)
            activePage === "reports_expiry" && e(ReportsExpiryView, {
                inventory
            }),

            // 13. REPORTS: CUSTOMERS
            activePage === "reports_customers" && e(ReportsCustomersView, {
                cards
            }),

            // 14. FINANCE: ACCOUNTING
            activePage === "finance_accounting" && e(FinanceAccountingView, {
                sales: dailySales, expenses, onNavigate: (page) => setActivePage(page)
            }),

            // 14b. FINANCE: PROFIT & LOSS ANALYSIS
            activePage === "finance_profit_loss" && e(ProfitLossView, {
                sales: dailySales, expenses, inventory, onNavigate: (page) => setActivePage(page)
            }),

            // 15. FINANCE: EXPENSES
            activePage === "finance_expenses" && e(FinanceExpensesView, {
                expenses, setExpenses
            }),

            // 16. USERS
            activePage === "users" && e(UsersView),

            // 17. SETTINGS
            activePage === "settings" && e(SettingsView)
        ),

        // ─────────────────────────────────────────────────────────────
        // MODALS
        // ─────────────────────────────────────────────────────────────
        // Payment Modal
        paymentModal && e(PaymentModal, {
            subtotal, paymentMethod, setPaymentMethod, moniepointRrn, setMoniepointRrn,
            onClose: () => setPaymentModal(false), onConfirm: finalizeCheckout
        }),

        // 80mm ESC/POS Thermal Receipt Modal
        receiptModal && completedSale && e(ReceiptModal, {
            sale: completedSale, onClose: () => setReceiptModal(false)
        }),

        // Z-Report Modal
        zReportModal && e(ZReportModal, {
            dailySales, inventory, onClose: () => setZReportModal(false)
        })
    );
}

// ─────────────────────────────────────────────────────────────
// VIEW 1: DASHBOARD
// ─────────────────────────────────────────────────────────────
function DashboardView({ inventory, dailySales, expenses, cards, heldCarts, onNavigate }) {
    const totalSalesToday = dailySales.reduce((sum, s) => sum + s.total, 0);
    const totalExpensesToday = expenses.reduce((sum, ex) => sum + ex.amount, 0);
    const totalDebt = cards.reduce((sum, c) => sum + c.debt, 0);
    const lowStockCount = inventory.filter(i => i.stock < 15).length;

    return e("div", { className: "flex-1 p-6 overflow-y-auto space-y-6" },
        // Welcome Header
        e("div", { className: "flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200" },
            e("div", null,
                e("h2", { className: "text-2xl font-black text-[#072946] tracking-tight" }, "Command Dashboard"),
                e("p", { className: "text-xs text-slate-500 font-medium mt-1" }, "Real-time edge metrics, dispensing velocity, and pharmacy financial standing.")
            ),
            e("div", { className: "flex items-center gap-2" },
                e("button", { onClick: () => onNavigate("pos"), className: "px-4 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-lg font-bold text-xs shadow-md transition-all cursor-pointer" }, "⚡ Open Dispenser POS"),
                e("button", { onClick: () => onNavigate("sales_history"), className: "px-4 py-2 bg-white border border-slate-300 hover:border-[#00D2FF] text-[#072946] rounded-lg font-bold text-xs shadow-sm transition-all cursor-pointer" }, "🧾 Invoices Ledger")
            )
        ),

        // KPI Summary Cards
        e("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" },
            e("div", { className: "p-5 bg-white rounded-2xl border border-slate-200 shadow-sm" },
                e("div", { className: "text-xs font-bold uppercase text-slate-400" }, "Today's Gross Sales"),
                e("div", { className: "text-2xl font-black font-mono text-[#E11D48] mt-1" }, "₦" + totalSalesToday.toLocaleString()),
                e("div", { className: "text-[11px] text-emerald-600 font-bold mt-2 flex items-center gap-1" }, "▲ +18.4% vs last shift")
            ),
            e("div", { className: "p-5 bg-white rounded-2xl border border-slate-200 shadow-sm" },
                e("div", { className: "text-xs font-bold uppercase text-slate-400" }, "Dispensed Invoices"),
                e("div", { className: "text-2xl font-black font-mono text-[#072946] mt-1" }, dailySales.length + " Orders"),
                e("div", { className: "text-[11px] text-slate-500 font-medium mt-2" }, "Avg ticket: ₦" + (dailySales.length ? Math.round(totalSalesToday / dailySales.length).toLocaleString() : 0))
            ),
            e("div", { className: "p-5 bg-white rounded-2xl border border-slate-200 shadow-sm" },
                e("div", { className: "text-xs font-bold uppercase text-slate-400" }, "Bashi Customer Debt"),
                e("div", { className: "text-2xl font-black font-mono text-amber-600 mt-1" }, "₦" + totalDebt.toLocaleString()),
                e("div", { className: "text-[11px] text-slate-500 font-medium mt-2" }, cards.filter(c => c.debt > 0).length + " Overdrawn customers")
            ),
            e("div", { className: "p-5 bg-white rounded-2xl border border-slate-200 shadow-sm" },
                e("div", { className: "text-xs font-bold uppercase text-slate-400" }, "Inventory Alerts"),
                e("div", { className: "text-2xl font-black font-mono text-rose-600 mt-1" }, lowStockCount + " Low Stock"),
                e("div", { className: "text-[11px] text-rose-500 font-bold mt-2" }, "2 Batches near expiry (FEFO)")
            )
        ),

        // Middle Row: Recent Sales & Quick Actions
        e("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6" },
            // Left: Recent Transactions Table
            e("div", { className: "lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" },
                e("div", { className: "p-4 border-b border-slate-100 flex items-center justify-between" },
                    e("h3", { className: "text-sm font-black text-[#072946] uppercase tracking-wide" }, "Recent Dispensed Sales"),
                    e("button", { onClick: () => onNavigate("sales_history"), className: "text-xs text-[#0284C7] font-bold hover:underline cursor-pointer" }, "View All →")
                ),
                e("div", { className: "overflow-x-auto" },
                    e("table", { className: "w-full text-left text-xs" },
                        e("thead", { className: "bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-100" },
                            e("tr", null,
                                e("th", { className: "py-3 px-4" }, "Invoice"),
                                e("th", { className: "py-3 px-4" }, "Tender"),
                                e("th", { className: "py-3 px-4 text-right" }, "Amount"),
                                e("th", { className: "py-3 px-4 text-center" }, "Time")
                            )
                        ),
                        e("tbody", { className: "divide-y divide-slate-100 font-medium" },
                            dailySales.slice(0, 5).map(sale => e("tr", { key: sale.ref, className: "hover:bg-slate-50 transition-colors" },
                                e("td", { className: "py-3 px-4 font-mono font-bold text-[#072946]" }, sale.ref),
                                e("td", { className: "py-3 px-4" },
                                    e("span", { className: `px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        sale.method === "Cash" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                                        sale.method === "Moniepoint POS" ? "bg-cyan-50 text-cyan-700 border border-cyan-200" :
                                        "bg-purple-50 text-purple-700 border border-purple-200"
                                    }` }, sale.method)
                                ),
                                e("td", { className: "py-3 px-4 font-mono font-extrabold text-right text-[#E11D48]" }, "₦" + sale.total.toLocaleString()),
                                e("td", { className: "py-3 px-4 text-center text-slate-400 font-mono" }, sale.date)
                            ))
                        )
                    )
                )
            ),

            // Right: Shift Status & Quick Actions
            e("div", { className: "space-y-4" },
                e("div", { className: "bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4" },
                    e("h3", { className: "text-sm font-black text-[#072946] uppercase tracking-wide" }, "Edge Shift Status"),
                    e("div", { className: "space-y-2 text-xs" },
                        e("div", { className: "flex justify-between py-1 border-b border-slate-100" },
                            e("span", { className: "text-slate-500" }, "Cashier On Duty:"),
                            e("span", { className: "font-bold text-[#072946]" }, "Dr. Godwin Udele")
                        ),
                        e("div", { className: "flex justify-between py-1 border-b border-slate-100" },
                            e("span", { className: "text-slate-500" }, "Shift Opened:"),
                            e("span", { className: "font-mono text-slate-700" }, "08:00 AM Today")
                        ),
                        e("div", { className: "flex justify-between py-1 border-b border-slate-100" },
                            e("span", { className: "text-slate-500" }, "Held Carts Waiting:"),
                            e("span", { className: "font-bold text-amber-600" }, heldCarts.length + " in queue")
                        ),
                        e("div", { className: "flex justify-between py-1" },
                            e("span", { className: "text-slate-500" }, "LAN Database Sync:"),
                            e("span", { className: "font-bold text-emerald-600 flex items-center gap-1" }, "🟢 100% Synced")
                        )
                    ),
                    e("div", { className: "pt-2 space-y-2" },
                        e("button", { onClick: () => onNavigate("cards"), className: "w-full py-2 bg-slate-100 hover:bg-slate-200 text-[#072946] rounded-lg text-xs font-bold transition-colors text-left px-3 flex items-center justify-between cursor-pointer" },
                            e("span", null, "💳 Onboard / Top-up Customer Card"),
                            e("span", null, "→")
                        ),
                        e("button", { onClick: () => onNavigate("reports_expiry"), className: "w-full py-2 bg-slate-100 hover:bg-slate-200 text-[#072946] rounded-lg text-xs font-bold transition-colors text-left px-3 flex items-center justify-between cursor-pointer" },
                            e("span", null, "⚠️ Check FEFO Drug Expiry Alerts"),
                            e("span", null, "→")
                        ),
                        e("button", { onClick: () => onNavigate("finance_expenses"), className: "w-full py-2 bg-slate-100 hover:bg-slate-200 text-[#072946] rounded-lg text-xs font-bold transition-colors text-left px-3 flex items-center justify-between cursor-pointer" },
                            e("span", null, "📋 Log Pharmacy Operating Expense"),
                            e("span", null, "→")
                        )
                    )
                )
            )
        )
    );
}

// ─────────────────────────────────────────────────────────────
// VIEW 2: POS TERMINAL
// ─────────────────────────────────────────────────────────────
function PosView({ inventory, cart, addToCart, updateQty, holdCart, subtotal, search, setSearch, setPaymentModal, filteredProducts }) {
    return e("div", { className: "flex-1 flex flex-col lg:flex-row overflow-hidden" },
        // Left Dispensing Cart Panel
        e("div", { className: "w-full lg:w-[420px] max-h-[40vh] lg:max-h-none bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col shadow-sm flex-shrink-0" },
            e("div", { className: "p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50" },
                e("div", { className: "text-xs font-black uppercase text-[#072946] tracking-wider" }, "Active Dispensing Cart"),
                e("div", { className: "flex items-center gap-2" },
                    e("button", {
                        onClick: holdCart,
                        disabled: cart.length === 0,
                        className: "px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded text-[11px] font-bold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    }, "⏸️ Hold Cart"),
                    e("span", { className: "text-xs font-mono font-bold text-slate-500" }, cart.length + " Items")
                )
            ),
            e("div", { className: "flex-1 overflow-y-auto p-4 space-y-3" },
                cart.length === 0 
                    ? e("div", { className: "h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center space-y-2" },
                        e("div", { className: "text-3xl" }, "🛒"),
                        e("div", { className: "font-bold text-slate-600" }, "Cart is currently empty."),
                        e("div", { className: "text-[11px] text-slate-400" }, "Click drugs or provisions from the catalogue to add to sale.")
                      )
                    : cart.map(item => e("div", { key: item.id, className: "p-3 border border-slate-200 rounded-xl bg-[#F8FAFC] flex justify-between items-center" },
                        e("div", null,
                            e("div", { className: "text-xs font-bold text-[#072946]" }, item.name),
                            e("div", { className: "text-[10px] font-mono text-slate-500" }, "₦" + item.price.toLocaleString() + " × " + item.qty),
                            e("div", { className: "text-xs font-mono font-black text-[#E11D48] mt-0.5" }, "₦" + (item.price * item.qty).toLocaleString())
                        ),
                        e("div", { className: "flex items-center gap-2" },
                            e("button", { onClick: () => updateQty(item.id, -1), className: "w-7 h-7 rounded-lg bg-slate-200 font-black text-xs hover:bg-slate-300 transition-colors cursor-pointer flex items-center justify-center" }, "-"),
                            e("span", { className: "text-xs font-bold font-mono px-1.5" }, item.qty),
                            e("button", { onClick: () => updateQty(item.id, 1), className: "w-7 h-7 rounded-lg bg-slate-200 font-black text-xs hover:bg-slate-300 transition-colors cursor-pointer flex items-center justify-center" }, "+")
                        )
                    ))
            ),
            e("div", { className: "p-4 border-t border-slate-200 bg-[#F8FAFC]" },
                e("div", { className: "flex justify-between items-baseline mb-3" },
                    e("span", { className: "text-xs font-bold uppercase text-slate-500" }, "Payable Total:"),
                    e("span", { className: "text-2xl font-black font-mono text-[#E11D48]" }, "₦" + subtotal.toLocaleString())
                ),
                e("button", {
                    disabled: cart.length === 0,
                    onClick: () => setPaymentModal(true),
                    className: "w-full py-3 bg-[#E11D48] hover:bg-[#BE123C] disabled:bg-slate-300 text-white rounded-xl font-black text-sm uppercase tracking-wider shadow-lg transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
                }, "Proceed to Pay / Checkout →")
            )
        ),

        // Right Product Catalogue Grid
        e("div", { className: "flex-1 flex flex-col bg-[#F4F7FB] p-6 overflow-hidden" },
            // Search Input
            e("div", { className: "mb-5" },
                e("div", { className: "relative max-w-xl" },
                    e("input", {
                        type: "text",
                        placeholder: "🔍 Quick search medications by brand name, generic or SKU code...",
                        value: search,
                        onChange: (e) => setSearch(e.target.value),
                        className: "w-full pl-4 pr-10 py-3 bg-white border border-slate-300 focus:border-[#00D2FF] rounded-xl text-sm font-medium focus:outline-none shadow-sm transition-all"
                    }),
                    search && e("button", { onClick: () => setSearch(""), className: "absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs font-bold" }, "✕")
                )
            ),

            // Product Cards Grid
            e("div", { className: "flex-1 overflow-y-auto" },
                e("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-6" },
                    filteredProducts.map(product => e("div", {
                        key: product.id,
                        onClick: () => addToCart(product),
                        className: "bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#00D2FF] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                    },
                        e("div", null,
                            e("div", { className: "flex justify-between items-start gap-2 mb-2" },
                                e("span", { className: "px-2 py-0.5 rounded text-[9px] font-extrabold font-mono glass-cyan uppercase tracking-wider" }, product.code),
                                e("span", { className: `px-2 py-0.5 rounded text-[9px] font-bold ${
                                    product.stock === 0 ? "glass-rose font-black" :
                                    product.stock < 15 ? "bg-amber-50 text-amber-800 border border-amber-300" :
                                    "glass-cyan"
                                }` }, product.stock === 0 ? "OUT OF STOCK" : product.stock + " in Stock")
                            ),
                            e("h3", { className: "text-sm font-black text-[#072946] group-hover:text-[#0284C7] transition-colors leading-snug line-clamp-2" }, product.name),
                            e("div", { className: "text-[11px] text-slate-500 font-mono mt-1" }, "Batch: " + product.batch + " • Exp: " + product.exp)
                        ),
                        e("div", { className: "mt-4 pt-3 border-t border-slate-100 flex items-center justify-between" },
                            e("span", { className: "text-base font-black font-mono text-[#E11D48]" }, "₦" + product.price.toLocaleString()),
                            e("span", { className: "w-8 h-8 rounded-lg bg-sky-50 text-[#072946] font-black text-sm flex items-center justify-center group-hover:bg-[#072946] group-hover:text-white transition-colors" }, "+")
                        )
                    ))
                )
            )
        )
    );
}

// ─────────────────────────────────────────────────────────────
// VIEW 3: INVENTORY - ALL PRODUCTS
// ─────────────────────────────────────────────────────────────
function InventoryProductsView({ inventory, setInventory, onNavigate }) {
    const [invSearch, setInvSearch] = useState("");
    const filtered = inventory.filter(i => i.name.toLowerCase().includes(invSearch.toLowerCase()) || i.code.toLowerCase().includes(invSearch.toLowerCase()));

    return e("div", { className: "flex-1 p-6 overflow-y-auto space-y-6" },
        e("div", { className: "flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200" },
            e("div", null,
                e("h2", { className: "text-2xl font-black text-[#072946]" }, "📦 Product Inventory & Catalogue"),
                e("p", { className: "text-xs text-slate-500 font-medium mt-1" }, "Complete pharmacy stock master with multi-batch expiry dates and price markups.")
            ),
            e("div", { className: "flex items-center gap-3" },
                e("input", {
                    type: "text",
                    placeholder: "Search catalogue...",
                    value: invSearch,
                    onChange: (e) => setInvSearch(e.target.value),
                    className: "px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:border-[#00D2FF]"
                }),
                e("button", {
                    onClick: () => alert("Product Creation Modal: In Emerald-v2 live system, use Product Management to import or register new pharmaceuticals."),
                    className: "px-3 py-2 bg-[#072946] hover:bg-[#0A3A63] text-white rounded-lg text-xs font-bold cursor-pointer"
                }, "+ Add New Drug")
            )
        ),

        e("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" },
            e("table", { className: "w-full text-left text-xs" },
                e("thead", { className: "bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-200" },
                    e("tr", null,
                        e("th", { className: "py-3 px-4" }, "SKU / Code"),
                        e("th", { className: "py-3 px-4" }, "Medication Name"),
                        e("th", { className: "py-3 px-4" }, "Category"),
                        e("th", { className: "py-3 px-4 text-center" }, "Stock Level"),
                        e("th", { className: "py-3 px-4 text-right" }, "Cost (₦)"),
                        e("th", { className: "py-3 px-4 text-right" }, "Retail (₦)"),
                        e("th", { className: "py-3 px-4" }, "Expiry (FEFO)"),
                        e("th", { className: "py-3 px-4" }, "Batch Ref")
                    )
                ),
                e("tbody", { className: "divide-y divide-slate-100 font-medium" },
                    filtered.map(item => e("tr", { key: item.id, className: "hover:bg-slate-50 transition-colors" },
                        e("td", { className: "py-3 px-4 font-mono font-bold text-[#0284C7]" }, item.code),
                        e("td", { className: "py-3 px-4 font-bold text-[#072946]" }, item.name),
                        e("td", { className: "py-3 px-4 text-slate-500 text-[11px]" }, item.category),
                        e("td", { className: "py-3 px-4 text-center" },
                            e("span", { className: `px-2 py-0.5 rounded text-[10px] font-bold ${
                                item.stock < 10 ? "glass-rose font-black" : "glass-cyan"
                            }` }, item.stock + " units")
                        ),
                        e("td", { className: "py-3 px-4 font-mono text-right text-slate-600" }, "₦" + item.cost.toLocaleString()),
                        e("td", { className: "py-3 px-4 font-mono font-black text-right text-[#E11D48]" }, "₦" + item.price.toLocaleString()),
                        e("td", { className: "py-3 px-4 font-mono text-slate-600" }, item.exp),
                        e("td", { className: "py-3 px-4 font-mono text-slate-400 text-[11px]" }, item.batch)
                    ))
                )
            )
        )
    );
}

// ─────────────────────────────────────────────────────────────
// VIEW 4: INVENTORY - REMOVE INVENTORY
// ─────────────────────────────────────────────────────────────
function InventoryRemoveView({ inventory, onNavigate }) {
    return e("div", { className: "flex-1 p-6 overflow-y-auto space-y-6" },
        e("div", { className: "pb-4 border-b border-slate-200" },
            e("h2", { className: "text-2xl font-black text-[#072946]" }, "🗑️ Inventory Removal & Stock Adjustments"),
            e("p", { className: "text-xs text-slate-500 font-medium mt-1" }, "Authorized write-off workflow for expired batches, damaged ampoules, and audit discrepancies.")
        ),

        e("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6" },
            // Disposal Form
            e("div", { className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4" },
                e("h3", { className: "text-sm font-black text-[#072946] uppercase tracking-wide" }, "Log Write-Off"),
                e("div", { className: "space-y-3 text-xs" },
                    e("div", null,
                        e("label", { className: "block text-slate-500 mb-1 font-semibold" }, "Select Product:"),
                        e("select", { className: "w-full p-2 bg-white border border-slate-300 rounded-lg" },
                            inventory.map(i => e("option", { key: i.id, value: i.id }, i.name + " (" + i.stock + " in stock)"))
                        )
                    ),
                    e("div", null,
                        e("label", { className: "block text-slate-500 mb-1 font-semibold" }, "Quantity to Remove:"),
                        e("input", { type: "number", defaultValue: "1", min: "1", className: "w-full p-2 border border-slate-300 rounded-lg" })
                    ),
                    e("div", null,
                        e("label", { className: "block text-slate-500 mb-1 font-semibold" }, "Reason for Disposal:"),
                        e("select", { className: "w-full p-2 bg-white border border-slate-300 rounded-lg" },
                            e("option", null, "Expired Batch (FEFO Audit)"),
                            e("option", null, "Damaged / Broken Ampoule"),
                            e("option", null, "Supplier Recall"),
                            e("option", null, "Audit Discrepancy")
                        )
                    ),
                    e("div", null,
                        e("label", { className: "block text-slate-500 mb-1 font-semibold" }, "Authorizing Officer:"),
                        e("input", { type: "text", defaultValue: "Dr. Godwin Udele", readOnly: true, className: "w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600" })
                    ),
                    e("button", {
                        onClick: () => alert("Stock removal audit record submitted successfully."),
                        className: "w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs shadow-md transition-colors cursor-pointer"
                    }, "Submit Removal Record")
                )
            ),

            // Removal History Log
            e("div", { className: "lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4" },
                e("h3", { className: "text-sm font-black text-[#072946] uppercase tracking-wide" }, "Recent Removal & Write-off Audit Log"),
                e("table", { className: "w-full text-left text-xs" },
                    e("thead", { className: "bg-slate-50 text-slate-500 uppercase font-mono text-[10px]" },
                        e("tr", null,
                            e("th", { className: "py-2 px-3" }, "Date"),
                            e("th", { className: "py-2 px-3" }, "Product"),
                            e("th", { className: "py-2 px-3" }, "Qty"),
                            e("th", { className: "py-2 px-3" }, "Reason"),
                            e("th", { className: "py-2 px-3" }, "Authorizer")
                        )
                    ),
                    e("tbody", { className: "divide-y divide-slate-100 font-medium" },
                        e("tr", null,
                            e("td", { className: "py-3 px-3 font-mono text-slate-400" }, "2026-09-02"),
                            e("td", { className: "py-3 px-3 font-bold text-[#072946]" }, "IV Ceftriaxone 1g"),
                            e("td", { className: "py-3 px-3 text-rose-600 font-bold" }, "2 Vials"),
                            e("td", { className: "py-3 px-3 text-slate-600" }, "Broken ampoule in transit"),
                            e("td", { className: "py-3 px-3 text-slate-500" }, "Dr. Godwin")
                        ),
                        e("tr", null,
                            e("td", { className: "py-3 px-3 font-mono text-slate-400" }, "2026-08-28"),
                            e("td", { className: "py-3 px-3 font-bold text-[#072946]" }, "Paracetamol Syrup 100ml"),
                            e("td", { className: "py-3 px-3 text-rose-600 font-bold" }, "1 Bottle"),
                            e("td", { className: "py-3 px-3 text-slate-600" }, "Cap seal compromise"),
                            e("td", { className: "py-3 px-3 text-slate-500" }, "Pharmacist Grace")
                        )
                    )
                )
            )
        )
    );
}

// ─────────────────────────────────────────────────────────────
// VIEW 5: CARDS HUB
// ─────────────────────────────────────────────────────────────
function CardsHubView({ cards, setCards, onNavigate }) {
    const totalStoredValue = cards.reduce((sum, c) => sum + c.balance, 0);
    const totalBashiDebt = cards.reduce((sum, c) => sum + c.debt, 0);

    const settleDebt = (cardId) => {
        setCards(prev => prev.map(c => c.id === cardId ? { ...c, debt: 0 } : c));
        alert("Debt cleared successfully for card holder!");
    };

    return e("div", { className: "flex-1 p-6 overflow-y-auto space-y-6" },
        e("div", { className: "flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200" },
            e("div", null,
                e("h2", { className: "text-2xl font-black text-[#072946]" }, "💳 Cards Hub & Bashi Credit Ledger"),
                e("p", { className: "text-xs text-slate-500 font-medium mt-1" }, "Manage patient prepaid loyalty cards, NFC tags, and hospital credit accounts.")
            ),
            e("button", {
                onClick: () => alert("Quick Onboard: In production, tap patient physical NFC card or input Phone number to issue new wallet."),
                className: "px-4 py-2 bg-[#072946] hover:bg-[#0A3A63] text-white rounded-lg text-xs font-bold shadow-md cursor-pointer"
            }, "+ Onboard New Card")
        ),

        // Cards Metrics
        e("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4" },
            e("div", { className: "p-4 bg-white rounded-2xl border border-slate-200 shadow-sm" },
                e("div", { className: "text-xs font-bold uppercase text-slate-400" }, "Active Cards"),
                e("div", { className: "text-2xl font-black text-[#072946] mt-1" }, cards.length + " Issued"),
                e("div", { className: "text-[11px] text-emerald-600 font-bold mt-1" }, "100% Whitelisted")
            ),
            e("div", { className: "p-4 bg-white rounded-2xl border border-slate-200 shadow-sm" },
                e("div", { className: "text-xs font-bold uppercase text-slate-400" }, "Total Prepaid Balance"),
                e("div", { className: "text-2xl font-black font-mono text-emerald-600 mt-1" }, "₦" + totalStoredValue.toLocaleString()),
                e("div", { className: "text-[11px] text-slate-500 mt-1" }, "Customer advance funds")
            ),
            e("div", { className: "p-4 bg-white rounded-2xl border border-slate-200 shadow-sm" },
                e("div", { className: "text-xs font-bold uppercase text-slate-400" }, "Total Bashi Debt Outstanding"),
                e("div", { className: "text-2xl font-black font-mono text-rose-600 mt-1" }, "₦" + totalBashiDebt.toLocaleString()),
                e("div", { className: "text-[11px] text-slate-500 mt-1" }, "Subject to credit limit")
            )
        ),

        // Cards Table
        e("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" },
            e("table", { className: "w-full text-left text-xs" },
                e("thead", { className: "bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-200" },
                    e("tr", null,
                        e("th", { className: "py-3 px-4" }, "Card UID"),
                        e("th", { className: "py-3 px-4" }, "Holder Name"),
                        e("th", { className: "py-3 px-4" }, "Phone"),
                        e("th", { className: "py-3 px-4" }, "Tier"),
                        e("th", { className: "py-3 px-4 text-right" }, "Prepaid Balance"),
                        e("th", { className: "py-3 px-4 text-right" }, "Bashi Debt"),
                        e("th", { className: "py-3 px-4 text-center" }, "Action")
                    )
                ),
                e("tbody", { className: "divide-y divide-slate-100 font-medium" },
                    cards.map(c => e("tr", { key: c.id, className: "hover:bg-slate-50 transition-colors" },
                        e("td", { className: "py-3 px-4 font-mono font-bold text-[#0284C7]" }, c.uid),
                        e("td", { className: "py-3 px-4 font-bold text-[#072946]" }, c.name),
                        e("td", { className: "py-3 px-4 font-mono text-slate-600" }, c.phone),
                        e("td", { className: "py-3 px-4" },
                            e("span", { className: "px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200" }, c.tier)
                        ),
                        e("td", { className: "py-3 px-4 font-mono font-bold text-right text-emerald-600" }, "₦" + c.balance.toLocaleString()),
                        e("td", { className: "py-3 px-4 font-mono font-black text-right text-[#E11D48]" }, "₦" + c.debt.toLocaleString()),
                        e("td", { className: "py-3 px-4 text-center" },
                            c.debt > 0 
                                ? e("button", { onClick: () => settleDebt(c.id), className: "px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold cursor-pointer transition-colors" }, "Settle Debt")
                                : e("span", { className: "text-slate-400 text-[10px]" }, "Clear")
                        )
                    ))
                )
            )
        )
    );
}

// ─────────────────────────────────────────────────────────────
// VIEW 6: SALES - SELLER HISTORY
// ─────────────────────────────────────────────────────────────
function SalesHistoryView({ sales, onViewReceipt }) {
    return e("div", { className: "flex-1 p-6 overflow-y-auto space-y-6" },
        e("div", { className: "pb-4 border-b border-slate-200" },
            e("h2", { className: "text-2xl font-black text-[#072946]" }, "🧾 Seller History & Invoices Ledger"),
            e("p", { className: "text-xs text-slate-500 font-medium mt-1" }, "Complete audit trail of all finalized sales, cashier splits, and reprint capabilities.")
        ),

        e("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" },
            e("table", { className: "w-full text-left text-xs" },
                e("thead", { className: "bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-200" },
                    e("tr", null,
                        e("th", { className: "py-3 px-4" }, "Receipt Ref"),
                        e("th", { className: "py-3 px-4" }, "Timestamp"),
                        e("th", { className: "py-3 px-4" }, "Cashier"),
                        e("th", { className: "py-3 px-4" }, "Payment Method"),
                        e("th", { className: "py-3 px-4 text-right" }, "Total (₦)"),
                        e("th", { className: "py-3 px-4 text-center" }, "Status"),
                        e("th", { className: "py-3 px-4 text-center" }, "Receipt")
                    )
                ),
                e("tbody", { className: "divide-y divide-slate-100 font-medium" },
                    sales.map(s => e("tr", { key: s.ref, className: "hover:bg-slate-50 transition-colors" },
                        e("td", { className: "py-3 px-4 font-mono font-bold text-[#072946]" }, s.ref),
                        e("td", { className: "py-3 px-4 font-mono text-slate-500" }, s.date),
                        e("td", { className: "py-3 px-4 text-slate-700" }, s.cashier || "Godwin Udele"),
                        e("td", { className: "py-3 px-4" },
                            e("span", { className: "px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-[#0284C7] border border-sky-200" }, s.method)
                        ),
                        e("td", { className: "py-3 px-4 font-mono font-black text-right text-[#E11D48]" }, "₦" + s.total.toLocaleString()),
                        e("td", { className: "py-3 px-4 text-center" },
                            e("span", { className: "px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700" }, s.status || "Paid")
                        ),
                        e("td", { className: "py-3 px-4 text-center" },
                            e("button", { onClick: () => onViewReceipt(s), className: "px-2.5 py-1 bg-[#072946] hover:bg-[#0A3A63] text-white rounded text-[10px] font-bold cursor-pointer transition-colors" }, "Reprint ESC/POS")
                        )
                    ))
                )
            )
        )
    );
}

// ─────────────────────────────────────────────────────────────
// VIEW 7: SALES - PENDING (HELD CARTS)
// ─────────────────────────────────────────────────────────────
function SalesPendingView({ heldCarts, onRecall }) {
    return e("div", { className: "flex-1 p-6 overflow-y-auto space-y-6" },
        e("div", { className: "pb-4 border-b border-slate-200" },
            e("h2", { className: "text-2xl font-black text-[#072946]" }, "⏳ Pending Sales & Held Carts Engine"),
            e("p", { className: "text-xs text-slate-500 font-medium mt-1" }, "Unfinalized patient carts placed on hold. Recall directly into active POS dispenser cart.")
        ),

        heldCarts.length === 0 
            ? e("div", { className: "p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200" },
                e("div", { className: "text-4xl mb-2" }, "✅"),
                e("div", { className: "font-bold text-slate-700" }, "No held carts currently in queue."),
                e("div", { className: "text-xs mt-1" }, "Use 'Hold Cart' on the POS screen to park sales temporarily.")
              )
            : e("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                heldCarts.map(h => e("div", { key: h.id, className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between" },
                    e("div", { className: "space-y-3" },
                        e("div", { className: "flex justify-between items-center" },
                            e("span", { className: "px-2 py-0.5 rounded text-[10px] font-extrabold font-mono bg-amber-100 text-amber-900 border border-amber-300" }, h.ref),
                            e("span", { className: "text-xs text-slate-400 font-mono" }, "Held at " + h.time)
                        ),
                        e("h3", { className: "font-bold text-[#072946] text-sm" }, h.customer),
                        e("div", { className: "text-xs text-slate-500" }, "Dispenser: " + h.cashier + " • " + h.itemsCount + " Items in cart"),
                        e("div", { className: "p-2.5 bg-slate-50 rounded-lg text-xs space-y-1" },
                            h.items.map((it, idx) => e("div", { key: idx, className: "flex justify-between text-slate-600" },
                                e("span", null, it.qty + "x " + it.name),
                                e("span", { className: "font-mono font-bold" }, "₦" + (it.price * it.qty).toLocaleString())
                            ))
                        )
                    ),
                    e("div", { className: "mt-4 pt-3 border-t border-slate-100 flex items-center justify-between" },
                        e("span", { className: "text-lg font-black font-mono text-[#E11D48]" }, "₦" + h.total.toLocaleString()),
                        e("button", { onClick: () => onRecall(h), className: "px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-lg font-bold text-xs shadow-md transition-colors cursor-pointer" }, "Recall to Cart →")
                    )
                ))
            )
    );
}

// ─────────────────────────────────────────────────────────────
// VIEW 8: SALES - RETURNS
// ─────────────────────────────────────────────────────────────
function SalesReturnsView() {
    return e("div", { className: "flex-1 p-6 overflow-y-auto space-y-6" },
        e("div", { className: "pb-4 border-b border-slate-200" },
            e("h2", { className: "text-2xl font-black text-[#072946]" }, "🔄 Patient Returns & Refund Management"),
            e("p", { className: "text-xs text-slate-500 font-medium mt-1" }, "Process returned medications with safety checks and automatic stock re-entry.")
        ),
        e("div", { className: "p-8 bg-white rounded-2xl border border-slate-200 text-center max-w-xl mx-auto space-y-4 shadow-sm" },
            e("div", { className: "text-3xl" }, "🔍"),
            e("h3", { className: "text-base font-bold text-[#072946]" }, "Find Original Invoice to Return"),
            e("input", { type: "text", placeholder: "Input receipt number (e.g. EM-782103)...", className: "w-full p-3 border border-slate-300 rounded-xl text-center font-mono text-sm focus:outline-none focus:border-[#00D2FF]" }),
            e("button", { onClick: () => alert("Search queried: Invoice EM-782103 verified. Restock inspection passed."), className: "w-full py-2.5 bg-[#072946] hover:bg-[#0A3A63] text-white rounded-xl font-bold text-xs transition-colors cursor-pointer" }, "Inspect Invoice for Refund")
        )
    );
}

// ─────────────────────────────────────────────────────────────
// VIEW 9: SALES - CASHIER QUEUE
// ─────────────────────────────────────────────────────────────
function SalesCashierQueueView({ heldCarts, onRecall }) {
    return e("div", { className: "flex-1 p-6 overflow-y-auto space-y-6" },
        e("div", { className: "pb-4 border-b border-slate-200" },
            e("h2", { className: "text-2xl font-black text-[#072946]" }, "💼 Cashier Payment Clearance Queue"),
            e("p", { className: "text-xs text-slate-500 font-medium mt-1" }, "Dedicated payment desk clearance for doctor/sales floor dispensing slips.")
        ),
        e("div", { className: "bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4" },
            e("div", { className: "flex items-center justify-between text-xs" },
                e("span", { className: "font-bold text-slate-500" }, "Awaiting Clearance: " + heldCarts.length + " Slips"),
                e("span", { className: "text-emerald-600 font-bold" }, "Cash Desk #1 Active")
            ),
            e("div", { className: "divide-y divide-slate-100" },
                heldCarts.map(h => e("div", { key: h.id, className: "py-3 flex items-center justify-between" },
                    e("div", null,
                        e("div", { className: "font-mono font-bold text-[#072946]" }, h.ref + " • " + h.customer),
                        e("div", { className: "text-[11px] text-slate-400" }, h.itemsCount + " items • Dispensed by " + h.cashier)
                    ),
                    e("div", { className: "flex items-center gap-3" },
                        e("span", { className: "font-mono font-black text-[#E11D48] text-sm" }, "₦" + h.total.toLocaleString()),
                        e("button", { onClick: () => onRecall(h), className: "px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs cursor-pointer transition-colors" }, "Clear & Pay")
                    )
                ))
            )
        )
    );
}

// ─────────────────────────────────────────────────────────────
// VIEW 10: REPORTS - MASTER BI
// ─────────────────────────────────────────────────────────────
function ReportsAllView({ sales, inventory }) {
    const totalRev = sales.reduce((sum, s) => sum + s.total, 0);

    return e("div", { className: "flex-1 p-6 overflow-y-auto space-y-6" },
        e("div", { className: "pb-4 border-b border-slate-200" },
            e("h2", { className: "text-2xl font-black text-[#072946]" }, "📊 Master Business Intelligence & Reports Hub"),
            e("p", { className: "text-xs text-slate-500 font-medium mt-1" }, "Executive analytics, inventory valuation, and sales velocity breakdowns.")
        ),
        e("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6" },
            e("div", { className: "p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3" },
                e("div", { className: "text-xs font-bold uppercase text-slate-400" }, "Total Stock Valuation (Cost)"),
                e("div", { className: "text-3xl font-black font-mono text-[#072946]" }, "₦2,450,800"),
                e("p", { className: "text-xs text-slate-500" }, "Total active inventory across 10 hospital categories.")
            ),
            e("div", { className: "p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3" },
                e("div", { className: "text-xs font-bold uppercase text-slate-400" }, "Retail Value Potential"),
                e("div", { className: "text-3xl font-black font-mono text-emerald-600" }, "₦3,280,000"),
                e("p", { className: "text-xs text-slate-500" }, "Projected gross profit margin: +33.8%")
            ),
            e("div", { className: "p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3" },
                e("div", { className: "text-xs font-bold uppercase text-slate-400" }, "Completed Sales Volume"),
                e("div", { className: "text-3xl font-black font-mono text-[#E11D48]" }, "₦" + totalRev.toLocaleString()),
                e("p", { className: "text-xs text-slate-500" }, sales.length + " transactions recorded in current shift.")
            )
        )
    );
}

// ─────────────────────────────────────────────────────────────
// VIEW 11: REPORTS - DAILY SALES
// ─────────────────────────────────────────────────────────────
function ReportsDailyView({ sales }) {
    return e("div", { className: "flex-1 p-6 overflow-y-auto space-y-6" },
        e("div", { className: "pb-4 border-b border-slate-200" },
            e("h2", { className: "text-2xl font-black text-[#072946]" }, "📅 Daily Sales Ledger & Tender Split"),
            e("p", { className: "text-xs text-slate-500 font-medium mt-1" }, "Hourly sales velocity categorized by payment channel.")
        ),
        e("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4" },
            e("h3", { className: "text-sm font-bold text-[#072946]" }, "Today's Payment Channel Distribution"),
            e("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4" },
                e("div", { className: "p-4 bg-emerald-50 rounded-xl border border-emerald-200" },
                    e("div", { className: "text-xs font-bold text-emerald-800" }, "Cash in Till"),
                    e("div", { className: "text-xl font-black font-mono text-emerald-700 mt-1" }, "₦17,000.00")
                ),
                e("div", { className: "p-4 bg-cyan-50 rounded-xl border border-cyan-200" },
                    e("div", { className: "text-xs font-bold text-cyan-800" }, "Moniepoint POS"),
                    e("div", { className: "text-xl font-black font-mono text-cyan-700 mt-1" }, "₦10,900.00")
                ),
                e("div", { className: "p-4 bg-purple-50 rounded-xl border border-purple-200" },
                    e("div", { className: "text-xs font-bold text-purple-800" }, "Direct Bank Transfer"),
                    e("div", { className: "text-xl font-black font-mono text-purple-700 mt-1" }, "₦5,600.00")
                )
            )
        )
    );
}

// ─────────────────────────────────────────────────────────────
// VIEW 12: REPORTS - EXPIRY ALERTS (FEFO)
// ─────────────────────────────────────────────────────────────
function ReportsExpiryView({ inventory }) {
    return e("div", { className: "flex-1 p-6 overflow-y-auto space-y-6" },
        e("div", { className: "pb-4 border-b border-slate-200" },
            e("h2", { className: "text-2xl font-black text-[#072946]" }, "⚠️ FEFO Expiry Matrix & Risk Tracker"),
            e("p", { className: "text-xs text-slate-500 font-medium mt-1" }, "First-Expired, First-Out auditing to prevent inventory expiration losses.")
        ),
        e("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" },
            e("table", { className: "w-full text-left text-xs" },
                e("thead", { className: "bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-200" },
                    e("tr", null,
                        e("th", { className: "py-3 px-4" }, "Product"),
                        e("th", { className: "py-3 px-4" }, "Batch Ref"),
                        e("th", { className: "py-3 px-4" }, "Expiry Date"),
                        e("th", { className: "py-3 px-4 text-center" }, "Stock at Risk"),
                        e("th", { className: "py-3 px-4 text-center" }, "Urgency Status")
                    )
                ),
                e("tbody", { className: "divide-y divide-slate-100 font-medium" },
                    inventory.map(item => e("tr", { key: item.id, className: "hover:bg-slate-50 transition-colors" },
                        e("td", { className: "py-3 px-4 font-bold text-[#072946]" }, item.name),
                        e("td", { className: "py-3 px-4 font-mono text-slate-500" }, item.batch),
                        e("td", { className: "py-3 px-4 font-mono font-bold" }, item.exp),
                        e("td", { className: "py-3 px-4 text-center font-mono font-bold" }, item.stock + " units"),
                        e("td", { className: "py-3 px-4 text-center" },
                            e("span", { className: `px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                item.exp.startsWith("2026") ? "bg-rose-100 text-rose-800 border border-rose-300 animate-pulse" :
                                item.exp.startsWith("2027") ? "bg-amber-100 text-amber-800 border border-amber-300" :
                                "bg-emerald-50 text-emerald-700"
                            }` }, item.exp.startsWith("2026") ? "CRITICAL (<60d)" : item.exp.startsWith("2027") ? "MONITOR (<1yr)" : "GOOD (>1yr)")
                        )
                    ))
                )
            )
        )
    );
}

// ─────────────────────────────────────────────────────────────
// VIEW 13: REPORTS - CUSTOMER SALES
// ─────────────────────────────────────────────────────────────
function ReportsCustomersView({ cards }) {
    return e("div", { className: "flex-1 p-6 overflow-y-auto space-y-6" },
        e("div", { className: "pb-4 border-b border-slate-200" },
            e("h2", { className: "text-2xl font-black text-[#072946]" }, "👤 Customer Purchase Velocity & Debts"),
            e("p", { className: "text-xs text-slate-500 font-medium mt-1" }, "Patient loyalty standing, average ticket sizes, and credit exposures.")
        ),
        e("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
            cards.map(c => e("div", { key: c.id, className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center" },
                e("div", null,
                    e("div", { className: "font-bold text-[#072946] text-sm" }, c.name),
                    e("div", { className: "text-xs text-slate-500 font-mono mt-0.5" }, c.phone + " • Tier: " + c.tier),
                    e("div", { className: "text-xs font-bold text-emerald-600 mt-2" }, "Wallet: ₦" + c.balance.toLocaleString())
                ),
                e("div", { className: "text-right" },
                    e("div", { className: "text-xs text-slate-400 font-bold uppercase" }, "Bashi Debt"),
                    e("div", { className: "text-lg font-black font-mono text-[#E11D48]" }, "₦" + c.debt.toLocaleString()),
                    e("span", { className: "text-[10px] text-slate-400" }, "Limit: ₦" + c.limit.toLocaleString())
                )
            ))
        )
    );
}

// ─────────────────────────────────────────────────────────────
// VIEW 14: FINANCE - ACCOUNTING
// ─────────────────────────────────────────────────────────────
function FinanceAccountingView({ sales, expenses }) {
    const rev = sales.reduce((sum, s) => sum + s.total, 0);
    const exp = expenses.reduce((sum, ex) => sum + ex.amount, 0);
    const net = rev - exp;

    return e("div", { className: "flex-1 p-6 overflow-y-auto space-y-6" },
        e("div", { className: "pb-4 border-b border-slate-200" },
            e("h2", { className: "text-2xl font-black text-[#072946]" }, "💰 General Ledger & Shift Accounts"),
            e("p", { className: "text-xs text-slate-500 font-medium mt-1" }, "Cash flow summary, operational expenditure balancing, and daily P&L.")
        ),
        e("div", { className: "max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4" },
            e("h3", { className: "text-sm font-black text-[#072946] uppercase tracking-wide" }, "Daily Income Statement Summary"),
            e("div", { className: "space-y-3 text-xs" },
                e("div", { className: "flex justify-between py-2 border-b border-slate-100" },
                    e("span", { className: "text-slate-600 font-semibold" }, "Gross Dispensing Revenue:"),
                    e("span", { className: "font-mono font-bold text-emerald-600 text-sm" }, "₦" + rev.toLocaleString())
                ),
                e("div", { className: "flex justify-between py-2 border-b border-slate-100" },
                    e("span", { className: "text-slate-600 font-semibold" }, "Operating Expenses Incurred:"),
                    e("span", { className: "font-mono font-bold text-rose-600 text-sm" }, "-₦" + exp.toLocaleString())
                ),
                e("div", { className: "flex justify-between py-2 border-b border-slate-200" },
                    e("span", { className: "text-slate-600 font-semibold" }, "Estimated Cost of Goods Sold (COGS):"),
                    e("span", { className: "font-mono font-bold text-slate-600 text-sm" }, "₦" + Math.round(rev * 0.7).toLocaleString())
                ),
                e("div", { className: "flex justify-between py-3 bg-slate-50 px-4 rounded-xl text-sm" },
                    e("span", { className: "font-black text-[#072946]" }, "Net Operating Cashflow:"),
                    e("span", { className: `font-black font-mono ${net >= 0 ? "text-emerald-700" : "text-rose-700"}` }, "₦" + net.toLocaleString())
                )
            )
        )
    );
}

// ─────────────────────────────────────────────────────────────
// VIEW 15: FINANCE - EXPENSES
// ─────────────────────────────────────────────────────────────
function FinanceExpensesView({ expenses, setExpenses }) {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [cat, setCat] = useState("Utilities");

    const addExpense = (e) => {
        e.preventDefault();
        if (!title || !amount) return;
        const newExp = {
            id: Date.now(),
            title,
            category: cat,
            amount: parseFloat(amount),
            approvedBy: "Dr. Godwin",
            date: "Just now"
        };
        setExpenses([newExp, ...expenses]);
        setTitle("");
        setAmount("");
        alert("Expense voucher recorded!");
    };

    return e("div", { className: "flex-1 p-6 overflow-y-auto space-y-6" },
        e("div", { className: "pb-4 border-b border-slate-200" },
            e("h2", { className: "text-2xl font-black text-[#072946]" }, "📋 Pharmacy Operating Expenses"),
            e("p", { className: "text-xs text-slate-500 font-medium mt-1" }, "Log petty cash vouchers, fuel, and supplies incurred during shifts.")
        ),
        e("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6" },
            e("form", { onSubmit: addExpense, className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs" },
                e("h3", { className: "text-sm font-black text-[#072946] uppercase tracking-wide" }, "Record New Expense Voucher"),
                e("div", null,
                    e("label", { className: "block text-slate-500 mb-1 font-semibold" }, "Voucher Description:"),
                    e("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), placeholder: "e.g. Generator Fuel", className: "w-full p-2 border border-slate-300 rounded-lg" })
                ),
                e("div", null,
                    e("label", { className: "block text-slate-500 mb-1 font-semibold" }, "Amount (₦):"),
                    e("input", { type: "number", value: amount, onChange: (e) => setAmount(e.target.value), placeholder: "5000", className: "w-full p-2 border border-slate-300 rounded-lg font-mono" })
                ),
                e("div", null,
                    e("label", { className: "block text-slate-500 mb-1 font-semibold" }, "Category:"),
                    e("select", { value: cat, onChange: (e) => setCat(e.target.value), className: "w-full p-2 bg-white border border-slate-300 rounded-lg" },
                        e("option", null, "Utilities"),
                        e("option", null, "Supplies"),
                        e("option", null, "Maintenance"),
                        e("option", null, "Staff Welfare")
                    )
                ),
                e("button", { type: "submit", className: "w-full py-2.5 bg-[#072946] hover:bg-[#0A3A63] text-white rounded-lg font-bold text-xs shadow-md transition-colors cursor-pointer" }, "Save Voucher")
            ),
            e("div", { className: "lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" },
                e("table", { className: "w-full text-left text-xs" },
                    e("thead", { className: "bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-200" },
                        e("tr", null,
                            e("th", { className: "py-3 px-4" }, "Voucher"),
                            e("th", { className: "py-3 px-4" }, "Category"),
                            e("th", { className: "py-3 px-4 text-right" }, "Amount (₦)"),
                            e("th", { className: "py-3 px-4" }, "Authorized By"),
                            e("th", { className: "py-3 px-4 font-mono text-slate-400 text-[11px]" }, "Timestamp")
                        )
                    ),
                    e("tbody", { className: "divide-y divide-slate-100 font-medium" },
                        expenses.map(ex => e("tr", { key: ex.id, className: "hover:bg-slate-50 transition-colors" },
                            e("td", { className: "py-3 px-4 font-bold text-[#072946]" }, ex.title),
                            e("td", { className: "py-3 px-4 text-slate-500 text-[11px]" }, ex.category),
                            e("td", { className: "py-3 px-4 font-mono font-black text-right text-rose-600" }, "₦" + ex.amount.toLocaleString()),
                            e("td", { className: "py-3 px-4 text-slate-600" }, ex.approvedBy),
                            e("td", { className: "py-3 px-4 font-mono text-slate-400 text-[11px]" }, ex.date)
                        ))
                    )
                )
            )
        )
    );
}

// ─────────────────────────────────────────────────────────────
// VIEW 16: USERS
// ─────────────────────────────────────────────────────────────
function UsersView() {
    const users = [
        { id: 1, name: "Dr. Godwin Udele", role: "Super Admin", email: "drgodwinudele@gmail.com", status: "Active", terminal: "LAN Node 01" },
        { id: 2, name: "Pharmacist Grace", role: "Superintendent Pharmacist", email: "grace.pharm@emerald.ng", status: "Active", terminal: "LAN Node 02" },
        { id: 3, name: "Blessing Okon", role: "Lead Cashier", email: "blessing@emerald.ng", status: "Active", terminal: "Cashier Desk 1" },
        { id: 4, name: "Samuel Audu", role: "Dispensing Assistant", email: "samuel@emerald.ng", status: "Active", terminal: "Sales Floor 1" }
    ];

    return e("div", { className: "flex-1 p-6 overflow-y-auto space-y-6" },
        e("div", { className: "pb-4 border-b border-slate-200" },
            e("h2", { className: "text-2xl font-black text-[#072946]" }, "👥 User Staff Accounts & RBAC Permissions"),
            e("p", { className: "text-xs text-slate-500 font-medium mt-1" }, "Authorized operators permitted on the offline LAN mesh network.")
        ),
        e("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" },
            e("table", { className: "w-full text-left text-xs" },
                e("thead", { className: "bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-200" },
                    e("tr", null,
                        e("th", { className: "py-3 px-4" }, "User Name"),
                        e("th", { className: "py-3 px-4" }, "Assigned Role"),
                        e("th", { className: "py-3 px-4" }, "Email / Username"),
                        e("th", { className: "py-3 px-4" }, "Terminal"),
                        e("th", { className: "py-3 px-4 text-center" }, "Status")
                    )
                ),
                e("tbody", { className: "divide-y divide-slate-100 font-medium" },
                    users.map(u => e("tr", { key: u.id, className: "hover:bg-slate-50 transition-colors" },
                        e("td", { className: "py-3 px-4 font-bold text-[#072946]" }, u.name),
                        e("td", { className: "py-3 px-4" },
                            e("span", { className: "px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800" }, u.role)
                        ),
                        e("td", { className: "py-3 px-4 font-mono text-slate-600" }, u.email),
                        e("td", { className: "py-3 px-4 font-mono text-slate-500 text-[11px]" }, u.terminal),
                        e("td", { className: "py-3 px-4 text-center" },
                            e("span", { className: "px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700" }, u.status)
                        )
                    ))
                )
            )
        )
    );
}

// ─────────────────────────────────────────────────────────────
// VIEW 17: SETTINGS
// ─────────────────────────────────────────────────────────────
function SettingsView() {
    return e("div", { className: "flex-1 p-6 overflow-y-auto space-y-6" },
        e("div", { className: "pb-4 border-b border-slate-200" },
            e("h2", { className: "text-2xl font-black text-[#072946]" }, "⚙️ System Configuration & 80mm ESC/POS Settings"),
            e("p", { className: "text-xs text-slate-500 font-medium mt-1" }, "Core store metadata, receipt printers, and LAN network bindings.")
        ),
        e("div", { className: "max-w-2xl bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs" },
            e("div", null,
                e("label", { className: "block text-slate-500 font-bold mb-1" }, "Pharmacy Registered Business Name:"),
                e("input", { type: "text", defaultValue: "EII PHARMACY & STORES LTD", className: "w-full p-2.5 border border-slate-300 rounded-lg font-bold text-[#072946]" })
            ),
            e("div", null,
                e("label", { className: "block text-slate-500 font-bold mb-1" }, "Receipt Address & Contact:"),
                e("textarea", { rows: 2, defaultValue: "Plot 12 Commercial Avenue, Ikeja, Lagos\nTel: +234 803 123 4567 • info@emeraldpos.ng", className: "w-full p-2.5 border border-slate-300 rounded-lg" })
            ),
            e("div", { className: "grid grid-cols-2 gap-4" },
                e("div", null,
                    e("label", { className: "block text-slate-500 font-bold mb-1" }, "ESC/POS Thermal Paper Size:"),
                    e("select", { className: "w-full p-2.5 bg-white border border-slate-300 rounded-lg font-bold" },
                        e("option", null, "80mm Standard Thermal (ESC/POS)"),
                        e("option", null, "58mm Compact Thermal")
                    )
                ),
                e("div", null,
                    e("label", { className: "block text-slate-500 font-bold mb-1" }, "Active Theme:"),
                    e("select", { className: "w-full p-2.5 bg-white border border-slate-300 rounded-lg font-bold" },
                        e("option", null, "Royal Metallic Blue (#072946)")
                    )
                )
            ),
            e("div", { className: "pt-3" },
                e("button", { onClick: () => alert("Configuration settings saved successfully."), className: "px-5 py-2.5 bg-[#072946] hover:bg-[#0A3A63] text-white rounded-lg font-bold text-xs shadow-md transition-colors cursor-pointer" }, "Save Settings")
            )
        )
    );
}

// ─────────────────────────────────────────────────────────────
// MODAL: PAYMENT CHECKOUT
// ─────────────────────────────────────────────────────────────
function PaymentModal({ subtotal, paymentMethod, setPaymentMethod, moniepointRrn, setMoniepointRrn, onClose, onConfirm }) {
    return e("div", { className: "fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs" },
        e("div", { className: "bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150" },
            e("div", { className: "flex justify-between items-center mb-4 pb-3 border-b border-slate-100" },
                e("h3", { className: "text-base font-black text-[#072946] uppercase" }, "Tender Payment Settlement"),
                e("button", { onClick: onClose, className: "text-slate-400 hover:text-slate-700 font-bold" }, "✕")
            ),
            e("div", { className: "text-center my-4 p-4 bg-slate-50 rounded-xl" },
                e("div", { className: "text-xs font-bold uppercase text-slate-400" }, "Total Payable Amount"),
                e("div", { className: "text-3xl font-black font-mono text-[#E11D48] mt-1" }, "₦" + subtotal.toLocaleString())
            ),
            e("div", { className: "space-y-3 my-4" },
                e("label", { className: "block text-xs font-bold uppercase text-slate-500" }, "Select Payment Channel:"),
                e("div", { className: "grid grid-cols-3 gap-2" },
                    ["Cash", "Moniepoint POS", "Bank Transfer"].map(m => e("button", {
                        key: m,
                        type: "button",
                        onClick: () => setPaymentMethod(m),
                        className: `py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            paymentMethod === m 
                                ? "bg-[#072946] text-white border-[#072946] shadow-sm" 
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`
                    }, m))
                ),
                paymentMethod === "Moniepoint POS" && e("div", { className: "pt-2" },
                    e("label", { className: "block text-[11px] font-bold text-slate-500 mb-1" }, "Moniepoint Terminal RRN / STAN Reference:"),
                    e("input", {
                        type: "text",
                        placeholder: "e.g. 98421044",
                        value: moniepointRrn,
                        onChange: (e) => setMoniepointRrn(e.target.value),
                        className: "w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono focus:border-[#00D2FF] focus:outline-none"
                    })
                )
            ),
            e("div", { className: "flex gap-2 mt-6" },
                e("button", { onClick: onClose, className: "flex-1 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer" }, "Cancel"),
                e("button", { onClick: onConfirm, className: "flex-1 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md cursor-pointer transition-all" }, "Confirm & Print Receipt")
            )
        )
    );
}

// ─────────────────────────────────────────────────────────────
// MODAL: 80MM ESC/POS RECEIPT
// ─────────────────────────────────────────────────────────────
function ReceiptModal({ sale, onClose }) {
    return e("div", { className: "fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs" },
        e("div", { className: "bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 flex flex-col items-center" },
            // Receipt Canvas
            e("div", { className: "w-full bg-[#FCFDFD] border border-dashed border-slate-300 p-5 rounded-lg text-slate-800 receipt-body leading-tight" },
                e("div", { className: "text-center mb-3" },
                    e("div", { className: "font-black text-xs uppercase" }, "EII PHARMACY & STORES LTD"),
                    e("div", { className: "text-[9px] text-slate-500" }, "Plot 12 Commercial Avenue, Ikeja"),
                    e("div", { className: "text-[9px] text-slate-500" }, "Tel: +234 803 123 4567"),
                    e("div", { className: "border-b border-dashed border-slate-300 my-2" }),
                    e("div", { className: "flex justify-between text-[10px]" },
                        e("span", null, "REF: " + sale.ref),
                        e("span", null, sale.date)
                    ),
                    e("div", { className: "text-left text-[9px] text-slate-500" }, "Dispenser: " + (sale.cashier || "Godwin Udele"))
                ),
                e("div", { className: "border-b border-dashed border-slate-300 my-2" }),
                e("div", { className: "space-y-1.5" },
                    sale.items.map((it, idx) => e("div", { key: idx, className: "flex justify-between text-[10px]" },
                        e("span", null, it.qty + "x " + it.name),
                        e("span", { className: "font-bold" }, "₦" + (it.price * it.qty).toLocaleString())
                    ))
                ),
                e("div", { className: "border-b border-dashed border-slate-300 my-2" }),
                e("div", { className: "flex justify-between font-black text-xs text-[#072946]" },
                    e("span", null, "TOTAL AMOUNT:"),
                    e("span", null, "₦" + sale.total.toLocaleString())
                ),
                e("div", { className: "flex justify-between text-[10px] text-slate-500 mt-1" },
                    e("span", null, "Tender:"),
                    e("span", null, sale.method)
                ),
                sale.rrn && e("div", { className: "text-[9px] text-slate-400 mt-0.5" }, "RRN: " + sale.rrn),
                e("div", { className: "border-b border-dashed border-slate-300 my-2" }),
                e("div", { className: "text-center text-[9px] text-slate-400 mt-2" },
                    "Medications sold are non-refundable after 48h.",
                    e("br"),
                    "Thank you for choosing Emerald POS!"
                )
            ),
            e("div", { className: "flex gap-2 w-full mt-4" },
                e("button", { onClick: () => window.print(), className: "flex-1 py-2 bg-[#072946] text-white rounded-lg text-xs font-bold cursor-pointer" }, "🖨️ Print 80mm"),
                e("button", { onClick: onClose, className: "flex-1 py-2 bg-slate-200 text-slate-800 rounded-lg text-xs font-bold cursor-pointer" }, "Done")
            )
        )
    );
}

// ─────────────────────────────────────────────────────────────
// MODAL: Z-REPORT
// ─────────────────────────────────────────────────────────────
function ZReportModal({ dailySales, inventory, onClose }) {
    const totalSales = dailySales.reduce((sum, s) => sum + s.total, 0);

    return e("div", { className: "fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs" },
        e("div", { className: "bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200" },
            e("div", { className: "flex justify-between items-center mb-3 pb-2 border-b border-slate-100" },
                e("h3", { className: "text-sm font-black text-[#072946] uppercase" }, "📊 Z-Report Shift Reconciliation"),
                e("button", { onClick: onClose, className: "text-slate-400 hover:text-slate-700 font-bold" }, "✕")
            ),
            e("div", { className: "space-y-3 text-xs" },
                e("div", { className: "p-3 bg-slate-50 rounded-xl space-y-1" },
                    e("div", { className: "flex justify-between text-slate-500" }, e("span", null, "Terminal ID:"), e("span", { className: "font-mono font-bold text-slate-700" }, "NODE-01 (LAN)")),
                    e("div", { className: "flex justify-between text-slate-500" }, e("span", null, "Supervisor:"), e("span", { className: "font-bold text-slate-700" }, "Dr. Godwin Udele")),
                    e("div", { className: "flex justify-between text-slate-500" }, e("span", null, "Shift Date:"), e("span", { className: "font-mono text-slate-700" }, new Date().toLocaleDateString()))
                ),
                e("div", { className: "p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center" },
                    e("div", { className: "text-[11px] font-bold text-emerald-800 uppercase" }, "Total Shift Revenue"),
                    e("div", { className: "text-2xl font-black font-mono text-emerald-700 mt-1" }, "₦" + totalSales.toLocaleString())
                ),
                e("div", { className: "text-[11px] text-slate-500 text-center" }, "Total Invoices Finalized: " + dailySales.length),
                e("button", { onClick: onClose, className: "w-full py-2.5 bg-[#072946] hover:bg-[#0A3A63] text-white rounded-xl text-xs font-bold cursor-pointer" }, "Close Z-Report")
            )
        )
    );
}

// Mount App
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(e(PharmacyPOSApp));


// ─────────────────────────────────────────────────────────────
// VIEW: PROFIT & LOSS ANALYSIS (Matches Emerald-v2 Live Spec)
// ─────────────────────────────────────────────────────────────
function ProfitLossView({ sales, expenses, inventory, onNavigate }) {
    const [startDate, setStartDate] = useState("2026-09-01");
    const [endDate, setEndDate] = useState("2026-09-05");

    // Financial calculations
    const revenue = 3485200;
    const cogs = 2240000;
    const grossProfit = revenue - cogs;
    const grossMargin = ((grossProfit / revenue) * 100).toFixed(1);

    const operationalExpenses = 342000;
    const netProfit = grossProfit - operationalExpenses;
    const netMargin = ((netProfit / revenue) * 100).toFixed(1);

    const totalCostWorth = 8450000;
    const totalRetailWorth = 12180000;
    const unrealizedMargin = totalRetailWorth - totalCostWorth;

    return e("div", { className: "flex-1 p-6 overflow-y-auto space-y-6" },
        // Header Banner with Date Picker & Export Actions
        e("div", { className: "flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-slate-200 gap-4" },
            e("div", null,
                e("div", { className: "flex items-center gap-2" },
                    e("h2", { className: "text-3xl font-black text-[#072946] tracking-tight uppercase" }, "Profit & Loss Analysis"),
                    e("span", { className: "px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300" }, "AUDIT STATUS: LIVE")
                ),
                e("p", { className: "text-xs font-mono text-slate-500 font-medium mt-1 pl-1 border-l-2 border-[#00D2FF]" },
                    "PROFIT & LOSS VERIFICATION — STATUTORY IFRS PHARMACY REPORTING"
                )
            ),
            e("div", { className: "flex flex-wrap items-center gap-2.5 text-xs font-medium" },
                e("div", { className: "flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-300 shadow-sm" },
                    e("span", { className: "text-slate-400 font-bold uppercase text-[10px]" }, "From:"),
                    e("input", {
                        type: "date",
                        value: startDate,
                        onChange: (e) => setStartDate(e.target.value),
                        className: "font-mono font-bold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                    })
                ),
                e("span", { className: "text-slate-400 font-bold" }, "→"),
                e("div", { className: "flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-300 shadow-sm" },
                    e("span", { className: "text-slate-400 font-bold uppercase text-[10px]" }, "To:"),
                    e("input", {
                        type: "date",
                        value: endDate,
                        onChange: (e) => setEndDate(e.target.value),
                        className: "font-mono font-bold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                    })
                ),
                e("button", {
                    onClick: () => alert("P&L statement dynamically refreshed for range: " + startDate + " to " + endDate),
                    className: "px-4 py-2 bg-[#072946] hover:bg-[#0A3A63] text-white rounded-xl font-bold shadow-sm transition-all cursor-pointer"
                }, "Generate Statement"),
                e("button", {
                    onClick: () => alert("Exporting Profit & Loss Ledger to Microsoft Excel (.xlsx)..."),
                    className: "px-4 py-2 bg-white border border-slate-300 hover:border-[#00D2FF] text-[#072946] rounded-xl font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                },
                    e("span", null, "📊 Export Spreadsheet")
                )
            )
        ),

        // Core 4 Summary Metric Cards (Glow style matching real app)
        e("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" },
            // Card 1: Gross Income
            e("div", { className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between h-40 group hover:border-[#0284C7] transition-all" },
                e("div", null,
                    e("div", { className: "text-[11px] font-bold font-mono uppercase tracking-wider text-slate-400" }, "Gross Income"),
                    e("div", { className: "text-2xl font-black font-mono text-[#072946] mt-2" }, "₦" + revenue.toLocaleString() + ".00")
                ),
                e("div", { className: "flex justify-between items-center text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest pt-2 border-t border-slate-100" },
                    e("span", null, "Total Revenue"),
                    e("span", { className: "text-emerald-600" }, "100.0%")
                )
            ),

            // Card 2: Cost of Sales (COGS)
            e("div", { className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between h-40 group hover:border-amber-500 transition-all" },
                e("div", null,
                    e("div", { className: "text-[11px] font-bold font-mono uppercase tracking-wider text-amber-600" }, "Direct Costs (COGS)"),
                    e("div", { className: "text-2xl font-black font-mono text-amber-600 mt-2" }, "₦" + cogs.toLocaleString() + ".00")
                ),
                e("div", { className: "flex justify-between items-center text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest pt-2 border-t border-slate-100" },
                    e("span", null, "Cost of Goods"),
                    e("span", { className: "text-amber-600" }, "64.3%")
                )
            ),

            // Card 3: Operating Overheads
            e("div", { className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between h-40 group hover:border-rose-400 transition-all" },
                e("div", null,
                    e("div", { className: "text-[11px] font-bold font-mono uppercase tracking-wider text-[#F43F5E]" }, "Operational Overheads"),
                    e("div", { className: "text-2xl font-black font-mono text-[#F43F5E] mt-2" }, "₦" + operationalExpenses.toLocaleString() + ".00")
                ),
                e("div", { className: "flex justify-between items-center text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest pt-2 border-t border-slate-100" },
                    e("span", null, "OPEX Total"),
                    e("span", { className: "text-rose-600" }, "9.8%")
                )
            ),

            // Card 4: Bottom Line (Net Profit)
            e("div", { className: "bg-white p-5 rounded-2xl border-2 border-emerald-500 shadow-md relative overflow-hidden flex flex-col justify-between h-40 bg-gradient-to-br from-white to-emerald-50/40" },
                e("div", null,
                    e("div", { className: "text-[11px] font-bold font-mono uppercase tracking-wider text-emerald-700" }, "Bottom Line Profit"),
                    e("div", { className: "text-2xl font-black font-mono text-emerald-700 mt-2" }, "+₦" + netProfit.toLocaleString() + ".00")
                ),
                e("div", { className: "flex justify-between items-center text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-widest pt-2 border-t border-emerald-200" },
                    e("span", null, "Net Margin"),
                    e("span", { className: "px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-extrabold" }, "+" + netMargin + "%")
                )
            )
        ),

        // Store Inventory Valuation Metrics
        e("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5" },
            e("div", { className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-36" },
                e("div", null,
                    e("div", { className: "text-[11px] font-bold font-mono uppercase tracking-wider text-[#072946]" }, "Inventory Investment (Wholesale Cost)"),
                    e("div", { className: "text-2xl font-black font-mono text-[#072946] mt-1.5" }, "₦" + totalCostWorth.toLocaleString() + ".00")
                ),
                e("div", { className: "text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-100 flex justify-between" },
                    e("span", null, "Total Active Capital Tied in Stock"),
                    e("span", { className: "font-mono font-bold text-[#072946]" }, "10 Hospital SKUs")
                )
            ),
            e("div", { className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-36" },
                e("div", null,
                    e("div", { className: "text-[11px] font-bold font-mono uppercase tracking-wider text-[#004953]" }, "Expected Revenue (Total Retail Worth)"),
                    e("div", { className: "text-2xl font-black font-mono text-emerald-600 mt-1.5" }, "₦" + totalRetailWorth.toLocaleString() + ".00")
                ),
                e("div", { className: "text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-100 flex justify-between" },
                    e("span", null, "Unrealized Inventory Gross Margin:"),
                    e("span", { className: "font-mono font-bold text-emerald-600" }, "+₦" + unrealizedMargin.toLocaleString() + " (+44.1%)")
                )
            )
        ),

        // Financial Breakdown Matrix Table (Mirroring live Emerald-v2 matrix)
        e("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" },
            e("div", { className: "px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between" },
                e("div", { className: "text-xs font-black text-[#072946] uppercase tracking-wider" }, "Comprehensive Financial Breakdown Matrix"),
                e("span", { className: "px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#072946]/10 text-[#072946]" }, "AUDIT PROTOCOL VERIFIED")
            ),
            e("div", { className: "divide-y divide-slate-100 text-xs" },
                // Row 1: Gross Revenue
                e("div", { className: "p-4 flex items-center justify-between hover:bg-slate-50 transition-colors" },
                    e("div", { className: "flex items-center gap-3" },
                        e("div", { className: "w-8 h-8 rounded-lg bg-sky-100 text-[#0284C7] font-black flex items-center justify-center text-xs" }, "R"),
                        e("div", null,
                            e("div", { className: "font-bold text-[#072946]" }, "Gross Dispensing Revenue"),
                            e("div", { className: "text-[11px] text-slate-400" }, "Sum of all patient transactions finalized on edge terminals")
                        )
                    ),
                    e("div", { className: "text-right font-mono" },
                        e("div", { className: "font-black text-sm text-[#072946]" }, "₦" + revenue.toLocaleString() + ".00"),
                        e("div", { className: "text-[10px] text-slate-400 font-bold" }, "100.0% of turnover")
                    )
                ),

                // Row 2: Cost of Sales
                e("div", { className: "p-4 flex items-center justify-between hover:bg-slate-50 transition-colors" },
                    e("div", { className: "flex items-center gap-3" },
                        e("div", { className: "w-8 h-8 rounded-lg bg-amber-100 text-amber-700 font-black flex items-center justify-center text-xs" }, "C"),
                        e("div", null,
                            e("div", { className: "font-bold text-amber-700" }, "Less: Cost of Goods Sold (COGS)"),
                            e("div", { className: "text-[11px] text-slate-400" }, "Direct pharmaceutical acquisition cost for dispensed items")
                        )
                    ),
                    e("div", { className: "text-right font-mono" },
                        e("div", { className: "font-black text-sm text-amber-600" }, "-₦" + cogs.toLocaleString() + ".00"),
                        e("div", { className: "text-[10px] text-amber-600 font-bold" }, "64.3% cost ratio")
                    )
                ),

                // Row 3: Gross Profit
                e("div", { className: "p-4 flex items-center justify-between bg-sky-50/50" },
                    e("div", { className: "flex items-center gap-3" },
                        e("div", { className: "w-8 h-8 rounded-lg bg-[#00D2FF]/20 text-[#072946] font-black flex items-center justify-center text-xs" }, "G"),
                        e("div", null,
                            e("div", { className: "font-bold text-[#072946]" }, "Gross Profit"),
                            e("div", { className: "text-[11px] text-slate-500" }, "Gross Margin before operating expenses deduction")
                        )
                    ),
                    e("div", { className: "text-right font-mono" },
                        e("div", { className: "font-black text-sm text-[#072946]" }, "₦" + grossProfit.toLocaleString() + ".00"),
                        e("div", { className: "text-[10px] text-emerald-600 font-bold" }, grossMargin + "% Gross Margin")
                    )
                ),

                // Row 4: Operating Expenses
                e("div", { className: "p-4 flex items-center justify-between hover:bg-slate-50 transition-colors" },
                    e("div", { className: "flex items-center gap-3" },
                        e("div", { className: "w-8 h-8 rounded-lg bg-rose-100 text-rose-700 font-black flex items-center justify-center text-xs" }, "E"),
                        e("div", null,
                            e("div", { className: "font-bold text-rose-700" }, "Less: Operating Overheads (OPEX)"),
                            e("div", { className: "text-[11px] text-slate-400" }, "Generator fuel, dispensary staff, thermal paper rolls, utilities")
                        )
                    ),
                    e("div", { className: "text-right font-mono" },
                        e("div", { className: "font-black text-sm text-rose-600" }, "-₦" + operationalExpenses.toLocaleString() + ".00"),
                        e("div", { className: "text-[10px] text-rose-500 font-bold" }, "9.8% OPEX load")
                    )
                ),

                // Row 5: Net Profit (Bottom line)
                e("div", { className: "p-4 flex items-center justify-between bg-emerald-50/70 border-t-2 border-emerald-300" },
                    e("div", { className: "flex items-center gap-3" },
                        e("div", { className: "w-8 h-8 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center text-xs shadow-sm" }, "N"),
                        e("div", null,
                            e("div", { className: "text-sm font-black text-emerald-900 uppercase" }, "Net Operating Profit / Bottom Line"),
                            e("div", { className: "text-[11px] text-emerald-700" }, "Net earnings retained after full inventory & overhead clearance")
                        )
                    ),
                    e("div", { className: "text-right font-mono" },
                        e("div", { className: "font-black text-lg text-emerald-800" }, "+₦" + netProfit.toLocaleString() + ".00"),
                        e("div", { className: "text-[11px] text-emerald-700 font-bold" }, "+" + netMargin + "% Net Margin")
                    )
                )
            )
        ),

        // Payment Channel Settlement Topology
        e("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4" },
            e("div", { className: "flex justify-between items-center" },
                e("h3", { className: "text-xs font-black text-[#072946] uppercase tracking-wider" }, "Payment Topology & Channel Reconciliation"),
                e("span", { className: "text-xs font-mono font-bold text-slate-500" }, "Total: ₦" + revenue.toLocaleString())
            ),
            e("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium" },
                e("div", { className: "p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5" },
                    e("div", { className: "text-slate-500 text-[11px] font-bold uppercase" }, "💵 Cash in Hand (Till)"),
                    e("div", { className: "text-xl font-black font-mono text-[#072946]" }, "₦1,520,000.00"),
                    e("div", { className: "text-[10px] text-slate-400 font-mono" }, "43.6% of settled receipts")
                ),
                e("div", { className: "p-4 rounded-xl bg-cyan-50/60 border border-cyan-200 space-y-1.5" },
                    e("div", { className: "text-cyan-800 text-[11px] font-bold uppercase" }, "💳 Moniepoint POS / Cards"),
                    e("div", { className: "text-xl font-black font-mono text-[#0284C7]" }, "₦1,450,200.00"),
                    e("div", { className: "text-[10px] text-cyan-600 font-mono" }, "41.6% settled electronically")
                ),
                e("div", { className: "p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-1.5" },
                    e("div", { className: "text-purple-800 text-[11px] font-bold uppercase" }, "🏦 Direct Bank Transfer"),
                    e("div", { className: "text-xl font-black font-mono text-purple-700" }, "₦515,000.00"),
                    e("div", { className: "text-[10px] text-purple-600 font-mono" }, "14.8% bank credits verified")
                )
            )
        )
    );
}
