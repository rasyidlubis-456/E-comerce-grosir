// Data Produk dengan Gambar
const products = [
    { 
        id: 1, 
        name: 'Kopi Sachet Premium', 
        category: 'minuman', 
        price: 150000, 
        oldPrice: 180000, 
        unit: 'Box (100 sachet)', 
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop',
        minOrder: '10 box',
        discount: '17%'
    },
    { 
        id: 2, 
        name: 'Teh Celup Original', 
        category: 'minuman', 
        price: 85000, 
        oldPrice: 100000, 
        unit: 'Box (50 sachet)', 
        image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=300&fit=crop',
        minOrder: '15 box',
        discount: '15%'
    },
    { 
        id: 3, 
        name: 'Biskuit Cokelat Premium', 
        category: 'makanan', 
        price: 120000, 
        oldPrice: 140000, 
        unit: 'Karton (24 pcs)', 
        image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop',
        minOrder: '5 karton',
        discount: '14%'
    },
    { 
        id: 4, 
        name: 'Mie Instan Goreng', 
        category: 'makanan', 
        price: 95000, 
        oldPrice: 110000, 
        unit: 'Karton (40 pcs)', 
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
        minOrder: '10 karton',
        discount: '14%'
    },
    { 
        id: 5, 
        name: 'Bumbu Rendang Authentic', 
        category: 'bumbu', 
        price: 75000, 
        oldPrice: 90000, 
        unit: 'Box (50 sachet)', 
        image: 'https://images.unsplash.com/photo-1596040033229-a0b3850261b5?w=400&h=300&fit=crop',
        minOrder: '20 box',
        discount: '17%'
    },
    { 
        id: 6, 
        name: 'Kecap Manis Premium', 
        category: 'bumbu', 
        price: 180000, 
        oldPrice: 200000, 
        unit: 'Karton (12 botol)', 
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop',
        minOrder: '5 karton',
        discount: '10%'
    },
    { 
        id: 7, 
        name: 'Beras Premium 5kg', 
        category: 'sembako', 
        price: 450000, 
        oldPrice: 500000, 
        unit: 'Karung (10 pack)', 
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
        minOrder: '5 karung',
        discount: '10%'
    },
    { 
        id: 8, 
        name: 'Minyak Goreng Premium', 
        category: 'sembako', 
        price: 280000, 
        oldPrice: 320000, 
        unit: 'Karton (12 botol)', 
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop',
        minOrder: '10 karton',
        discount: '13%'
    },
];

// Variables
let cart = [];
let orderHistory = [];
let currentUser = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadFromStorage();
    checkUserSession();
});

// Load from LocalStorage
function loadFromStorage() {
    const savedCart = localStorage.getItem('cart');
    const savedHistory = localStorage.getItem('orderHistory');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedCart) cart = JSON.parse(savedCart);
    if (savedHistory) orderHistory = JSON.parse(savedHistory);
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserDisplay();
    }
    
    updateCartCount();
}

// Save to LocalStorage
function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

// Check User Identity
function checkUserIdentity(event) {
    event.preventDefault();
    
    if (currentUser) {
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    } else {
        document.getElementById('identityModal').style.display = 'flex';
    }
}

// Handle Identity Form
document.getElementById('identityForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;
    
    currentUser = {
        name: name,
        phone: phone,
        address: address,
        registeredAt: new Date().toISOString()
    };
    
    saveToStorage();
    updateUserDisplay();
    
    document.getElementById('identityModal').style.display = 'none';
    showNotification('🎉 Selamat datang, ' + name + '!', 'success');
    
    // Reset form
    document.getElementById('identityForm').reset();
    
    // Scroll to products
    setTimeout(() => {
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    }, 500);
});

// Update User Display
function updateUserDisplay() {
    if (currentUser) {
        document.getElementById('userInfo').style.display = 'flex';
        document.getElementById('userName').textContent = currentUser.name;
    }
}

// Check User Session
function checkUserSession() {
    if (currentUser) {
        updateUserDisplay();
    }
}

// Load Products
function loadProducts(filter = 'semua') {
    const productGrid = document.getElementById('productGrid');
    const filteredProducts = filter === 'semua' 
        ? products 
        : products.filter(p => p.category === filter);

    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="product-badge">-${product.discount}</div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="wholesale-info">
                    📦 Minimal Order: ${product.minOrder}
                </div>
                <div class="product-price">
                    <div>
                        <div class="price">Rp ${product.price.toLocaleString('id-ID')}</div>
                        <div class="old-price">Rp ${product.oldPrice.toLocaleString('id-ID')}</div>
                    </div>
                </div>
                <div style="color: #666; font-size: 0.9rem; margin: 10px 0; font-weight: 500;">per ${product.unit}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    Tambah ke Keranjang
                </button>
            </div>
        </div>
    `).join('');
}

// Filter Products
function filterProducts(category) {
    loadProducts(category);
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Scroll to products
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Add to Cart
function addToCart(productId) {
    if (!currentUser) {
        showNotification('⚠️ Silakan isi identitas terlebih dahulu!', 'warning');
        document.getElementById('identityModal').style.display = 'flex';
        return;
    }
    
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartCount();
    saveToStorage();
    showNotification('✅ Produk berhasil ditambahkan ke keranjang!', 'success');
}

// Update Cart Count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Open Cart
function openCart() {
    if (!currentUser) {
        showNotification('⚠️ Silakan isi identitas terlebih dahulu!', 'warning');
        document.getElementById('identityModal').style.display = 'flex';
        return;
    }
    
    const modal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2" style="margin-bottom: 20px;">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                <p style="color: #888; font-size: 1.1rem;">Keranjang Anda masih kosong</p>
                <p style="color: #aaa; font-size: 0.9rem; margin-top: 10px;">Mulai berbelanja sekarang!</p>
            </div>
        `;
        document.getElementById('cartTotal').textContent = 'Total: Rp 0';
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div style="display: flex; gap: 15px; flex: 1;">
                    <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 10px;">
                    <div>
                        <strong style="font-size: 1.1rem; color: #1a1a2e;">${item.name}</strong>
                        <div style="color: #888; font-size: 0.9rem; margin-top: 5px;">
                            ${item.quantity} x Rp ${item.price.toLocaleString('id-ID')}
                        </div>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: bold; font-size: 1.2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 10px;">
                        Rp ${(item.price * item.quantity).toLocaleString('id-ID')}
                    </div>
                    <button onclick="removeFromCart(${index})" style="background: #e94560; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.3s;">
                        🗑️ Hapus
                    </button>
                </div>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('cartTotal').textContent = `Total: Rp ${total.toLocaleString('id-ID')}`;
    }

    modal.style.display = 'flex';
}

// Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    saveToStorage();
    openCart();
    showNotification('🗑️ Produk dihapus dari keranjang', 'info');
}

// Close Cart
function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

// Process Checkout
function processCheckout() {
    if (cart.length === 0) {
        showNotification('⚠️ Keranjang Anda kosong!', 'warning');
        return;
    }
    
    const orderId = 'INV-' + Date.now();
    const orderDate = new Date().toLocaleString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const order = {
        id: orderId,
        date: orderDate,
        customer: currentUser,
        items: [...cart],
        total: total,
        status: 'Selesai'
    };
    
    orderHistory.unshift(order);
    saveToStorage();
    
    // Show receipt
    showReceipt(order);
    
    // Clear cart
    cart = [];
    updateCartCount();
    saveToStorage();
    closeCart();
    
    showNotification('🎉 Pesanan berhasil! Struk ditampilkan.', 'success');
}

// Show Receipt
function showReceipt(order) {
    const modal = document.getElementById('receiptModal');
    const content = document.getElementById('receiptContent');
    
    content.innerHTML = `
        <div class="receipt" id="receiptPrint">
            <div class="receipt-header">
                <h2 style="margin: 0; font-size: 2rem;">👑 GROSIR NUSANTARA</h2>
                <p style="margin: 8px 0; font-weight: 600;">Distributor Premium Terpercaya</p>
                <p style="margin: 5px 0;">Jl. Raya Industri No. 123, Jakarta Selatan</p>
                <p style="margin: 5px 0;">Telp: 0812-3456-7890 | Email: info@grosirnusantara.com</p>
            </div>
            
            <div class="receipt-body">
                <p style="margin: 10px 0;"><strong>No. Invoice:</strong> ${order.id}</p>
                <p style="margin: 10px 0;"><strong>Tanggal:</strong> ${order.date}</p>
                <p style="margin: 10px 0;"><strong>Pelanggan:</strong> ${order.customer.name}</p>
                <p style="margin: 10px 0;"><strong>Telepon:</strong> ${order.customer.phone}</p>
                <p style="margin: 10px 0;"><strong>Alamat:</strong> ${order.customer.address}</p>
                
                <p style="margin: 25px 0 15px 0; border-top: 2px solid #333; padding-top: 15px;">
                    <strong style="font-size: 1.1rem;">DAFTAR BELANJA:</strong>
                </p>
                
                ${order.items.map(item => `
                    <div class="receipt-item">
                        <div>
                            <div><strong>${item.name}</strong></div>
                            <div style="font-size: 0.9rem; color: #666;">${item.quantity} x Rp ${item.price.toLocaleString('id-ID')}</div>
                        </div>
                        <div style="text-align: right;">
                            <strong>Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</strong>
                        </div>
                    </div>
                `).join('')}
                
                <div class="receipt-total">
                    <div style="display: flex; justify-content: space-between; font-size: 1.5rem;">
                        <span>TOTAL PEMBAYARAN:</span>
                        <span>Rp ${order.total.toLocaleString('id-ID')}</span>
                    </div>
                </div>
            </div>
            
            <div class="receipt-footer">
                <p style="font-weight: 600; margin-bottom: 10px;">Terima kasih atas pembelian Anda!</p>
                <p style="font-size: 0.9rem;">Barang yang sudah dibeli tidak dapat dikembalikan</p>
                <p style="margin-top: 15px; font-size: 0.85rem; color: #666;">www.grosirnusantara.com</p>
            </div>
        </div>
    `;
    
    content.innerHTML += `
        <div class="receipt-actions">
            <button class="btn btn-secondary" onclick="printReceipt()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 9L6 2H18L18 9"/>
                    <path d="M6 18H4C2.89543 18 2 17.1046 2 16V11C2 9.89543 2.89543 9 4 9H20C21.1046 9 22 9.89543 22 11V16C22 17.1046 21.1046 18 20 18H18"/>
                    <rect x="6" y="14" width="12" height="8"/>
                </svg>
                Cetak Struk
            </button>
            <button class="btn btn-primary" onclick="closeReceipt()">Tutup</button>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// Close Receipt Modal
function closeReceipt() {
    document.getElementById('receiptModal').style.display = 'none';
}

// Print Receipt
function printReceipt() {
    const receiptContent = document.getElementById('receiptPrint');
    const originalContents = document.body.innerHTML;
    
    document.body.innerHTML = receiptContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
    
    // Reattach event listeners
    loadProducts();
    loadFromStorage();
    checkUserSession();
    initializeUserDropdown();
}

// Process Payment
function processPayment() {
    if (!selectedPaymentMethod) {
        showNotification('⚠️ Pilih metode pembayaran terlebih dahulu!', 'warning');
        return;
    }
    
    // Show loading state
    const payBtn = document.querySelector('#paymentModal .btn-primary');
    const originalText = payBtn.innerHTML;
    payBtn.innerHTML = '<span class="loading-spinner"></span> Memproses...';
    payBtn.disabled = true;
    
    // Simulate processing delay
    setTimeout(() => {
        const orderId = 'INV-' + Date.now();
        const orderDate = new Date().toLocaleString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const order = {
            id: orderId,
            date: orderDate,
            customer: currentUser,
            items: [...cart],
            total: total,
            status: 'Selesai'
        };
        
        orderHistory.unshift(order);
        saveToStorage();
        
        // Show receipt
        showReceipt(order);
        
        // Clear cart
        cart = [];
        updateCartCount();
        saveToStorage();
        closeCart();
        
        payBtn.innerHTML = originalText;
        payBtn.disabled = false;
        
        showNotification('🎉 Pesanan berhasil! Struk ditampilkan.', 'success');
    }, 1500);
}

// Show Order History
function showOrderHistory(event) {
    event.preventDefault();
    
    if (!currentUser) {
        showNotification('⚠️ Silakan isi identitas terlebih dahulu!', 'warning');
        document.getElementById('identityModal').style.display = 'flex';
        return;
    }
    
    const modal = document.getElementById('historyModal');
    const historyItems = document.getElementById('historyItems');
    
    if (orderHistory.length === 0) {
        historyItems.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2" style="margin-bottom: 20px;">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                </svg>
                <p style="color: #888; font-size: 1.1rem;">Belum ada riwayat pemesanan</p>
                <p style="color: #aaa; font-size: 0.9rem; margin-top: 10px;">Pesanan Anda akan muncul di sini</p>
            </div>
        `;
    } else {
        historyItems.innerHTML = orderHistory.map(order => `
            <div class="history-item">
                <div class="history-header">
                    <div>
                        <strong style="font-size: 1.3rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${order.id}</strong>
                        <div style="color: #666; font-size: 0.95rem; margin-top: 8px;">📅 ${order.date}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="color: #28a745; font-weight: 700; font-size: 1rem; display: flex; align-items: center; justify-content: flex-end; gap: 5px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                            ${order.status}
                        </div>
                        <div style="font-size: 1.5rem; font-weight: 700; margin-top: 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                            Rp ${order.total.toLocaleString('id-ID')}
                        </div>
                    </div>
                </div>
                
                <div class="history-products">
                    <strong style="color: #333; font-size: 1rem;">📦 Produk yang dibeli:</strong>
                    ${order.items.map(item => `
                        <div class="history-product-item">
                            <span style="display: flex; align-items: center; gap: 10px;">
                                <img src="${item.image}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 8px;">
                                ${item.name} (${item.quantity}x)
                            </span>
                            <span style="font-weight: 700;">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</span>
                        </div>
                    `).join('')}
                </div>
                
                <button class="btn btn-primary" onclick='showReceipt(${JSON.stringify(order).replace(/'/g, "&apos;")})' 
                    style="margin-top: 20px; padding: 12px 25px; font-size: 0.95rem;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    Lihat Struk
                </button>
            </div>
        `).join('');
    }
    
    modal.style.display = 'flex';
}

// Close History
function closeHistory() {
    document.getElementById('historyModal').style.display = 'none';
}

// Show Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    
    let bgColor = '#4CAF50';
    if (type === 'warning') bgColor = '#ff9800';
    if (type === 'info') bgColor = '#2196F3';
    if (type === 'error') bgColor = '#f44336';
    
    notification.style.cssText = `
        position: fixed;
        top: 120px;
        right: 30px;
        background: ${bgColor};
        color: white;
        padding: 18px 30px;
        border-radius: 15px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        z-index: 3000;
        animation: slideIn 0.4s ease-out;
        font-weight: 600;
        font-size: 1rem;
        max-width: 400px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.4s ease-out';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});