package com.example.demo.order;

import com.example.demo.admin.Admin;
import com.example.demo.admin.AdminService;
import com.example.demo.assets.AssetsService;
import com.example.demo.cart.CartItem;
import com.example.demo.product.Product;
import com.example.demo.product.ProductService;
import com.example.demo.user.User;
import com.example.demo.user.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private AssetsService assetsService;

    @Autowired
    private UserService userService;

    @Autowired
    private AdminService adminService;

    Logger logger = LoggerFactory.getLogger(OrderService.class);

    /* User */

    public String buy(ArrayList<CartItem> cartItems, String buyersEmail){
        User user = userService.getUserByEmail(buyersEmail);

        Integer totalPrice = 0;
        Order order = new Order();
        List<OrderItem> orderItems = new ArrayList<>();
        /* 檢查所有訂單是否正常 */
        for(CartItem cartItem: cartItems) {
            Product product = productService.getProductById(cartItem.getProductId());
            Integer quantity = cartItem.getQuantity();
            if (quantity <= 0) {
                throw new IllegalStateException("所輸入數量不可小於或等於0");
            } else if (quantity > product.getQuantity()) {
                throw new IllegalStateException("訂購數量大於產品[" + product.getName() + "]所提供的數量");
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(quantity);
            orderItem.setPrice(product.getPrice());
            orderItem.setOrder(order);

            // 資料庫商品減去購買數量
            product.setQuantity(product.getQuantity()- quantity);
            productService.updateProduct(product);

            orderItem.calculateTotal();
            totalPrice += orderItem.getTotal();

            order.addOrderItem(orderItem);
            orderItems.add(orderItem);

        }

        order.setOrderItems(orderItems);
        order.setBoughtByUser(user);
        order.setStatus("待確認");
        order.setTotal(totalPrice);
        orderRepository.save(order);

        return "Success to buy items, waiting for administrator check";
    }

    public void cancelOrder(Long id){
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if(optionalOrder.isPresent()){
            Order order = optionalOrder.get();
            if(order.getStatus().equals("準備中")){
                throw new IllegalStateException("訂單已確認且準備中，無法取消，欲取消請通知管理員");
            }

            /* 歸還物品數量 */
            List<OrderItem> orderItems = order.getOrderItems();
            for(OrderItem orderItem: orderItems){
                Product product = orderItem.getProduct();
                Product productFromDataBase = productService.getProductByName(product.getName());
                productFromDataBase.setQuantity(productFromDataBase.getQuantity()+product.getQuantity());
                productService.updateProduct(productFromDataBase);
            }
            order.setStatus("已取消");
            orderRepository.save(order);
        }
    }


    /* Admin */

    public List<Order> getOrder(String email){
        User user = userService.getUserByEmail(email);
        List<Order> orderList = orderRepository.findByBoughtByUser(user);

        return orderList;
    }

    public void checkOrder(Long id){
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if(optionalOrder.isPresent()){
            Order order = optionalOrder.get();
            order.setStatus("準備中");
            orderRepository.save(order);
        }
    }

    public void completeOrder(Long id){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String adminEmail = authentication.getName();
        Admin admin = adminService.getAdminByEmail(adminEmail);

        Optional<Order> optionalOrder = orderRepository.findById(id);
        if(optionalOrder.isPresent()){
            Order order = optionalOrder.get();
            order.setStatus("已完成");
            orderRepository.save(order);

            // 把紀錄轉入資產紀錄中
            assetsService.addOrderAssetsLog(order, admin);
        }
    }

    public void removeOrder(Long id){
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if(optionalOrder.isPresent()){
            Order order = optionalOrder.get();

            /* 歸還物品數量 */
            List<OrderItem> orderItems = order.getOrderItems();
            for(OrderItem orderItem: orderItems){
                Product product = orderItem.getProduct();
                Product productFromDataBase = productService.getProductByName(product.getName());
                productFromDataBase.setQuantity(productFromDataBase.getQuantity()+product.getQuantity());
                productService.updateProduct(productFromDataBase);
            }
            orderRepository.deleteById(id);

        }
    }

    public List<Order> getTheOrderNeedToConfirm(String status){
        return orderRepository.findSpecifyStatusOrder(status);
    }

    public int[] getOrderSummaryCount(){
        List<Object[]> counts =  orderRepository.countOrdersByStatus();

        int[] result = new int[3];

        for(Object[] count: counts){
            String status = (String) count[0];
            Integer countValue = ((Long)count[1]).intValue();

            switch (status) {
                case "待確認":
                    result[0] = countValue.intValue();
                    break;
                case "準備中":
                    result[1] = countValue.intValue();
                    break;
                case "已完成":
                    result[2] = countValue.intValue();
                    break;
                default:
                    throw new IllegalStateException("無法識別的狀態: " + status);
            }
        }

        return result;
    }
    
    public List<Order> getCriteriaSearchOrder(CriteriaSearchOrderDto criteriaSearchOrderDto){
        return orderRepository.findOrdersByCriteria(criteriaSearchOrderDto);
    }

}
