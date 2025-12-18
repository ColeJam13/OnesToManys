import { formatCurrency, createElement, showError, createLoadingIndicator } from './utils.js';
import { fetchAllData, fetchItemsByOrderId, createOrder, updateOrder, deleteOrder } from './api.js';

class OrderManager {
    constructor() {

        this.orders = [];
        this.items = [];
        this.currentView = 'landing';
        this.selectedOrderId = null;
        
        this.landingView = document.getElementById('landingView');
        this.ordersView = document.getElementById('ordersView');
        this.orderItemsView = document.getElementById('orderItemsView');
        this.allItemsView = document.getElementById('allItemsView');
        this.addOrderView = document.getElementById('addOrderView');
        
        this.ordersContainer = document.getElementById('ordersContainer');
        this.orderItemsContainer = document.getElementById('orderItemsContainer');
        this.allItemsContainer = document.getElementById('allItemsContainer');
        this.orderInfoContainer = document.getElementById('orderInfoContainer');
        
        this.bindEvents();
        this.showLandingView();
    }
    
    bindEvents() {

        document.getElementById('showAllOrdersBtn')
            .addEventListener('click', () => this.loadAndShowOrders());
        document.getElementById('addOrderBtn')
            .addEventListener('click', () => this.showAddOrderView());
            
        document.getElementById('showAllItemsBtn')
            .addEventListener('click', () => this.loadAndShowAllItems());
        document.getElementById('addItemBtn')
            .addEventListener('click', () => alert('Add Item feature coming soon!'));
            
        document.getElementById('backToHomeBtn')
            .addEventListener('click', () => this.showLandingView());
        document.getElementById('backToOrdersBtn')
            .addEventListener('click', () => this.showOrdersView());
        document.getElementById('backToHomeFromItemsBtn')
            .addEventListener('click', () => this.showLandingView());
        document.getElementById('backToHomeFromAddOrderBtn')
            .addEventListener('click', () => this.showLandingView());
            
        document.getElementById('addOrderForm')
            .addEventListener('submit', (e) => this.handleAddOrderSubmit(e));
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

    async loadAndShowAllItems() {
        try {
            this.allItemsContainer.innerHTML = '';
            this.allItemsContainer.appendChild(createLoadingIndicator());
            
            const data = await fetchAllData();
            this.orders = data.orders;
            this.items = data.items;
            
            this.showAllItemsView();
        } catch (error) {
            showError('Failed to load items. Please try again.');
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

    async showOrderItemsView(orderId) {
        this.hideAllViews();
        this.orderItemsView.classList.remove('hidden');
        this.currentView = 'orderItems';
        this.selectedOrderId = orderId;
        
        this.renderOrderDetails(orderId);
        this.orderItemsContainer.innerHTML = '';
        this.orderItemsContainer.appendChild(createLoadingIndicator());
        
        try {
            const orderItems = await fetchItemsByOrderId(orderId);
            this.renderOrderItems(orderItems);
        } catch (error) {
            showError('Failed to load items.');
        }
    }

    showAllItemsView() {
        this.hideAllViews();
        this.allItemsView.classList.remove('hidden');
        this.currentView = 'allItems';
        this.renderAllItems();
    }

    showAddOrderView() {
        this.hideAllViews();
        this.addOrderView.classList.remove('hidden');
        this.currentView = 'addOrder';

        document.getElementById('addOrderForm').reset();
    }

    hideAllViews() {
        this.landingView.classList.add('hidden');
        this.ordersView.classList.add('hidden');
        this.orderItemsView.classList.add('hidden');
        this.allItemsView.classList.add('hidden');
        this.addOrderView.classList.add('hidden');
    }

    async handleAddOrderSubmit(event) {
        event.preventDefault();

        const tableNumber = document.getElementById('tableNumber').value;
        const serverName = document.getElementById('serverName').value;
        const guestCount = parseInt(document.getElementById('guestCount').value);
        const notes = document.getElementById('notes').value;

            console.log('=== CREATE ORDER DEBUG ===');
    console.log('tableNumber:', tableNumber);
    console.log('serverName:', serverName);
    console.log('guestCount:', guestCount);
    console.log('notes:', notes);
        
        const newOrder = {
            tableNumber,
            serverName,
            guestCount,
            notes: notes || null,
            subtotal: 0,
            tax: 0,
            total: 0
        };

            console.log('New order object:', newOrder);
        
        try {
            const createdOrder = await createOrder(newOrder);
            
            alert(`Order #${createdOrder.orderId} created successfully!`);
            
            this.showLandingView();
            
        } catch (error) {
            showError('Failed to create order. Please try again.');
        }
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
            <div class="card-actions">
                <button class="show-items-btn" data-order-id="${order.orderId}">Show Items</button>
                <button class="edit-btn" data-order-id="${order.orderId}">Edit</button>
                <button class="delete-btn" data-order-id="${order.orderId}">Delete</button>
            </div>
        `;

        const showItemsBtn = card.querySelector('.show-items-btn');
        showItemsBtn.addEventListener('click', () => {
            const orderId = parseInt(showItemsBtn.dataset.orderId);
            this.showOrderItemsView(orderId);
        });
        
        const editBtn = card.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            const orderId = parseInt(editBtn.dataset.orderId);
            this.handleEditOrder(orderId);
        });
        
        const deleteBtn = card.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            const orderId = parseInt(deleteBtn.dataset.orderId);
            this.handleDeleteOrder(orderId);
        });
        
        return card;
    }

    async handleEditOrder(orderId) {
        const order = this.orders.find(o => o.orderId === orderId);

    console.log('Original order object:', order);
    console.log('Table number from original order:', order.tableNumber);
        
        if (!order) {
            showError('Order not found');
            return;
        }

        const newTableNumber = prompt('Enter new table number:', order.tableNumber);
        const newServerName = prompt('Enter new server name:', order.serverName);
        const newGuestCount = prompt('Enter new guest count:', order.guestCount);
        const newNotes = prompt('Enter new notes:', order.notes || '');

    console.log('User entered table number:', newTableNumber);
    console.log('Type of newTableNumber:', typeof newTableNumber);
        
        if (newTableNumber === null) return;
        
        const updatedOrder = {
            ...order,
            tableNumber: newTableNumber,
            serverName: newServerName,
            guestCount: parseInt(newGuestCount),
            notes: newNotes || null
        };

    console.log('Updated order object to send:', updatedOrder);
    console.log('Updated order tableNumber:', updatedOrder.tableNumber);
        
        try {
            await updateOrder(orderId, updatedOrder);
            alert('Order updated successfully!');
            this.loadAndShowOrders();
        } catch (error) {
            showError('Failed to update order.');
        }
    }

    async handleDeleteOrder(orderId) {
        const order = this.orders.find(o => o.orderId === orderId);
        
        if (!order) {
            showError('Order not found');
            return;
        }
        
        const confirmed = confirm(`Are you sure you want to delete Order #${orderId}?`);
        
        if (!confirmed) return;
        
        try {
            await deleteOrder(orderId);
            alert('Order deleted successfully!');
            this.loadAndShowOrders();
        } catch (error) {
            showError('Failed to delete order.');
        }
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

    renderOrderItems(items) {
        this.orderItemsContainer.innerHTML = '';
        
        if (items.length === 0) {
            this.orderItemsContainer.innerHTML = '<p>No items found for this order.</p>';
            return;
        }
        
        items.forEach(item => {
            const itemCard = this.createItemCard(item);
            this.orderItemsContainer.appendChild(itemCard);
        });
    }

    renderAllItems() {
        this.allItemsContainer.innerHTML = '';
        
        if (this.items.length === 0) {
            this.allItemsContainer.innerHTML = '<p>No items found.</p>';
            return;
        }
        
        this.items.forEach(item => {
            const itemCard = this.createItemCard(item);
            this.allItemsContainer.appendChild(itemCard);
        });
    }

    createItemCard(item) {
        const card = createElement('div', 'item-card');
        
        card.innerHTML = `
            <h4>${item.itemName}</h4>
            <p><strong>Order ID:</strong> ${item.orderId}</p>
            <p><strong>Quantity:</strong> ${item.itemQuantity}</p>
            <p><strong>Item Price:</strong> ${formatCurrency(item.itemPrice)}</p>
            ${item.sides ? `<p><strong>Sides:</strong> ${item.sides}</p>` : ''}
            ${item.sidePrice ? `<p><strong>Side Price:</strong> ${formatCurrency(item.sidePrice)}</p>` : ''}
            <p><strong>Item Total:</strong> ${formatCurrency(item.itemTotal)}</p>
            ${item.modifiers ? `<p><strong>Modifiers:</strong> ${item.modifiers}</p>` : ''}
            <div class="card-actions">
                <button class="edit-btn" data-item-id="${item.itemId}">Edit</button>
                <button class="delete-btn" data-item-id="${item.itemId}">Delete</button>
            </div>
        `;

        const editBtn = card.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            const itemId = parseInt(editBtn.dataset.itemId);
            alert(`Edit Item #${itemId} - Feature coming soon!`);
        });

        const deleteBtn = card.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            const itemId = parseInt(deleteBtn.dataset.itemId);
            alert(`Delete Item #${itemId} - Feature coming soon!`);
        });
        
        return card;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new OrderManager();
});