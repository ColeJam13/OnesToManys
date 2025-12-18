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

                console.log('=== API CREATE ORDER ===');
        console.log('Sending:', JSON.stringify(orderData, null, 2));


        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

                console.log('Response status:', response.status);

                

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

                console.log('=== UPDATE ORDER DEBUG ===');
        console.log('Order ID:', orderId);
        console.log('Order Data:', orderData);
        console.log('JSON being sent:', JSON.stringify(orderData, null, 2));

        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(orderData)
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.log('Error response body:', errorText);
            throw new Error(`Failed to update order: ${response.status}`);
        }

        const updatedOrder = await response.json();
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
