package com.example.demo.cart;

import com.example.demo.security.AuthenticationSecurity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    AuthenticationSecurity authenticationSecurity;

    @Autowired
    CartService cartService;

    @PostMapping(path = "/user/add")
    private ResponseEntity<String> confirmToCart(@RequestBody CartItem cartItem, @RequestHeader("Authorization") String authorization){
        String token = authorization.replace("Bearer ", "");
        if(!authenticationSecurity.validateUsersToken(token))
            return ResponseEntity.badRequest().body("不被接受的token");

        String email = authenticationSecurity.getUserEmailFromToken(token);
        boolean isAdded = cartService.add(email, cartItem);

        if(isAdded){
            return ResponseEntity.ok().body("已經添加至購物車");
        }
        return ResponseEntity.internalServerError().body("添加失敗");
    }

    @PostMapping(path = "/user/get")
    private ResponseEntity getAllFromCart(@RequestHeader("Authorization") String authorization){
        String token = authorization.replace("Bearer ", "");
        if(!authenticationSecurity.validateUsersToken(token))
            return ResponseEntity.badRequest().body("不被接受的token");

        String email = authenticationSecurity.getUserEmailFromToken(token);
        List<CartItem> cartItems = cartService.get(email);

        if(!cartItems.isEmpty()){
            return ResponseEntity.ok(cartItems);
        }
        return ResponseEntity.ok().body("您的購物車空空如也");
    }

    @DeleteMapping(path = "/user/delete/{id}")
    private ResponseEntity deleteItemFromCart(@RequestHeader("Authorization") String authorization, @PathVariable("id") Long cartItemsId){
        String token = authorization.replace("Bearer ", "");
        if(!authenticationSecurity.validateUsersToken(token))
            return ResponseEntity.badRequest().body("不被接受的token");

        String email = authenticationSecurity.getUserEmailFromToken(token);
        boolean result = cartService.delete(email, cartItemsId);
        if(result){
            return ResponseEntity.ok().body("移除成功");
        }
        return ResponseEntity.ok().body("移除失敗");
    }
}
