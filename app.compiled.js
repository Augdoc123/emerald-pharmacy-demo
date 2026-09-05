"use strict";

const e = React.createElement;
const { useState, useEffect, useMemo } = React;

const INITIAL_INVENTORY = [
    { id: 1, name: "Tab Augmentin 625mg (GSK)", code: "AUG-625", price: 8500, stock: 45, exp: "11/2027", batch: "B-AUG41" },
    { id: 2, name: "Coartem 80/480 Tablets", code: "COA-80", price: 3200, stock: 80, exp: "04/2028", batch: "B-COA99" },
    { id: 3, name: "Paracetamol Syrup 100ml (Emzor)", code: "PCM-SYR", price: 650, stock: 120, exp: "09/2027", batch: "B-EMZ12" },
    { id: 4, name: "IV Ceftriaxone 1g Vial", code: "CEF-1G", price: 2100, stock: 32, exp: "01/2027", batch: "B-CEF03" },
    { id: 5, name: "Ringers Lactate 500ml Infusion", code: "RL-500", price: 1400, stock: 18, exp: "07/2028", batch: "B-RL88" },
    { id: 6, name: "Crepe Bandage 10cm x 4.5m", code: "CR-BDG", price: 950, stock: 65, exp: "12/2029", batch: "B-CRP01" },
    { id: 7, name: "Aboniki Balm 25g", code: "ABN-25", price: 1100, stock: 95, exp: "07/2029", batch: "B-ABN05" },
    { id: 8, name: "Acirab (Rabeprazole) 20mg", code: "ACI-20", price: 1100, stock: 40, exp: "10/2027", batch: "B-ACI12" },
    { id: 9, name: "Amatem Softgel", code: "AMT-SF", price: 3700, stock: 26, exp: "04/2028", batch: "B-AMT77" }
];

function PharmacyPOSApp() {
    const [inventory, setInventory] = useState(() => {
        const saved = localStorage.getItem("em_demo_inventory");
        return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    });
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState("");
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

    useEffect(() => {
        localStorage.setItem("em_demo_inventory", JSON.stringify(inventory));
    }, [inventory]);

    useEffect(() => {
        localStorage.setItem("em_demo_sales", JSON.stringify(dailySales));
    }, [dailySales]);

    const filtered = inventory.filter(i => 
        i.name.toLowerCase().includes(search.toLowerCase()) || 
        i.code.toLowerCase().includes(search.toLowerCase())
    );

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

        // Real-time stock deduction
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

    const resetDemo = () => {
        localStorage.removeItem("em_demo_inventory");
        localStorage.removeItem("em_demo_sales");
        setInventory(INITIAL_INVENTORY);
        setDailySales([]);
        setCart([]);
        setZReportModal(false);
        alert("Demo state restored to factory seed!");
    };

    return e("div", { className: "min-h-screen flex flex-col" },
        // Top Navigation Header
        e("header", { className: "bg-[#072946] text-white px-6 py-3 flex items-center justify-between border-b-2 border-[#00D2FF] shadow-md" },
            e("div", { className: "flex items-center gap-3" },
                e("div", { className: "w-8 h-8 rounded bg-[#00D2FF] text-[#072946] font-black flex items-center justify-center text-sm shadow-inner" }, "EM"),
                e("div", null,
                    e("h1", { className: "text-sm font-extrabold tracking-wide uppercase leading-tight" }, "EII PHARMACY & STORES LTD"),
                    e("div", { className: "text-[10px] text-slate-300 font-mono" }, "Terminal: Node 1 • Live Client Demo Showcase")
                )
            ),
            e("div", { className: "flex items-center gap-3" },
                e("button", { 
                    onClick: () => setZReportModal(true),
                    className: "px-3 py-1 bg-[#0A3A63] hover:bg-[#00D2FF] hover:text-[#072946] border border-slate-500 rounded text-xs font-bold transition-all cursor-pointer" 
                }, "Z-Report / Shift Close"),
                e("span", { className: "px-2.5 py-0.5 rounded text-[10px] font-extrabold glass-rose" }, "SUPER ADMIN")
            )
        ),

        // Workspace Container
        e("div", { className: "flex-1 flex overflow-hidden" },
            // Left Dispensing Cart Panel
            e("div", { className: "w-[420px] bg-white border-r border-slate-200 flex flex-col shadow-sm" },
                e("div", { className: "p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50" },
                    e("div", { className: "text-xs font-black uppercase text-[#072946] tracking-wider" }, "Active Dispensing Cart"),
                    e("span", { className: "text-xs font-mono font-bold text-slate-500" }, cart.length + " Items")
                ),
                e("div", { className: "flex-1 overflow-y-auto p-4 space-y-3" },
                    cart.length === 0 
                        ? e("div", { className: "h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center space-y-2" },
                            e("div", { className: "text-3xl" }, "🛒"),
                            e("div", null, "Cart is currently empty."),
                            e("div", { className: "text-[10px] text-slate-400" }, "Click medication items from catalogue to dispense.")
                          )
                        : cart.map(item => e("div", { key: item.id, className: "p-3 border border-slate-200 rounded-lg bg-[#F8FAFC] flex justify-between items-center" },
                            e("div", null,
                                e("div", { className: "text-xs font-bold text-[#072946]" }, item.name),
                                e("div", { className: "text-[10px] font-mono text-slate-500" }, "₦" + item.price.toLocaleString() + " × " + item.qty),
                                e("div", { className: "text-xs font-mono font-extrabold text-[#E11D48] mt-0.5" }, "₦" + (item.price * item.qty).toLocaleString())
                            ),
                            e("div", { className: "flex items-center gap-2" },
                                e("button", { onClick: () => updateQty(item.id, -1), className: "w-6 h-6 rounded bg-slate-200 font-bold text-xs hover:bg-slate-300 transition-colors cursor-pointer" }, "-"),
                                e("span", { className: "text-xs font-bold font-mono px-1" }, item.qty),
                                e("button", { onClick: () => updateQty(item.id, 1), className: "w-6 h-6 rounded bg-slate-200 font-bold text-xs hover:bg-slate-300 transition-colors cursor-pointer" }, "+")
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
                    }, "Pay / Dispense Sale →")
                )
            ),

            // Right Product Catalogue Grid
            e("div", { className: "flex-1 flex flex-col bg-[#F4F7FB] p-6 overflow-hidden" },
                e("div", { className: "mb-6" },
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

        // Split Payment Modal
        paymentModal && e("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" },
            e("div", { className: "bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200" },
                e("h2", { className: "text-base font-black text-[#072946] mb-4 uppercase" }, "Payment Gateway Tender"),
                e("div", { className: "space-y-3 mb-6" },
                    ["Cash", "Moniepoint POS", "Bank Transfer"].map(m => e("button", {
                        key: m,
                        onClick: () => setPaymentMethod(m),
                        className: paymentMethod === m 
                            ? "w-full p-3 rounded-lg border-2 border-[#0284C7] bg-[#072946] text-white font-bold text-xs flex justify-between items-center cursor-pointer"
                            : "w-full p-3 rounded-lg border border-slate-200 text-[#072946] font-bold text-xs hover:bg-slate-50 flex justify-between items-center cursor-pointer"
                    }, m, paymentMethod === m && "✓")),
                    paymentMethod === "Moniepoint POS" && e("input", {
                        type: "text",
                        value: moniepointRrn,
                        onChange: (ev) => setMoniepointRrn(ev.target.value),
                        placeholder: "Enter Moniepoint RRN Reference (Optional)...",
                        className: "w-full p-2.5 border border-slate-300 rounded text-xs font-mono mt-2"
                    })
                ),
                e("div", { className: "flex gap-3" },
                    e("button", { onClick: () => setPaymentModal(false), className: "w-1/2 py-2.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer" }, "Cancel"),
                    e("button", { onClick: finalizeCheckout, className: "w-1/2 py-2.5 rounded-lg bg-[#00D2FF] hover:bg-[#0284C7] text-[#072946] font-black text-xs uppercase shadow-md transition-all cursor-pointer" }, "Confirm & Print Receipt")
                )
            )
        ),

        // 80mm ESC/POS Thermal Receipt Modal
        receiptModal && completedSale && e("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" },
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

        // Cashier Shift Balancing / Z-Report Modal
        zReportModal && e("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" },
            e("div", { className: "bg-white rounded-xl p-6 w-full max-w-md shadow-2xl border border-slate-200" },
                e("h2", { className: "text-sm font-black uppercase text-[#072946] mb-3" }, "Cashier Shift Balancing (Z-Report)"),
                e("div", { className: "bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs font-mono space-y-2.5 mb-4" },
                    e("div", { className: "flex justify-between" }, "Total Transactions:", dailySales.length),
                    e("div", { className: "flex justify-between font-bold text-[#E11D48] text-sm" }, "Total Revenue Posted:", "₦" + dailySales.reduce((s, d) => s + d.total, 0).toLocaleString())
                ),
                e("div", { className: "flex gap-3" },
                    e("button", { onClick: resetDemo, className: "w-1/2 py-2 bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs uppercase rounded hover:bg-rose-100 cursor-pointer" }, "Reset Demo Seed"),
                    e("button", { onClick: () => setZReportModal(false), className: "w-1/2 py-2 bg-[#072946] text-white font-bold text-xs uppercase rounded hover:bg-[#0A3A63] cursor-pointer" }, "Done")
                )
            )
        )
    );
}

const container = document.getElementById("root");
if (ReactDOM.createRoot) {
    const root = ReactDOM.createRoot(container);
    root.render(e(PharmacyPOSApp));
} else {
    ReactDOM.render(e(PharmacyPOSApp), container);
}
