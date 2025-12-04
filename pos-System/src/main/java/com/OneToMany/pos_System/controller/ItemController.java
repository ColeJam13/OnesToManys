package com.OneToMany.pos_System.controller;

import com.OneToMany.pos_System.model.Item;
import com.OneToMany.pos_System.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController                                         // Tells spring this handles web requests and automatically converts to/from JSON
@RequestMapping("/api/items")                           // all endpoints in this class start with /api/items
public class ItemController {

    @Autowired                                          // Dependency injection - SPring automatically gives us an ItemRepository // lets us talk to database
    private ItemRepository itemRepository;              

    @GetMapping                                         // handles Get /api/items // returns all items as a JSON array
    public List<Item> getAllItems() {                   // Call repository to get all items from database // spring converts List<Item> to JSON
        return itemRepository.findAll();
    }

    @GetMapping("/{id}")                                        // handles GET /api/items/1, 2, 3 ... etc. // returns single item as JSON object
    public Item getItemById(@PathVariable Long id) {            // PathVariable captures the {id} from the URL
        return itemRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(     // if item doesnt exist, throw 404 Not Found error
                HttpStatus.NOT_FOUND,
                "Item not found with id: " + id
            )); 
    }

    @PostMapping                                                // Handles POST /api/items // expects JSON in request body 
    @ResponseStatus(HttpStatus.CREATED)                         // creates item with auto-generated ID as JSON // 201 created returned 
    public Item createItem(@RequestBody Item item) {            // @RequestBody converts incoming JSON to Item object // spring calls all setters automatically
        return itemRepository.save(item);                       // save item to database // after the save() the item.itemId will be populated by database
    }                                                                   // Spring converts returned Item back to JSON and sends to client

    @PutMapping("/{id}")
    public Item updateItem(@PathVariable Long id, @RequestBody Item itemDetails) {

        Item item = itemRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Item not found with id: " + id
            ));

        item.setOrderId(itemDetails.getOrderId());
        item.setItemName(itemDetails.getItemName());
        item.setItemQuantity(itemDetails.getItemQuantity());
        item.setItemPrice(itemDetails.getItemPrice());
        item.setItemStatus(itemDetails.getItemStatus());
        item.setSides(itemDetails.getSides());
        item.setSidePrice(itemDetails.getSidePrice());
        item.setItemTotal(itemDetails.getItemTotal());
        item.setModifiers(itemDetails.getModifiers());

        return itemRepository.save(item);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteItem(@PathVariable Long id) {

        Item item = itemRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Item not found with id: " + id
            ));

        itemRepository.delete(item);
    }
}