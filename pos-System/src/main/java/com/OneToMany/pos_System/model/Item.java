package com.OneToMany.pos_System.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity                                 // tells Spring this is a database entity (table)
@Table(name = "items")                  // specifies the name of the table in the database
public class Item {

    @Id                                                     // primary key for the items table
    @GeneratedValue(strategy = GenerationType.IDENTITY)     // database auto-generates this ID (1,2,3,4...)
    @Column(name = "item_id")                               // column name is "item_id"
    private Long itemId;

    @Column(name = "order_id")                              // Foreign key - links this item to an order
    private Long orderId;

    @Column(name = "item_name")                             // name of the dish
    private String itemName;

    @Column(name = "item_quantity")                         // how many of the item
    private Integer itemQuantity;

    @Column(name = "item_price")                            // price of the item
    private BigDecimal itemPrice;

    @Column(name = "item_status")                           // status of the item (PENDING, PREP, READY, SERVED)
    private String itemStatus;

    private String sides;                                   // option for sides

    @Column(name = "side_price")                            // price for sides
    private BigDecimal sidePrice;

    @Column(name = "item_total")                            // total cost for this item
    private BigDecimal itemTotal;

    private String modifiers;                               // line for mods

    public Item() {                                         // Default constructor called when you create new items
        this.itemQuantity = 1;                                  // default quantity is 1
        this.itemStatus = "PENDING";                            // default status is pending
    }

    public Long getItemId() {                              // returns item ID
        return itemId;
    }

    public void setItemId(Long orderId) {                   // sets item ID
        this.orderId = orderId;
    }

    public Long getOrderId() {                              // returns order ID
        return orderId;
    }

    public void setOrderId(Long orderId) {                  // set which order this item belongs to
        this.orderId = orderId;
    }

    public String getItemName() {                           // returns name of dish or drink
        return itemName;
    }

    public void setItemName(String itemName) {              // set the name of the dish or drink
        this.itemName = itemName;
    }

    public Integer getItemQuantity() {                      // returns how many of this item
        return itemQuantity;
    }

    public void setItemQuantity(Integer itemQuantity) {     // sets how many of this item
        this.itemQuantity = itemQuantity;
    }

    public BigDecimal getItemPrice() {                      // returns the item price
        return itemPrice;
    }

    public void setItemPrice(BigDecimal itemPrice) {        // sets the item price
        this.itemPrice = itemPrice;
    }

    public String getItemStatus() {                         // returns the current status
        return itemStatus;
    }

    public void setItemStatus(String itemStatus) {          // sets the item status
        this.itemStatus = itemStatus;
    }

    public String getSides() {                              // returns what sides came with the item
        return sides;
    }

    public void setSides(String sides) {                    // sets what sides came with the item
        this.sides = sides;
    }

    public BigDecimal getSidePrice() {
        return sidePrice;
    }

    public void setSidePrice(BigDecimal sidePrice) {
        this.sidePrice = sidePrice;
    }


    public BigDecimal getItemTotal() {                      // returns the total cost of item (quantity * price)
        return itemTotal;
    }

    public void setItemTotal(BigDecimal itemTotal) {        // sets the total cost
        this.itemTotal = itemTotal;
    }

    public String getModifiers() {                          // returns special requests/random mods
        return modifiers;
    }

    public void setModifiers(String modifiers) {            // sets special requests/random mods
        this.modifiers = modifiers;
    }
}
