package com.OneToMany.pos_System.controller;

import com.OneToMany.pos_System.model.Order;
import com.OneToMany.pos_System.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController                     // Tells Spring "This class handles web requests" // Automatically converts Java objects to JSON (and. vice versa)    
@RequestMapping("/api/orders")      // Sets the base URL for ALL methods in this controller // every endpoint in this class will start with /api/orders
public class OrderController {      

    @Autowired                                  // Dependency injection - Spring automatically creates an OrderRepository instance
    private OrderRepository orderRepository;        // how the controller gets access to the database methods

    @GetMapping                                 // @GetMapping handles HTTP GET requests /api/orders
    public List<Order> getAllOrders() {         // calls orderRepository.findAll() to get all orders from database
        return orderRepository.findAll();       // returns a List<Order> which Spring automatically converts to JSON
    }

    @GetMapping("/{id}")                                            // handles GET requests to /api/orders/1 etc.
    public Order getOrderById(@PathVariable Long id) {              // captures the {id} from the URL (api/orders/5 -> id = 5)
        return orderRepository.findById(id)                         // findById(id) returns an Optional<Order>
            .orElseThrow(() -> new ResponseStatusException(         // if it doesnt exist, throws a 404
                HttpStatus.NOT_FOUND,
                "Order not found with id: " + id
            ));
    }

    @PostMapping                                                    // Handles HTTP POST requests to /api/orders
    @ResponseStatus(HttpStatus.CREATED)                             // Returns HTTP status 201 (created) instead of 200 (just ok)
    public Order createOrder(@RequestBody Order order) {            // @RequestBody Order order - takes JSON from the request body and converts it to Order object
        return orderRepository.save(order);                         // save(order) inserts the order into the database
    }

}