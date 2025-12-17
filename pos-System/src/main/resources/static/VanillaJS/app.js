import { formatCurrency, createElement, showError, createLoadingIndicator } from './utils.js';
import { fetchAllData, fetchItemsByOrderId } from './api.js';

class OrderManager {
    constructor() {
        this.orders = [];
        this.items = [];
        this.currentView = 'landing';
        this.selectedOrderId = null;

        this.landingView = document.getElementById('landingView');
        this.ordersView = document.getElementById('ordersView');
        this.itemsView = document.getElementById('itemsView');

        this.ordersContainer = document.getElementById('ordersContainer');
        this.itemsContainer = document.getElementById('itemsContainer');
        this.orderInfoContainer = document.getElementById('orderInfoContainer');
        this.bindEvents();
        this.showLandingView();
    }

    bindEvents() {
        document.getElementById('showOrdersBtn')
            .addEventListener('click', () => this.loadAndShowOrders());
        document.getElementById('backToHomeBtn')
            .addEventListener('click', () => this.showLandingView());
        document.getElementById('backToOrdersBtn')
            .addEventListener('click', () => this.showOrdersView());
    }

    async loadAndShowOrders() {
        try {
            this.ordersContainer.innerHTML = '';
            this.ordersContainer.appendChild(createLoadingIndicator());
            const data = await fetchAllData();
            this.orders = data.orders;
            this.items = data.items;
            this.showOrdersView();
        } catch (error) {
            showError('Failed to load orders. Please try again.');
        }
    }

    showLandingView() {
        this.hideAllViews();
        this.landingView.classList.remove('hidden');
        this.currentView = 'landing';
    }

    showOrdersView() {
        this.hideAllViews();
        this.ordersView.classList.remove('hidden');
        this.currentView = 'orders';
        this.renderOrders();
    }

    async showItemsView(orderId) {
        this.hideAllViews();
        this.itemsView.classList.remove('hidden');
        this.currentView = 'items';
        this.selectedOrderId = orderId;
        this.renderOrderDetails(orderId);
        this.itemsContainer.innerHTML = '';
        this.itemsContainer.appendChild(createLoadingIndicator());

        try {
            const orderItems = await fetchItemsByOrderId(orderId);
            this.renderItems(orderItems);
        } catch (error) {
            showError('Failed to load items.');
        }
    }

    hideAllViews() {
        this.landingView.classList.add('hidden');
        this.ordersView.classList.add('hidden');
        this.itemsView.classList.add('hidden');
    }

    renderOrders() {
        this.ordersContainer.innerHTML = '';

        if (this.orders.length === 0) {
            this.ordersContainer.innerHTML = '<p>No orders found.</p>';
            return;
        }

        this.orders.forEach(order => {
            const orderCard = this.createOrderCard(order);
            this.ordersContainer.appendChild(orderCard);
        });
    }

    createOrderCard(order) {
        const card = createElement('div', 'order-card');

        card.innerHTML = `
        <h3>Order #${order.orderId}</h3>
        <div class="order-info">
            <p><strong>Table:</strong> ${order.tableNumber}</p>
            <p><strong>Server:</strong> ${order.serverName}</p>
            <p><strong>Guests:</strong> ${order.guestCount}</p>
            <p><strong>Total:</strong> ${formatCurrency(order.total)}</p>
        </div>
        <p><strong>Notes:</strong> ${order.notes || 'None'}</p>
        <button class="show-items-btn" data-order-id="${order.orderId}">
            Show Items
        </button>
        `;

        const btn = card.querySelector('.show-items-btn');
        btn.addEventListener('click', () => {
            const orderId = parseInt(btn.dataset.orderId);
            this.showItemsView(orderId);
        });

        return card;
    }

    renderOrderDetails(orderId) {
        const order = this.orders.find(o => o.orderId === orderId);

        if (!order) {
            this.orderInfoContainer.innerHTML = '<p>Order not found</p>';
            return;
        }

        this.orderInfoContainer.innerHTML = `
        <div class="order-detail-box">
            <h3>Order #${order.orderId}</h3>
            <p><strong>Table:</strong> ${order.tableNumber}</p>
            <p><strong>Server:</strong> ${order.serverName}</p>
            <p><strong>Guests:</strong> ${order.guestCount}</p>
            <p><strong>Total:</strong> ${formatCurrency(order.total)}</p>
            <p><strong>Notes:</strong> ${order.notes || 'None'}</p>
        </div>
        `;
    }

    renderItems(items) {
        this.itemsContainer.innerHTML = '';

        if (items.length === 0) {
            this.itemsContainer.innerHTML = '<p>No items found for this order.</p>';
            return;
        }

        items.forEach(item => {
            const itemCard = this.createItemCard(item);
            this.itemsContainer.appendChild(itemCard);
        });
    }

    createItemCard(item) {
        const card = createElement('div', 'item-card');

        card.innerHTML = `
        <h4>${item.itemName}</h4>
        <p><strong>Quantity:</strong> ${item.itemQuantity}</p>
        <p><strong>Item Price:</strong> ${formatCurrency(item.itemPrice)}</p>
        ${item.sides ? `<p><strong>Sides:</strong> ${item.sides}</p>` : ''}
        ${item.sidePrice ? `<p><strong>Side Price:</strong> ${formatCurrency(item.sidePrice)}</p>` : ''}
        <p><strong>Item Total:</strong> ${formatCurrency(item.itemTotal)}</p>
        ${item.modifiers ? `<p><strong>Modifiers:</strong> ${item.modifiers}</p>` : ''}
        `;

        return card;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new OrderManager();
});