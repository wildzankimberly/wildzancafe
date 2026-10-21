// --- DATABASE MENU KAFE ---
const menuData = [
    {
        id: 1,
        name: "Kopi Susu Senja",
        category: "kopi",
        price: 22000,
        emoji: "☕",
        badge: "Populer",
        desc: "Espresso pilihan berpadu sempurna dengan susu segar dan manisnya gula aren alami.",
        ingredients: "Espresso, Fresh Milk, Gula Aren Asli, Es Batu"
    },
    {
        id: 2,
        name: "Caramel Macchiato",
        category: "kopi",
        price: 28000,
        emoji: "🥛",
        badge: "Rekomendasi",
        desc: "Kopi susu lembut dengan siraman saus karamel manis di bagian atasnya.",
        ingredients: "Espresso, Fresh Milk, Vanilla Syrup, Caramel Sauce"
    },
    {
        id: 3,
        name: "Matcha Latte",
        category: "non-kopi",
        price: 26000,
        emoji: "🍵",
        badge: "Favorit",
        desc: "Teh hijau matcha premium bertekstur creamy dengan aroma khas yang menenangkan.",
        ingredients: "Matcha Powder Jepang, Fresh Milk, Simple Syrup"
    },
    {
        id: 4,
        name: "Chocolate Regal",
        category: "non-kopi",
        price: 25000,
        emoji: "🍫",
        badge: "Manis",
        desc: "Susu cokelat lezat berpadu dengan remahan biskuit Marie Regal yang renyah.",
        ingredients: "Cocoa Powder, Fresh Milk, Condensed Milk, Regal Biscuit"
    },
    {
        id: 5,
        name: "Nasi Goreng Kampung",
        category: "makanan",
        price: 30000,
        emoji: "🍳",
        badge: "Chef Choice",
        desc: "Nasi goreng tradisional dengan bumbu rempah pilihan, telur mata sapi, dan kerupuk.",
        ingredients: "Nasi Putih, Bumbu Rempah, Telur, Ayam Suwir, Kerupuk"
    },
    {
        id: 6,
        name: "Chicken Katsu Curry",
        category: "makanan",
        price: 35000,
        emoji: "🍛",
        badge: "New",
        desc: "Daging ayam renyah disiram saus kari jepang gurih di atas nasi hangat.",
        ingredients: "Fillet Ayam Krispi, Japanese Curry Sauce, Nasi, Sayuran"
    },
    {
        id: 7,
        name: "French Fries",
        category: "cemilan",
        price: 18000,
        emoji: "🍟",
        badge: "Snack",
        desc: "Kentang goreng renyah keemasan disajikan dengan saus sambal dan mayones.",
        ingredients: "Kentang Pilihan, Garam, Bumbu Tabur, Saus Pendamping"
    },
    {
        id: 8,
        name: "Croissant Butter",
        category: "cemilan",
        price: 20000,
        emoji: "🥐",
        badge: "Fresh Baked",
        desc: "Pastry lapis renyah beraroma mentega harum yang dipanggang setiap hari.",
        ingredients: "Tepung Terigu Premium, French Butter, Ragi"
    }
];

// --- STATE APLIKASI ---
let cart = [];
let activeCategory = 'all';
let currentSelectedItem = null;
let currentQty = 1;

// --- ELEMEN DOM ---
const menuListEl = document.getElementById('menuList');
const searchInput = document.getElementById('searchInput');
const categoryContainer = document.getElementById('categoryContainer');
const emptyStateEl = document.getElementById('emptyState');
const cartBar = document.getElementById('cartBar');
const cartCountEl = document.getElementById('cartCount');
const cartTotalPriceEl = document.getElementById('cartTotalPrice');
const openCartBtn = document.getElementById('openCartBtn');

// Modal Detail
const detailModal = document.getElementById('detailModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalImage = document.getElementById('modalImage');
const modalBadge = document.getElementById('modalBadge');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalDesc = document.getElementById('modalDesc');
const modalIngredients = document.getElementById('modalIngredients');
const modalQtyEl = document.getElementById('modalQty');
const qtyMinus = document.getElementById('qtyMinus');
const qtyPlus = document.getElementById('qtyPlus');
const addToCartModalBtn = document.getElementById('addToCartModalBtn');

// Modal Keranjang
const cartModal = document.getElementById('cartModal');
const closeCartModalBtn = document.getElementById('closeCartModalBtn');
const cartItemsList = document.getElementById('cartItemsList');
const summarySubtotal = document.getElementById('summarySubtotal');
const summaryTax = document.getElementById('summaryTax');
const summaryTotal = document.getElementById('summaryTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

// --- FORMAT RUPIAH ---
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
}

// --- RENDER DAFTAR MENU ---
function renderMenu(items) {
    menuListEl.innerHTML = '';
    
    if (items.length === 0) {
        emptyStateEl.classList.remove('hidden');
        return;
    } else {
        emptyStateEl.classList.add('hidden');
    }

    items.forEach(item => {
        const article = document.createElement('article');
        article.className = "bg-white p-3 rounded-2xl shadow-sm border border-stone-200 flex items-center space-x-3 cursor-pointer hover:border-amber-600 transition";
        article.innerHTML = `
            <div class="w-20 h-20 bg-amber-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                ${item.emoji}
            </div>
            <div class="flex-grow">
                <span class="bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded-md">${item.badge}</span>
                <h3 class="font-bold text-stone-900 text-sm mt-1">${item.name}</h3>
                <p class="text-stone-500 text-xs line-clamp-1 mt-0.5">${item.desc}</p>
                <div class="flex justify-between items-center mt-2">
                    <span class="font-bold text-amber-700 text-sm">${formatRupiah(item.price)}</span>
                    <span class="w-7 h-7 bg-amber-50 text-amber-700 rounded-lg flex items-center justify-center text-xs font-bold border border-amber-200">+</span>
                </div>
            </div>
        `;
        
        // Ketika kartu menu diklik, buka modal detail
        article.addEventListener('click', () => openModal(item));
        menuListEl.appendChild(article);
    });
}

// --- FILTER & PENCARIAN ---
function filterAndSearchMenu() {
    const keyword = searchInput.value.toLowerCase();
    const filtered = menuData.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const matchesKeyword = item.name.toLowerCase().includes(keyword) || item.desc.toLowerCase().includes(keyword);
        return matchesCategory && matchesKeyword;
    });
    renderMenu(filtered);
}

// Event listener kategori
categoryContainer.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('bg-stone-900', 'text-amber-50');
            btn.classList.add('bg-white', 'text-stone-600', 'border', 'border-stone-200');
        });
        e.target.classList.remove('bg-white', 'text-stone-600', 'border', 'border-stone-200');
        e.target.classList.add('bg-stone-900', 'text-amber-50');
        
        activeCategory = e.target.getAttribute('data-category');
        filterAndSearchMenu();
    }
});

searchInput.addEventListener('input', filterAndSearchMenu);

// --- MODAL DETAIL ---
function openModal(item) {
    currentSelectedItem = item;
    currentQty = 1;
    modalImage.textContent = item.emoji;
    modalBadge.textContent = item.badge;
    modalTitle.textContent = item.name;
    modalPrice.textContent = formatRupiah(item.price);
    modalDesc.textContent = item.desc;
    modalIngredients.textContent = item.ingredients;
    modalQtyEl.textContent = currentQty;
    
    detailModal.classList.remove('hidden');
}

closeModalBtn.addEventListener('click', () => detailModal.classList.add('hidden'));
detailModal.addEventListener('click', (e) => { if(e.target === detailModal) detailModal.classList.add('hidden'); });

qtyPlus.addEventListener('click', () => {
    currentQty++;
    modalQtyEl.textContent = currentQty;
});

qtyMinus.addEventListener('click', () => {
    if (currentQty > 1) {
        currentQty--;
        modalQtyEl.textContent = currentQty;
    }
});

// Tambah dari modal ke keranjang
addToCartModalBtn.addEventListener('click', () => {
    const existingIndex = cart.findIndex(cartItem => cartItem.id === currentSelectedItem.id);
    if (existingIndex > -1) {
        cart[existingIndex].qty += currentQty;
    } else {
        cart.push({ ...currentSelectedItem, qty: currentQty });
    }
    
    detailModal.classList.add('hidden');
    updateCartUI();
});

// --- UPDATE KERANJANG & FLOATING BAR ---
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = subtotal * 0.10;
    const grandTotal = subtotal + tax;

    if (totalItems > 0) {
        cartBar.classList.remove('translate-y-full');
        cartCountEl.textContent = totalItems;
        cartTotalPriceEl.textContent = formatRupiah(grandTotal);
    } else {
        cartBar.classList.add('translate-y-full');
    }

    // Render daftar item di modal keranjang
    cartItemsList.innerHTML = '';
    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = "flex justify-between items-center py-2";
        div.innerHTML = `
            <div>
                <h4 class="font-bold text-stone-900 text-sm">${item.name}</h4>
                <p class="text-xs text-amber-700">${formatRupiah(item.price)} x ${item.qty}</p>
            </div>
            <div class="flex items-center space-x-2">
                <button onclick="changeCartQty(${index}, -1)" class="w-7 h-7 bg-stone-100 rounded-lg text-stone-700 font-bold text-xs">-</button>
                <span class="text-xs font-bold w-4 text-center">${item.qty}</span>
                <button onclick="changeCartQty(${index}, 1)" class="w-7 h-7 bg-stone-100 rounded-lg text-stone-700 font-bold text-xs">+</button>
            </div>
        `;
        cartItemsList.appendChild(div);
    });

    summarySubtotal.textContent = formatRupiah(subtotal);
    summaryTax.textContent = formatRupiah(tax);
    summaryTotal.textContent = formatRupiah(grandTotal);
}

window.changeCartQty = function(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
}

// Modal Keranjang Buka/Tutup
openCartBtn.addEventListener('click', () => cartModal.classList.remove('hidden'));
closeCartModalBtn.addEventListener('click', () => cartModal.classList.add('hidden'));
cartModal.addEventListener('click', (e) => { if(e.target === cartModal) cartModal.classList.add('hidden'); });

// Tombol Checkout / Tunjukkan ke Kasir
checkoutBtn.addEventListener('click', () => {
    alert("Pesanan berhasil disiapkan! Tunjukkan layar ini kepada kasir untuk memproses pembayaran.");
    cartModal.classList.add('hidden');
});

// Inisialisasi awal saat halaman dimuat
renderMenu(menuData);
