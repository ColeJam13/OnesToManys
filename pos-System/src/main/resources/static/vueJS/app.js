import { formatCurrency as formatCurrencyUtil } from './utils.js';
import { fetchAllData, fetchItemsByOrderId, createOrder, updateOrder, deleteOrder, createItem, updateItem, deleteItem } from './api.js';

const { createApp } = Vue;

createApp({
    data() {
        return {
            orders: [],
            items: [],
            orderItems: [],
            currentView: 'landing',
            selectedOrderId: null,
            selectedOrder: null,
            isLoading: false,
            isLoadingItems: false,

            newOrder: {
                tableNumber: '',
                serverName: '',
                guestCount: null,
                notes: ''
            },
            newItem: {
                orderId: null,
                itemName: '',
                itemQuantity: null,
                itemPrice: null,
                sides: '',
                sidePrice: null,
                modifiers: ''
            }
        };
    },

methods: {
    showLandingView() {
        this.currentView = 'landing';
    },

    showOrdersView() {
        this.currentView = 'orders';
    },

    showAllItemsView() {
        this.currentView = 'allItems';
    },

    showAddOrderView() {
        this.currentView = 'addOrder';
        this.newOrder = {
            tableNumber: '',
            serverName: '',
            guestCount: null,
            notes: ''
        };
    },

    showAddItemView() {
        this.currentView = 'addItem';
        this.newItem = {
            orderId: null,
            itemName: '',
            itemQuantity: null,
            itemPrice: null,
            sides: '',
            sidePrice: null,
            modifiers: ''
        };
    },

    async loadAndShowOrders() {
        try {
            this.isLoading = true;
            const data = await fetchAllData();
            this.orders = data.orders;
            this.items = data.items;
            this.showOrdersView();
        } catch (error) {
            console.error('Failed to load orders:', error);
            alert('Failed to load orders. Please try again.');
        } finally {
            this.isLoading = false;
        }
    },

    async loadAndShowAllItems() {
        try {
            this.isLoading = true;
            const data = await fetchAllData();
            this.orders = data.orders;
            this.items = data.items;
            this.showAllItemsView();
        } catch (error) {
            console.error('Failed to load items:', error);
            alert('Failed to load items. Please try again.');
        } finally {
            this.isLoading = false;
        }
    },

    async showOrderItemsView(orderId) {
        this.currentView = 'orderItems';
        this.selectedOrderId = orderId;
        this.selectedOrder = this.orders.find(o => o.orderId === orderId);

        try {
            this.isLoadingItems = true;
            this.orderItems = await fetchItemsByOrderId(orderId);
        } catch (error) {
            console.error('Failed to load items:', error);
            alert('Failed to load items.');
        } finally {
            this.isLoadingItems = false;
        }
    },

    async handleAddOrderSubmit() {
        try {
            const orderData = {
                tableNumber: this.newOrder.tableNumber,
                serverName: this.newOrder.serverName,
                guestCount: this.newOrder.guestCount,
                notes: this.newOrder.notes || null,
                subtotal: 0,
                tax: 0,
                total: 0
            };

            const createdOrder = await createOrder(orderData);
            alert(`Order #${createdOrder.orderId} created successfully!`);
            this.showLandingView();
        } catch (error) {
            console.error('Failed to create order:', error);
            alert('Failed to create order. Please try again.');
        }
    },

    async handleAddItemSubmit() {
        try {
            const itemTotal = (this.newItem.itemPrice * this.newItem.itemQuantity) +
                            (this.newItem.sidePrice || 0);
            
            const itemData = {
                orderId: this.newItem.orderId,
                itemName: this.newItem.itemName,
                itemQuantity: this.newItem.itemQuantity,
                itemPrice: this.newItem.itemPrice,
                sides: this.newItem.sides || null,
                sidePrice: this.newItem.sidePrice || null,
                modifiers: this.newItem.modifiers || null,
                itemTotal
            };

            const createdItem = await createItem(itemData);
            alert(`Item "${createdItem.itemName}" added successfully!`);
            this.showLandingView();
        } catch (error) {
            console.error('Failed to create item:', error);
            alert('Failed to create item. Please try again.');
        }
    },

    async handleEditOrder(orderId) {
        const order = this.orders.find(o => o.orderId === orderId);

        if (!order) {
            alert('Order not found');
            return;
        }

        const newTableNumber = prompt('Enter new table number:', order.tableNumber);
        const newServerName = prompt('Enter new server name:', order.serverName);
        const newGuestCount = prompt('Enter new guest count:', order.guestCount);
        const newNotes = prompt('Enter new notes:', order.notes || '');

        if (newTableNumber === null) return;

        const updatedOrder = {
            ...order,
            tableNumber: newTableNumber,
            serverName: newServerName,
            guestCount: parseInt(newGuestCount),
            notes: newNotes || null
        };

        try {
            await updateOrder(orderId, updatedOrder);
            alert('Order updated successfully!');
            await this.loadAndShowOrders();
        } catch (error) {
            console.error('Failed to update order:', error);
            alert('Failed to update order.');
        }
    },

    async handleDeleteOrder(orderId) {
        const order = this.orders.find(o => o.orderId === orderId);

        if (!order) {
            alert('Order not found');
            return;
        }

        const confirmed = confirm(`Are you sure you want to delete this Order #${orderId}?`);
        if (!confirmed) return;

        try {
            await deleteOrder(orderId);
            alert('Order deleted successfully!');
            await this.loadAndShowOrders();
        } catch (error) {
            console.error('Failed to delete order:', error);
            alert('Failed to delete order.');
        }
    },

    async handleEditItem(itemId) {
        const item = this.items.find(i => i.itemId === itemId);

        if (!item) {
            alert('Item not found');
            return;
        }

        const newItemName = prompt('Enter new item name:', item.itemName);
        const newQuantity = prompt('Enter new quantity:', item.itemQuantity);
        const newPrice = prompt('Enter new price:', item.itemPrice);
        const newSides = prompt('Enter sides (leave empty for none)', item.sides || '');
        const newSidePrice = prompt('Enter side price (leave empty for none):', item.sidePrice || '');
        const newModifiers = prompt('Enter modifiers (leave empty for none):', item.modifiers || '');

        if (newItemName === null) return;

        const quantity = parseInt(newQuantity);
        const price = parseFloat(newPrice);
        const sPrice = newSidePrice ? parseFloat(newSidePrice) : 0;
        const itemTotal = (price * quantity) + sPrice;

        const updatedItem = {
            ...item,
            itemName: newItemName,
            itemQuantity: quantity,
            itemPrice: price,
            sides: newSides || null,
            sidePrice: newSidePrice ? parseFloat(newSidePrice) : null,
            modifiers: newModifiers || null,
            itemTotal
        };

        try {
            await updateItem(itemId, updatedItem);
            alert('Item updated successfully!');
            await this.loadAndShowAllItems();
        } catch (error) {
            console.error('Failed to update item:', error);
            alert('Failed to update item.');
        }
    },

    async handleDeleteItem(itemId) {
        const item = this.items.find(i => i.itemId === itemId);

        if (!item) {
            alert('Item not found');
            return;
        }

        const confirmed = confirm(`Are you sure you want to delete "${item.itemName}"?`);
        if (!confirmed) return;

        try {
            await deleteItem(itemId);
            alert('Item deleted successfully!');
            await this.loadAndShowAllItems();
        } catch (error) {
            console.error('Failed to delete item:', error);
            alert('Failed to delete item.');
        }
    },

    formatCurrency(amount) {
        return formatCurrencyUtil(amount);
       }
    }
}).mount('#app');