fetch('http://localhost:8080/api/orders')
    .then(response => response.json())
    .then(orders => {
        const tbody = document.getElementById('ordersBody');
        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${order.orderId}</td>
            <td>${order.tableNumber}</td>
            <td>${order.serverName}</td>
            <td>${order.guestCount}</td>
            <td>$${order.total.toFixed(2)}</td>
            <td>${order.notes || 'None'}</td> 
            `;
            tbody.appendChild(row);
        });
    });

fetch('http://localhost:8080/api/items')
    .then(response => response.json())
    .then(items => {
        const tbody = document.getElementById('itemsBody');
        items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${item.itemId}</td>
            <td>${item.orderId}</td>
            <td>${item.itemName}</td>
            <td>${item.itemQuantity}</td>
            <td>$${item.itemPrice.toFixed(2)}</td>
            <td>${item.sides || 'None'}</td>
            <td>$${item.sidePrice ? item.sidePrice.toFixed(2) : '0.00'}</td>
            <td>$${item.itemTotal.toFixed(2)}</td>
            <td>${item.modifiers || 'None'}</td> 
            `;
            tbody.appendChild(row);
        });
    });