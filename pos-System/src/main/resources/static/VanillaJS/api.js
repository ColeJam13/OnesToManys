const API_BASE_URL = 'http://localhost:8080/api';

export async function fetchOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`);

        if (!response.ok) {
            throw new Error(`Failed to fetch order: ${response.status}`);
        }

        const orders = await response.json();
        return orders;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
}

export async function fetchItems() {
    try {
        const response = await fetch(`${API_BASE_URL}/items`);

        if (!response.ok) {
            throw new Error(`Failed to fetch items: ${response.status}`);
        }

        const items = await response.json();
        return items;
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
}

export async function fetchItemsByOrderId(orderId) {
    const allItems = await fetchItems();
    return allItems.filter(item => item.orderId === orderId);
}

export async function fetchAllData() {
    try {
        const [orders, items] = await Promise.all([
            fetchOrders(),
            fetchItems()
        ]);

        return { orders, items };
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export async function createOrder(orderData) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error(`Failed to create order: ${response.status}`);
        }

        const createdOrder = await response.json();
        return createdOrder;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

export async function updateOrder(orderId, orderData) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error(`Failed to update order: ${response.status}`);
        }

        const updateOrder = await response.json();
        return updatedOrder;
    } catch (error) {
        console.error('Error updating order:', error);
        throw error;
    }
}

export async function deleteOrder(orderId) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Failed to delete order: ${response.status}`);
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        throw error;
    }
}
