let allOrders = [];
let allItems = [];
let currentView = 'landing';
let selectedOrderId = null;

const landingView = document.getElementById('landingView');
const ordersView = document.getElementById('ordersView');
const itemsView = document.getElementById('itemsView');

const showOrdersBtn = document.getElementById('showOrdersBtn');
const backToHomeBtn = document.getElementById('backToHomeBtn');
const backToOrdersBtn = document.getElementById('backToOrdersBtn');

const ordersContainer = document.getElementById('ordersContainer');
const itemsContainer = document.getElementById('itemsContainer');
const orderInfoContainer = document.getElementById('orderInfoContainer');

showOrdersBtn.addEventListener('click', loadAndShowOrders);
backToHomeBtn.addEventListener('click', showLandingView);
backToOrdersBtn.addEventListener('click', showOrdersView);

function showLandingView() {
    hideAllViews();
    landingView.classList.remove('hidden');
    currentView = 'landing';
}

function showOrdersView() {
    hideAllViews();
    ordersView.classList.remove('hidden');
    currentView = 'orders';
    renderOrders();
}

function showItemsView(orderId) {
    hideAllViews();
    itemsView.classList.remove('hidden');
    currentView = 'items';
    selectedOrderId = orderId;
    renderOrderDetails(orderId);
    renderItems(orderId);
}

function hideAllViews() {
    landingView.classList.add('hidden');
    ordersView.classList.add('hidden');
    itemsView.classList.add('hidden');
}

function loadAndShowOrders() {
    fetch('http://localhost:8080/api/orders')
        .then(response => response.json())
        .then(orders => {
            allOrders = orders;
            return fetch('http://localhost:8080/api/items');
        })
        .then(response => response.json())
        .then(items => {
            allItems = items;
            showOrdersView();
        })
        .catch(error => {
            console.error('Error loading data:', error);
            alert('Failed to load orders. Please try again.');
        });
}

function renderOrders() {
    ordersContainer.innerHTML = '';

    allOrders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';

        orderCard.innerHTML = `
        <h3>Order #${order.orderId}</h3>
        <div class="order-info">
            <p><strong>Table:</strong> ${order.tableNumber}</p>
            <p><strong>Server:</strong> ${order.serverName}</p>
            <p><strong>Guests:</strong> ${order.guestCount}</p>
            <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        </div>
        <p><strong>Notes:</strong> ${order.notes || 'None'}</p>
        <button class="show-items-btn" data-order-id="${order.orderId}">Show Items</button>
        `;

        ordersContainer.appendChild(orderCard);
    });

    document.querySelectorAll('.show-items-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const orderId = parseInt(e.target.dataset.orderId);
            showItemsView(orderId);
        });
    });
}

function renderOrderDetails(orderId) {
    const order = allOrders.find(o => o.orderId === orderId);

    if (!order) {
        orderInfoContainer.innerHTML = '<p>Order not found</p>';
        return;
    }

    orderInfoContainer.innerHTML = `
        <div class="order-detail-box">
            <h3>Order #${order.orderId}</h3>
            <p><strong>Table:</strong> ${order.tableNumber}</p>
            <p><strong>Server:</strong> ${order.serverName}</p>
            <p><strong>Guests:</strong> ${order.guestCount}</p>
            <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
            <p><strong>Notes:</strong> ${order.notes || 'None'}</p>
        </div>
    `;
}

function renderItems(orderId) {
    itemsContainer.innerHTML = '';

    const orderItems = allItems.filter(item => item.orderId === orderId);

    if (orderItems.length === 0) {
        itemsContainer.innerHTML = '<p>No items found for this order.</p>';
        return;
    }

    orderItems.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';

        itemCard.innerHTML = `
        <h4>${item.itemName}</h4>
        <p><strong>Quantity:</strong> ${item.itemQuantity}</p>
        <p><string>Item Price:</strong> $${item.itemPrice.toFixed(2)}</p>
        ${item.sides ? `<p><strong>Sides:</strong> ${item.sides}</p>` : ''}
        ${item.sidePrice ? `<p><strong>Side Price:</strong> $${item.sidePrice.toFixed(2)}` : ''}
        <p><strong>Item Total:</strong> $${item.itemTotal.toFixed(2)}</p>
        ${item.modifiers ? `<p><strong>Modifiers:</strong> ${item.modifiers}</p>` : ''}
        `;

        itemsContainer.appendChild(itemCard);
    });
}

showLandingView();