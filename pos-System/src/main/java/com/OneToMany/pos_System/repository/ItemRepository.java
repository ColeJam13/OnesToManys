package com.OneToMany.pos_System.repository;

import com.OneToMany.pos_System.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository                                                                 // Tells spring this is a repository (database access layer)
public interface ItemRepository extends JpaRepository<Item, Long> {         // extends JpaRepository to get automatic database methods // <Item, Long> means: work with item entities, and their ID is a long

}

/*

JQ to setup

## **How These Three Files Work Together**
```
Client Request Flow:
1. curl http://localhost:8080/api/items
   ↓
2. Spring routes to ItemController.getAllItems()
   ↓
3. Controller calls itemRepository.findAll()
   ↓
4. Repository generates SQL: SELECT * FROM items
   ↓
5. Database returns rows
   ↓
6. Repository converts rows to List<Item> objects
   ↓
7. Controller returns List<Item>
   ↓
8. Spring converts to JSON
   ↓
9. Client receives: [{"itemId": 1, "itemName": "Burger", ...}, ...]

*/