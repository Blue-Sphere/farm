package com.example.demo.cart;

import com.example.demo.order.Order;
import com.example.demo.order.OrderItem;
import com.example.demo.user.User;
import com.example.demo.user.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    CartRepository cartRepository;

    @Autowired
    UserService userService;

    Logger logger = LoggerFactory.getLogger(CartService.class);

    public boolean add(String email, CartItem cartItem){
        try {
            // 尋找是否有相同物品，有的話直接新增該物品數量
            Optional<CartItem> alreadyInCartsItem = cartRepository.findByProductId(cartItem.getProductId());
            if(alreadyInCartsItem.isPresent()){
                CartItem existingCartItem = alreadyInCartsItem.get();
                existingCartItem.setQuantity(existingCartItem.getQuantity() + cartItem.getQuantity());
                cartRepository.save(existingCartItem);
                return true;
            }

            cartItem.setBuyersEmail(email);
            cartRepository.save(cartItem);
            return true;
        }catch (Exception e){
            logger.info(e.getMessage());
            return false;
        }
    }

    public List<CartItem> get(String email){
        try{
            List<Optional<CartItem>> optionalCartItems = cartRepository.findByBuyersEmail(email);
            List<CartItem> cartItems = new ArrayList<CartItem>();
            for(Optional<CartItem> cartItem: optionalCartItems){
                if(cartItem.isPresent())
                    cartItems.add(cartItem.get());
            }
            return cartItems;
        }catch (Exception e){
            logger.info(e.getMessage());
            return null;
        }
    }

    public boolean delete(String email, Long Id){
        Optional<CartItem> cartItemOptional = cartRepository.findById(Id);
        if(cartItemOptional.isPresent()){
            CartItem cartItem = cartItemOptional.get();

            // 判斷該購物車添加者是否為刪除者
            if(cartItem.getBuyersEmail().equals(email)){
                cartRepository.delete(cartItem);
                return true;
            }
        }
        return false;
    }
}
