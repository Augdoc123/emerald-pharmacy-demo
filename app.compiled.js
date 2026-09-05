"use strict";

const e = React.createElement;
const { useState, useEffect, useRef } = React;

const INITIAL_INVENTORY = [
    { id: 1, name: "Tab Augmentin 625mg (GSK)", code: "AUG-625", price: 8500, cost: 7200, stock: 45, exp: "11/2027", batch: "B-AUG41", markup: "+18%" },
    { id: 2, name: "Coartem 80/480 Tablets", code: "COA-80", price: 3200, cost: 2400, stock: 80, exp: "04/2028", batch: "B-COA99", markup: "+33%" },
    { id: 3, name: "Paracetamol Syrup 100ml (Emzor)", code: "PCM-SYR", price: 650, cost: 450, stock: 120, exp: "09/2027", batch: "B-EMZ12", markup: "+44%" },
    { id: 4, name: "IV Ceftriaxone 1g Vial", code: "CEF-1G", price: 2100, cost: 1600, stock: 32, exp: "01/2027", batch: "B-CEF03", markup: "+31%" },
    { id: 5, name: "Ringers Lactate 500ml Infusion", code: "RL-500", price: 1400, cost: 1000, stock: 18, exp: "07/2028", batch: "B-RL88", markup: "+40%" },
    { id: 6, name: "Crepe Bandage 10cm x 4.5m", code: "CR-BDG", price: 950, cost: 650, stock: 65, exp: "12/2029", batch: "B-CRP01", markup: "+46%" },
    { id: 7, name: "Aboniki Balm 25g", code: "ABN-25", price: 1100, cost: 850, stock: 95, exp: "07/2029", batch: "B-ABN05", markup: "+29%" },
    { id: 8, name: "Acirab (Rabeprazole) 20mg", code: "ACI-20", price: 1100, cost: 800, stock: 40, exp: "10/2027", batch: "B-ACI12", markup: "+37%" },
    { id: 9, name: "Amatem Softgel", code: "AMT-SF", price: 3700, cost: 2900, stock: 26, exp: "04/2028", batch: "B-AMT77", markup: "+27%" }
];

const INITIAL_CARDS = [
    { id: 1, customer: "Alhaji Ibrahim Danjuma", type: "credit", card_no: "EM-CRD-1092", balance: 0, debt: 45200, limit: 100000 },
    { id: 2, customer: "Mrs. Fatima Noor Abdullahi", type: "prepaid", card_no: "EM-CRD-8821", balance: 24500, debt: 0, limit: 0 },
    { id: 3, customer: "Dr. Emmanuel Okon", type: "hybrid", card_no: "EM-CRD-4401", balance: 12000, debt: 15500, limit: 50000 }
];

function PharmacyPOSApp() {
    const [currentView, setCurrentView] = useState("POS");
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [inventory, setInventory] = useState(() => {
        const saved = localStorage.getItem("em_demo_inventory");
        return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    });
    const [cards, setCards] = useState(() => {
        const saved = localStorage.getItem("em_demo_cards");
        return saved ? JSON.parse(saved) : INITIAL_CARDS;
    });
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [paymentModal, setPaymentModal] = useState(false);
    const [receiptModal, setReceiptModal] = useState(false);
    const [zReportModal, setZReportModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [moniepointRrn, setMoniepointRrn] = useState("");
    const [completedSale, setCompletedSale] = useState(null);
    const [dailySales, setDailySales] = useState(() => {
        const saved = localStorage.getItem("em_demo_sales");
        return saved ? JSON.parse(saved) : [];
    });

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const navStructure = [
        { id: "Dashboard", label: "Dashboard", icon: "📊" },
        { id: "POS", label: "POS", icon: "⚡" },
        { id: "Inventory", label: "Inventory", icon: "📦" },
        { id: "Cards", label: "Cards Hub", icon: "💳" },
        { 
            id: "Sales", 
            label: "Sales", 
            icon: "🛒",
            children: [
                { id: "Seller History", label: "Seller History & Invoices" },
                { id: "Held Carts", label: "Pending Sales (Held Carts)", badge: "2" },
                { id: "Returns", label: "Returns & Refunds" }
            ]
        },
        { 
            id: "Reports", 
            label: "Reports", 
            icon: "📑",
            children: [
                { id: "Master BI", label: "Master BI Overview" },
                { id: "Shift Sales", label: "Daily Shift Sales" },
                { id: "FEFO Matrix", label: "FEFO Expiry Matrix", badge: "2 Due" }
            ]
        },
        { 
            id: "Finance", 
            label: "Finance", 
            icon: "⚖️",
            children: [
                { id: "General Ledger", label: "General Ledger Accounting" },
                { id: "PL Analysis", label: "Profit & Loss Statement (P&L)" },
                { id: "Expenses", label: "Operating Expenses" }
            ]
        },
        { id: "Users", label: "Users", icon: "👥" },
        { id: "Settings", label: "Settings", icon: "⚙️" }
    ];

    const filtered = inventory.filter(i => 
        i.name.toLowerCase().includes(search.toLowerCase()) || 
        i.code.toLowerCase().includes(search.toLowerCase())
    );

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

    const finalizeCheckout = () => {
        if (cart.length === 0) return;
        const saleRef = "EM-" + Math.floor(100000 + Math.random() * 900000);
        const record = {
            ref: saleRef,
            items: [...cart],
            total: subtotal,
            method: paymentMethod,
            rrn: paymentMethod === "Moniepoint POS" ? (moniepointRrn || "MP-REF-" + Math.floor(10000000 + Math.random()*90000000)) : null,
            date: new Date().toLocaleTimeString()
        };

        setInventory(prev => prev.map(inv => {
            const cItem = cart.find(c => c.id === inv.id);
            return cItem ? { ...inv, stock: inv.stock - cItem.qty } : inv;
        }));

        setCompletedSale(record);
        setDailySales(prev => [...prev, record]);
        setCart([]);
        setPaymentModal(false);
        setReceiptModal(true);
        setMoniepointRrn("");
    };

    return e("div", { className: "min-h-screen flex flex-col bg-[#F4F7FB] text-[#0B192C]" },
        // Top Master Header
        e("header", { className: "bg-[#051C30] text-white px-5 py-2.5 flex items-center justify-between border-b border-[#0C3E6A] shadow-md relative z-50" },
            e("div", { className: "flex items-center gap-3" },
                e("div", { className: "w-8 h-8 rounded-lg bg-[#00D2FF] text-[#072946] font-black flex items-center justify-center text-sm shadow-inner" }, "EM"),
                e("div", null,
                    e("div", { className: "text-sm font-black tracking-wider uppercase text-white flex items-center gap-2" },
                        "Emerald Point of Sales App",
                        e("span", { className: "text-[9px] px-1.5 py-0.5 rounded font-extrabold bg-[#00D2FF] text-[#072946] uppercase" }, "LAN POS")
                    ),
                    e("div", { className: "text-[11px] text-cyan-300 font-medium" },
                        "EII PHARMACY & STORES LTD • Offline-First Edge Node"
                    )
                )
            ),
            e("div", { className: "flex items-center gap-2.5" },
                e("div", { className: "text-xs flex items-center gap-1.5 bg-[#072946] px-3 py-1 rounded-full border border-slate-700" },
                    e("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse" }),
                    e("span", { className: "text-[11px] font-bold text-slate-200" }, "DR. GODWIN UDELE"),
                    e("span", { className: "text-[9px] px-1.5 py-0.5 rounded font-black glass-rose ml-1" }, "SUPER ADMIN")
                ),
                e("button", { 
                    onClick: () => setZReportModal(true),
                    className: "px-2.5 py-1 bg-[#0A3A63] hover:bg-[#00D2FF] hover:text-[#072946] border border-slate-600 rounded text-xs font-bold transition-all cursor-pointer" 
                }, "📋 Z-Report"),
                e("button", { 
                    onClick: () => {
                        localStorage.clear();
                        setInventory(INITIAL_INVENTORY);
                        setDailySales([]);
                        setCart([]);
                        alert("Demo state reset.");
                    },
                    className: "px-2 py-1 bg-rose-900/60 hover:bg-rose-700 border border-rose-500 text-white rounded text-xs font-bold transition-all cursor-pointer" 
                }, "Reset Demo")
            )
        ),

        // High-Stacking Context Navigation Bar with Unfolding Dropdown Protection
        e("nav", { className: "bg-[#072946] px-5 py-0 flex items-center justify-between border-b-2 border-[#00D2FF] shadow-lg relative z-40" },
            e("div", { className: "flex items-center space-x-0.5 overflow-x-auto scrollbar-none py-0.5" },
                navStructure.map(item => {
                    const hasSubmenu = item.children && item.children.length > 0;
                    const isOpen = activeDropdown === item.id;
                    const isTabActive = currentView === item.id || (hasSubmenu && item.children.some(c => c.id === currentView));

                    return e("div", {
                        key: item.id,
                        className: "relative group flex-shrink-0",
                        onMouseEnter: () => hasSubmenu && setActiveDropdown(item.id),
                        onMouseLeave: () => setActiveDropdown(null)
                    },
                        // Nav Button
                        e("button", {
                            onClick: () => {
                                if (hasSubmenu) {
                                    setActiveDropdown(isOpen ? null : item.id);
                                } else {
                                    setCurrentView(item.id);
                                    setActiveDropdown(null);
                                }
                            },
                            className: isTabActive
                                ? "px-3 py-2 text-xs font-black uppercase text-white bg-[#0A3A63] border-b-2 border-[#00D2FF] flex items-center gap-1.5 transition-all cursor-pointer"
                                : "px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-[#0A3A63]/60 flex items-center gap-1.5 transition-all cursor-pointer"
                        },
                            e("span", { className: "text-xs" }, item.icon),
                            e("span", { className: "whitespace-nowrap" }, item.label),
                            hasSubmenu && e("span", { className: "text-[9px] opacity-70 ml-0.5" }, "▼")
                        ),

                        // Dropdown Menu Container (Elevated Z-Index + Zero Hover Gap Bridge)
                        hasSubmenu && isOpen && e("div", {
                            className: "absolute top-full left-0 pt-1.5 w-64 z-[999] shadow-2xl",
                            style: { filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.3))" }
                        },
                            e("div", { className: "bg-white rounded-xl border border-slate-200 overflow-hidden py-1.5 divide-y divide-slate-100 shadow-2xl" },
                                item.children.map(sub => e("button", {
                                    key: sub.id,
                                    onClick: () => {
                                        setCurrentView(sub.id);
                                        setActiveDropdown(null);
                                    },
                                    className: "w-full px-4 py-2.5 text-left text-xs font-bold text-[#072946] hover:bg-[#F0F9FF] hover:text-[#0284C7] flex justify-between items-center transition-colors cursor-pointer"
                                },
                                    e("span", null, sub.label),
                                    sub.badge && e("span", { className: "px-2 py-0.5 rounded text-[10px] font-black font-mono " + (sub.badge.includes("Due") ? "glass-rose" : "glass-cyan") }, sub.badge)
                                ))
                            )
                        )
                    );
                })
            ),

            // Right Action Controls
            e("div", { className: "flex items-center gap-2 pl-2 flex-shrink-0" },
                e("span", { className: "text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1 hidden lg:flex" },
                    e("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-400" }),
                    "EDGE NODE: ONLINE"
                ),
                e("button", { 
                    onClick: () => setCurrentView("POS"),
                    className: "px-3 py-1 rounded bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-black uppercase shadow transition-all flex items-center gap-1 cursor-pointer" 
                }, "⚡ OPEN POS")
            )
        ),

        // Main App Floor (Explicit Lower Z-Index to Prevent Obscuring Dropdowns)
        e("main", { className: "flex-1 flex overflow-hidden relative z-10" },

            // VIEW 1: POS FLOOR
            currentView === "POS" && e("div", { className: "flex-1 flex overflow-hidden" },
                // Left Active Dispensing Cart
                e("div", { className: "w-[420px] bg-white border-r border-slate-200 flex flex-col shadow-sm" },
                    e("div", { className: "p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50" },
                        e("div", { className: "text-xs font-black uppercase text-[#072946] tracking-wider" }, "Active Dispensing Cart"),
                        e("span", { className: "text-xs font-mono font-bold text-[#0369A1] glass-cyan px-2 py-0.5 rounded" }, cart.length + " Items")
                    ),
                    e("div", { className: "flex-1 overflow-y-auto p-4 space-y-3" },
                        cart.length === 0 
                            ? e("div", { className: "h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center space-y-2" },
                                e("div", { className: "text-3xl" }, "🛒"),
                                e("div", { className: "font-bold text-slate-600" }, "Terminal Ready - Cart Empty"),
                                e("div", { className: "text-[11px] text-slate-400" }, "Click medications from the catalogue to add them to this sale.")
                              )
                            : cart.map(item => e("div", { key: item.id, className: "p-3 border border-slate-200 rounded-lg bg-[#F8FAFC] flex justify-between items-center" },
                                e("div", null,
                                    e("div", { className: "text-xs font-bold text-[#072946]" }, item.name),
                                    e("div", { className: "text-[10px] font-mono text-slate-500" }, "₦" + item.price.toLocaleString() + " × " + item.qty),
                                    e("div", { className: "text-xs font-mono font-extrabold text-[#E11D48] mt-0.5" }, "₦" + (item.price * item.qty).toLocaleString())
                                ),
                                e("div", { className: "flex items-center gap-2" },
                                    e("button", { onClick: () => updateQty(item.id, -1), className: "w-6 h-6 rounded bg-slate-200 font-bold text-xs hover:bg-slate-300 cursor-pointer" }, "-"),
                                    e("span", { className: "text-xs font-bold font-mono px-1" }, item.qty),
                                    e("button", { onClick: () => updateQty(item.id, 1), className: "w-6 h-6 rounded bg-slate-200 font-bold text-xs hover:bg-slate-300 cursor-pointer" }, "+")
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
                            className: "w-full py-3 bg-[#E11D48] hover:bg-[#BE123C] disabled:bg-slate-300 text-white rounded-lg font-black text-sm uppercase tracking-wider shadow-lg transition-all cursor-pointer disabled:cursor-not-allowed"
                        }, "Pay / Complete Dispense →")
                    )
                ),

                // Right Catalogue Floor
                e("div", { className: "flex-1 flex flex-col p-6 overflow-hidden" },
                    e("div", { className: "mb-4" },
                        e("input", {
                            type: "text",
                            value: search,
                            onChange: (ev) => setSearch(ev.target.value),
                            placeholder: "Search catalogue by medication trade name or code (e.g. Augmentin, Coartem, ABN-25)...",
                            className: "w-full p-3.5 bg-white border border-slate-300 rounded-lg text-sm text-[#072946] focus:outline-none focus:border-[#0284C7] shadow-sm font-medium"
                        })
                    ),
                    e("div", { className: "flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-1" },
                        filtered.map(item => e("div", {
                            key: item.id,
                            onClick: () => addToCart(item),
                            className: "bg-white p-4 rounded-xl border border-slate-200 hover:border-[#00D2FF] hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
                        },
                            e("div", null,
                                e("div", { className: "flex justify-between items-start mb-2" },
                                    e("span", { className: "px-2 py-0.5 rounded text-[10px] font-mono font-bold glass-cyan" }, item.code),
                                    e("span", { className: item.stock > 0 ? "px-2 py-0.5 rounded text-[10px] font-extrabold glass-cyan" : "px-2 py-0.5 rounded text-[10px] font-extrabold glass-rose" },
                                        item.stock > 0 ? "QTY: " + item.stock : "OUT OF STOCK"
                                    )
                                ),
                                e("h3", { className: "font-extrabold text-[#072946] text-sm leading-snug mb-1 group-hover:text-[#0A3A63] transition-colors" }, item.name),
                                e("div", { className: "text-[10px] text-slate-500 font-mono" }, "Batch: " + item.batch + " • Exp: " + item.exp)
                            ),
                            e("div", { className: "mt-4 pt-3 border-t border-slate-100 flex justify-between items-baseline" },
                                e("span", { className: "text-xs font-bold text-slate-400" }, "Retail Unit"),
                                e("span", { className: "text-base font-black font-mono text-[#E11D48]" }, "₦" + item.price.toLocaleString())
                            )
                        ))
                    )
                )
            ),

            // VIEW 2: OPERATING EXPENSES (Finance Dropdown Item)
            currentView === "Expenses" && e("div", { className: "flex-1 p-8 overflow-y-auto" },
                e("div", { className: "max-w-5xl mx-auto space-y-6" },
                    e("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm" },
                        e("h2", { className: "text-xl font-black text-[#072946] uppercase" }, "Pharmacy Operating Expenses"),
                        e("p", { className: "text-xs text-slate-500 mt-1" }, "Log petty cash vouchers, fuel, and supplies incurred during shifts.")
                    ),
                    e("div", { className: "bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm" },
                        e("table", { className: "w-full text-left text-xs" },
                            e("thead", { className: "bg-[#072946] text-white uppercase text-[11px]" },
                                e("tr", null,
                                    e("th", { className: "p-3.5" }, "Voucher / Description"),
                                    e("th", { className: "p-3.5" }, "Category"),
                                    e("th", { className: "p-3.5" }, "Amount (₦)"),
                                    e("th", { className: "p-3.5" }, "Authorized By"),
                                    e("th", { className: "p-3.5" }, "Timestamp")
                                )
                            ),
                            e("tbody", { className: "divide-y divide-slate-100 font-medium" },
                                [
                                    { desc: "Generator Diesel (50 Litres)", cat: "Utilities", amt: 65000, by: "Dr. Godwin", time: "Today 10:30 AM" },
                                    { desc: "80mm Thermal Receipt Paper (10 Rolls)", cat: "Supplies", amt: 12000, by: "Superintendent Pharm", time: "Today 09:15 AM" },
                                    { desc: "High-Speed Internet LAN Router", cat: "Utilities", amt: 25000, by: "Dr. Godwin", time: "3 Days Ago" }
                                ].map((ex, idx) => e("tr", { key: idx, className: "hover:bg-slate-50" },
                                    e("td", { className: "p-3.5 font-bold text-[#072946]" }, ex.desc),
                                    e("td", { className: "p-3.5" }, e("span", { className: "px-2 py-0.5 rounded text-[10px] glass-cyan font-bold" }, ex.cat)),
                                    e("td", { className: "p-3.5 font-mono font-black text-[#E11D48]" }, "₦" + ex.amt.toLocaleString()),
                                    e("td", { className: "p-3.5 text-slate-600" }, ex.by),
                                    e("td", { className: "p-3.5 text-slate-400 font-mono" }, ex.time)
                                ))
                            )
                        )
                    )
                )
            ),

            // VIEW 3: PROFIT & LOSS ANALYSIS
            currentView === "PL Analysis" && e("div", { className: "flex-1 p-8 overflow-y-auto" },
                e("div", { className: "max-w-5xl mx-auto space-y-6" },
                    e("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center" },
                        e("div", null,
                            e("h2", { className: "text-xl font-black text-[#072946] uppercase" }, "Profit & Loss Statement (P&L)"),
                            e("p", { className: "text-xs text-slate-500" }, "Statutory IFRS pharmacy financial verification report.")
                        ),
                        e("span", { className: "px-3 py-1 rounded text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300" }, "AUDIT STATUS: LIVE")
                    ),
                    e("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" },
                        [
                            { title: "Gross Income", val: "₦3,485,200.00", sub: "Total Revenue: 100%", color: "text-[#072946]" },
                            { title: "Direct Costs (COGS)", val: "₦2,240,000.00", sub: "Cost of Goods: 64.3%", color: "text-slate-700" },
                            { title: "Operating Overheads", val: "₦342,000.00", sub: "OPEX Total: 9.8%", color: "text-[#E11D48]" },
                            { title: "Bottom Line Profit", val: "+₦903,200.00", sub: "Net Margin: +25.9%", color: "text-emerald-600" }
                        ].map((card, idx) => e("div", { key: idx, className: "bg-white p-5 rounded-xl border border-slate-200 shadow-sm" },
                            e("div", { className: "text-[11px] font-bold text-slate-400 uppercase mb-1" }, card.title),
                            e("div", { className: "text-lg font-black font-mono " + card.color }, card.val),
                            e("div", { className: "text-[10px] text-slate-500 font-mono mt-2" }, card.sub)
                        ))
                    )
                )
            ),

            // VIEW 4: FEFO EXPIRY MATRIX (Reports Dropdown Item)
            currentView === "FEFO Matrix" && e("div", { className: "flex-1 p-8 overflow-y-auto" },
                e("div", { className: "max-w-5xl mx-auto space-y-6" },
                    e("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm" },
                        e("h2", { className: "text-xl font-black text-[#072946] uppercase" }, "⚠️ FEFO Expiry Matrix & Risk Tracker"),
                        e("p", { className: "text-xs text-slate-500" }, "First-Expired, First-Out auditing to prevent pharmacy expiration write-offs.")
                    ),
                    e("div", { className: "bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm" },
                        e("table", { className: "w-full text-left text-xs" },
                            e("thead", { className: "bg-[#072946] text-white uppercase text-[11px]" },
                                e("tr", null,
                                    e("th", { className: "p-3.5" }, "Product"),
                                    e("th", { className: "p-3.5" }, "Batch Ref"),
                                    e("th", { className: "p-3.5" }, "Expiry Date"),
                                    e("th", { className: "p-3.5" }, "Stock At Risk"),
                                    e("th", { className: "p-3.5" }, "Urgency Status")
                                )
                            ),
                            e("tbody", { className: "divide-y divide-slate-100 font-medium" },
                                inventory.map(item => e("tr", { key: item.id, className: "hover:bg-slate-50" },
                                    e("td", { className: "p-3.5 font-bold text-[#072946]" }, item.name),
                                    e("td", { className: "p-3.5 font-mono text-slate-500" }, item.batch),
                                    e("td", { className: "p-3.5 font-mono font-bold text-[#072946]" }, item.exp),
                                    e("td", { className: "p-3.5 font-mono text-slate-700" }, item.stock + " Units"),
                                    e("td", { className: "p-3.5" }, e("span", { className: "px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200" }, "GOOD (>1yr)"))
                                ))
                            )
                        )
                    )
                )
            ),

            // VIEW 5: PENDING HELD SALES (Sales Dropdown Item)
            currentView === "Held Carts" && e("div", { className: "flex-1 p-8 overflow-y-auto" },
                e("div", { className: "max-w-5xl mx-auto space-y-6" },
                    e("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm" },
                        e("h2", { className: "text-xl font-black text-[#072946] uppercase" }, "Pending Sales & Held Carts Engine"),
                        e("p", { className: "text-xs text-slate-500" }, "Unfinalized patient carts placed on hold. Recall directly into the POS dispenser.")
                    ),
                    e("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
                        [
                            { id: "HOLD-101", patient: "Dr. Godwin Clinic Ward 2", time: "Held at 10:15 AM", items: "3 items in cart", total: "₦13,800" },
                            { id: "HOLD-102", patient: "Walk-in Patient (Prescription Check)", time: "Held at 11:40 AM", items: "2 items in cart", total: "₦4,350" }
                        ].map(h => e("div", { key: h.id, className: "bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between" },
                            e("div", null,
                                e("div", { className: "flex justify-between items-center mb-2" },
                                    e("span", { className: "px-2 py-0.5 rounded text-[10px] font-mono font-bold glass-rose" }, h.id),
                                    e("span", { className: "text-[11px] text-slate-400 font-mono" }, h.time)
                                ),
                                e("h3", { className: "font-bold text-sm text-[#072946]" }, h.patient),
                                e("div", { className: "text-xs text-slate-500 mt-1" }, h.items)
                            ),
                            e("div", { className: "mt-4 pt-3 border-t border-slate-100 flex justify-between items-center" },
                                e("span", { className: "text-lg font-black font-mono text-[#E11D48]" }, h.total),
                                e("button", { 
                                    onClick: () => {
                                        setCurrentView("POS");
                                        alert(h.id + " recalled into active cart floor.");
                                    },
                                    className: "px-3.5 py-1.5 bg-[#00D2FF] hover:bg-[#0284C7] text-[#072946] text-xs font-black uppercase rounded shadow-sm transition-all cursor-pointer"
                                }, "Recall to Cart →")
                            )
                        ))
                    )
                )
            ),

            // DEFAULT / PROTOTYPE DRAWER VIEW FOR REMAINING SUBMENUS
            !["POS", "Expenses", "PL Analysis", "FEFO Matrix", "Held Carts"].includes(currentView) && e("div", { className: "flex-1 p-8 flex flex-col items-center justify-center" },
                e("div", { className: "max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-xl text-center space-y-4" },
                    e("div", { className: "w-14 h-14 mx-auto rounded-full bg-cyan-50 border border-[#00D2FF] flex items-center justify-center text-2xl" }, "⚡"),
                    e("h2", { className: "text-lg font-black uppercase text-[#072946]" }, currentView + " Module"),
                    e("p", { className: "text-xs text-slate-600 leading-relaxed" },
                        "This workspace module is fully operational in the local XAMPP desktop installation. In this client showcase demo, real-time inventory deduction, held sales, and split checkout are live in memory."
                    ),
                    e("button", { 
                        onClick: () => setCurrentView("POS"),
                        className: "w-full py-2.5 bg-[#072946] hover:bg-[#0A3A63] text-white font-bold text-xs uppercase rounded-lg shadow-md transition-all cursor-pointer"
                    }, "Return to POS Floor →")
                )
            )
        ),

        // MODALS (Payment, Receipt, Z-Report)
        paymentModal && e("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]" },
            e("div", { className: "bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200" },
                e("h2", { className: "text-base font-black text-[#072946] mb-4 uppercase" }, "Payment Tender Gateway"),
                e("div", { className: "space-y-3 mb-6" },
                    ["Cash", "Moniepoint POS", "Bank Transfer"].map(m => e("button", {
                        key: m,
                        onClick: () => setPaymentMethod(m),
                        className: (paymentMethod === m 
                            ? "w-full p-3 rounded-lg border-2 border-[#0284C7] bg-[#072946] text-white font-bold text-xs flex justify-between items-center cursor-pointer"
                            : "w-full p-3 rounded-lg border border-slate-200 text-[#072946] font-bold text-xs hover:bg-slate-50 flex justify-between items-center cursor-pointer")
                    }, m, paymentMethod === m && "✓")),
                    paymentMethod === "Moniepoint POS" && e("input", {
                        type: "text",
                        value: moniepointRrn,
                        onChange: (ev) => setMoniepointRrn(ev.target.value),
                        placeholder: "Enter Moniepoint RRN (Optional)...",
                        className: "w-full p-2.5 border border-slate-300 rounded text-xs font-mono mt-2"
                    })
                ),
                e("div", { className: "flex gap-3" },
                    e("button", { onClick: () => setPaymentModal(false), className: "w-1/2 py-2.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer" }, "Cancel"),
                    e("button", { onClick: finalizeCheckout, className: "w-1/2 py-2.5 rounded-lg bg-[#00D2FF] hover:bg-[#0284C7] text-[#072946] font-black text-xs uppercase shadow-md transition-all cursor-pointer" }, "Confirm & Print Receipt")
                )
            )
        ),

        receiptModal && completedSale && e("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]" },
            e("div", { className: "bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl border border-slate-200" },
                e("div", { className: "receipt-body border border-dashed border-slate-300 p-4 rounded bg-[#FAFAFA] text-[#072946] leading-relaxed" },
                    e("div", { className: "text-center font-bold text-sm mb-1" }, "EII PHARMACY & STORES LTD"),
                    e("div", { className: "text-center text-[10px] text-slate-500 mb-2" }, "Old Site NDA Hospital, Kaduna"),
                    e("div", { className: "border-b border-dashed border-slate-400 my-2" }),
                    e("div", { className: "flex justify-between" }, "Ref: " + completedSale.ref, completedSale.date),
                    e("div", { className: "flex justify-between" }, "Tender: " + completedSale.method, completedSale.rrn ? "RRN: " + completedSale.rrn : ""),
                    e("div", { className: "border-b border-dashed border-slate-400 my-2" }),
                    completedSale.items.map((i, idx) => e("div", { key: idx, className: "flex justify-between py-0.5" },
                        e("span", null, i.qty + "x " + i.name.substring(0, 18)),
                        e("span", null, "₦" + (i.price * i.qty).toLocaleString())
                    )),
                    e("div", { className: "border-t border-dashed border-slate-400 my-2" }),
                    e("div", { className: "flex justify-between font-black text-sm" },
                        e("span", null, "TOTAL PAID:"),
                        e("span", null, "₦" + completedSale.total.toLocaleString())
                    ),
                    e("div", { className: "text-center text-[9px] text-slate-400 mt-4" }, "Dispensed Drugs Are Not Returnable. Thank You.")
                ),
                e("button", { onClick: () => setReceiptModal(false), className: "w-full mt-4 py-2.5 bg-[#072946] hover:bg-[#0A3A63] text-white font-bold text-xs uppercase rounded-lg shadow transition-all cursor-pointer" }, "Close Receipt")
            )
        ),

        zReportModal && e("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]" },
            e("div", { className: "bg-white rounded-xl p-6 w-full max-w-md shadow-2xl border border-slate-200" },
                e("h2", { className: "text-sm font-black uppercase text-[#072946] mb-3" }, "Cashier Shift Balancing (Z-Report)"),
                e("div", { className: "bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs font-mono space-y-2.5 mb-4" },
                    e("div", { className: "flex justify-between" }, "Total Transactions:", dailySales.length),
                    e("div", { className: "flex justify-between font-bold text-[#E11D48] text-sm" }, "Total Revenue Posted:", "₦" + dailySales.reduce((s, d) => s + d.total, 0).toLocaleString())
                ),
                e("button", { onClick: () => setZReportModal(false), className: "w-full py-2 bg-[#072946] text-white font-bold text-xs uppercase rounded hover:bg-[#0A3A63] cursor-pointer" }, "Done")
            )
        )
    );
}

const rootElement = document.getElementById("root");
if (ReactDOM.createRoot) {
    ReactDOM.createRoot(rootElement).render(e(PharmacyPOSApp));
} else {
    ReactDOM.render(e(PharmacyPOSApp), rootElement);
}
