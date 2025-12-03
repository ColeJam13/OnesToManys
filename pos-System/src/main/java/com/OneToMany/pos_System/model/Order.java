package com.OneToMany.pos_System.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity                                          // Entity means "This java class represents a database table" / Spring manages this as a database entry
@Table(name = "orders")                          // "The database table is called orders"
public class Order {

    @Id                                                     // "This is the primary key"
    @GeneratedValue(strategy = GenerationType.IDENTITY)     // "Auto-increment this value" // when you create a new order, the database automatically assigns the next available number
    @Column(name = "order_id")                              // "In the database, call this column order_id"
    private Long orderId;

    @Column(name = "table_number")                          // these map Java field names (camelCase) to database column names (snake_case)
    private String tableNumber;

    @Column(name = "server_name")
    private String serverName;

    @Column(name = "order_timestamp")
    private Timestamp orderTimestamp;

    @Column(name = "guest_count")
    private Integer guestCount;

    private BigDecimal subtotal;                                 // fields without column dont need conversion
    private BigDecimal tax;
    private BigDecimal total;
    private String notes;

    public Order() {                                                             // Constructor called whenever you make a new order
        this.orderTimestamp = new Timestamp(System.currentTimeMillis());            // sets default values (timestamp = current time)
        this.subtotal = BigDecimal.ZERO;                                            // subtotal = 0.00
        this.tax = BigDecimal.ZERO;                                                 // tax = 0.00
        this.total = BigDecimal.ZERO;                                               // total = 0.00
    }

    public Long getOrderId() {                          // is Long because it can be null before it's saved (database hasn't assigned an ID yet)
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }

    public String getServerName() {
        return serverName;
    }

    public void setServerName(String serverName) {
        this.serverName = serverName;
    }

    public Timestamp getOrderTimestamp() {
        return orderTimestamp;
    }

    public void setOrderTimestamp(Timestamp orderTimestamp) {       // Timestamp stores both data and time (2024-12-03 14:30;00)
        this.orderTimestamp = orderTimestamp;
    }

    public Integer getGuestCount() {
        return guestCount;
    }

    public void setGuestCount(Integer guestCount) {
        this.guestCount = guestCount;
    }

    public BigDecimal getSubtotal() {                           // use BigDecimal for precise financial calculations // dont use float or double: they have rounding errors
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
    
    public BigDecimal getTax() {
        return tax;
    }

    public void setTax(BigDecimal tax) {
        this.tax = tax;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
