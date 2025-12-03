DROP TABLE IF EXISTS items;                             -- Deletes the tables if they already exists
DROP TABLE IF EXISTS orders;                                -- dop items FIRST because they depend on orders

CREATE TABLE IF NOT EXISTS orders (                            -- only create a new orders table if it doesnt exist
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,                -- order_id = column name / INTEGER = data type / PRIMARY KEY = uniquely identify each row / AUTOINCREMENT = database automaticalls assigns 1,2,3,4
    table_number VARCHAR(20) NOT NULL,                         -- table_number = column name / VARCHAR(20) = variable text length (max 20 characters) / NOT NULL = field is required
    server_name VARCHAR(100) NOT NULL,                         -- server_name = column name / VARCHAR(100) = text length up to 100 characters / NOT NULL = field is required
    order_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,       -- order_timestamp = column name / TIMESTAMP = stores date and time / DEFAULT CURRENT_TIMESTAMP = if no value, use "right now"
    guest_count INTEGER,                                       -- guest count = column name / INTEGER = whole number for how many guests
    subtotal DECIMAL(10,2) DEFAULT 0.00,                       -- subtotal = column name / DECIMAL(10,2) = decimal number with 10 digits max, 2 digits after decimal point / DEFAULT 0.00 = if not provided, start at zero
    tax DECIMAL(10,2) DEFAULT 0.00,                            -- tax = column name / DECIMAL(10,2) = decimal number with 10 digits max, 2 digits after decimal point / DEFAULT 0.00 = if not provided, start at zero
    total DECIMAL(10,2) DEFAULT 0.00,                          -- total = column name / DECIMAL(10,2) = decimal number with 10 digits max, 2 digits after decimal point / DEFAULT 0.00 = if not provided, start at zero
    notes TEXT                                                 -- notes = column name / TEXT = store infinite text / default will be null
);

CREATE TABLE IF NOT EXISTS items (
    item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL, 
    item_name VARCHAR(100) NOT NULL,
    item_quantity INTEGER NOT NULL DEFAULT 1,
    item_price DECIMAL(10,2) NOT NULL,
    item_status VARCHAR(20) DEFAULT 'PENDING',
    sides TEXT,
    item_total DECIMAL(10,2),
    modifiers TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_order_timestamp ON orders(order_timestamp);
CREATE INDEX IF NOT EXISTS idx_items_order_id ON items(order_id);