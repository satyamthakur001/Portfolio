// Menu Data
const menu = {
    dishes: [
        { id: "1", name: "Gourmet Pizza", price: 249, img: "assets/pizza.png", description: "Freshly baked with artisanal mozzarella and basil." },
        { id: "2", name: "Craft Burger", price: 129, img: "assets/burger.png", description: "Juicy beef patty with aged cheddar and brioche bun." },
        { id: "3", name: "Creamy Pasta", price: 149, img: "assets/pasta.png", description: "Handmade pasta in a rich parmesan cream sauce." },
        { id: "4", name: "Club Sandwich", price: 119, img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=1000&auto=format&fit=crop", description: "Triple-layered classic with roasted turkey and bacon." },
        { id: "5", name: "Truffle Fries", price: 59, img: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=1000&auto=format&fit=crop", description: "Crispy fries tossed in truffle oil and herbs." }
    ],
    drinks: [
        { id: "6", name: "Cold Coffee", price: 89, img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500", description: "Double-shot espresso blended with chilled milk." },
        { id: "7", name: "Lemonade", price: 69, img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=1000", description: "Freshly squeezed lemons with a hint of mint." },
        { id: "8", name: "Soft Drink", price: 39, img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1000&auto=format&fit=crop", description: "Refreshing carbonated beverage of your choice." },
        { id: "9", name: "Milkshake", price: 99, img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=1000&auto=format&fit=crop", description: "Thick and creamy shake with premium vanilla beans." }
    ]
};

// State
let cart = [];
let currentCategory = 'dishes';

// DOM Elements
const menuGrid = document.getElementById('menuGrid');
const tabBtns = document.querySelectorAll('.tab-btn');
const cartSidebar = document.getElementById('cartSidebar');
const cartToggle = document.getElementById('cartToggle');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const subtotalEl = document.getElementById('subtotal');
const taxesEl = document.getElementById('taxes');
const grandTotalEl = document.getElementById('grandTotal');
const notification = document.getElementById('notification');
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotWindow = document.getElementById('chatbotWindow');
const minimizeChat = document.getElementById('minimizeChat');
const chatInput = document.getElementById('chatInput');
const sendMessage = document.getElementById('sendMessage');
const chatMessages = document.getElementById('chatMessages');

// Functions
function renderMenu(category) {
    menuGrid.innerHTML = '';
    const items = menu[category];

    items.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'menu-item fade-in';
        itemCard.innerHTML = `
            <div class="item-img">
                <img src="${item.img}" alt="${item.name}">
            </div>
            <div class="item-info">
                <h3>${item.name}</h3>
                <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.5rem;">${item.description}</p>
                <span class="price">₹${item.price}</span>
                <button class="add-to-cart" onclick="addToCart('${item.id}', '${category}')">Add to Order</button>
            </div>
        `;
        menuGrid.appendChild(itemCard);
    });
}

window.addToCart = (id, category) => {
    const item = menu[category].find(i => i.id === id);
    cart.push(item);
    updateCart();
    showNotification(`Added ${item.name} to cart!`);
};

function updateCart() {
    cartCount.innerText = cart.length;
    renderCartItems();
    calculateTotal();
}

function renderCartItems() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty.</p>
                <p>Add some delicious items to get started!</p>
            </div>
        `;
        return;
    }

    cartItemsContainer.innerHTML = '';
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span class="price">₹${item.price}</span>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
}

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    updateCart();
};

function calculateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const taxes = Math.round(subtotal * 0.05);
    const grandTotal = subtotal + taxes;

    subtotalEl.innerText = `₹${subtotal}`;
    taxesEl.innerText = `₹${taxes}`;
    grandTotalEl.innerText = `₹${grandTotal}`;
}

function showNotification(msg) {
    notification.innerText = msg;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Chatbot Logic
function appendMessage(text, sender) {
    const msgEl = document.createElement('div');
    msgEl.className = `message ${sender}`;
    msgEl.innerText = text;
    chatMessages.appendChild(msgEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleChat() {
    const text = chatInput.value.trim().toLowerCase();
    if (!text) return;

    appendMessage(chatInput.value, 'user');
    chatInput.value = '';

    setTimeout(() => {
        let response = "I'm not sure about that. Try asking for 'menu', 'pizza', or 'drinks'.";
        
        if (text.includes('menu')) {
            response = "We have a great selection of Dishes and Drinks! Check out our menu section.";
        } else if (text.includes('pizza')) {
            response = "Our Gourmet Pizza is a customer favorite! It's topped with fresh mozzarella and basil.";
        } else if (text.includes('order')) {
            response = "You can add items directly from the menu. Just click 'Add to Order'!";
        } else if (text.includes('bill') || text.includes('total')) {
            const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
            response = cart.length > 0 
                ? `Your current subtotal is ₹${subtotal}. Would you like to proceed to checkout?`
                : "Your cart is empty. Would you like to see the menu?";
        } else if (text.includes('hello') || text.includes('hi')) {
            response = "Hello! Welcome to Smart Restaurant. How can I assist you today?";
        }

        appendMessage(response, 'assistant');
    }, 600);
}

// Event Listeners
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.category;
        renderMenu(currentCategory);
    });
});

cartToggle.addEventListener('click', () => cartSidebar.classList.add('open'));
closeCart.addEventListener('click', () => cartSidebar.classList.remove('open'));

chatbotToggle.addEventListener('click', () => chatbotWindow.classList.toggle('open'));
minimizeChat.addEventListener('click', () => chatbotWindow.classList.remove('open'));

sendMessage.addEventListener('click', handleChat);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChat();
});

document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification("Please add items to your order first!");
        return;
    }
    alert("Thank you for your order! Your meal is being prepared. 😊");
    cart = [];
    updateCart();
    cartSidebar.classList.remove('open');
});

// Initialize
renderMenu('dishes');
