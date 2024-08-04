package com.example.demo.order;

import com.example.demo.View;
import com.example.demo.cart.CartItem;
import com.example.demo.product.Product;
import com.example.demo.security.AuthenticationSecurity;
import com.fasterxml.jackson.annotation.JsonView;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/order")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    @Autowired
    private AuthenticationSecurity authenticationSecurity;

    @PostMapping(path = "/user/buy")
    private ResponseEntity Buy(@RequestBody ArrayList<CartItem> cartItems, @RequestHeader("Authorization") String authorization){
        String token = authorization.replace("Bearer ","");

        if(!authenticationSecurity.validateUsersToken(token)){
            return ResponseEntity.badRequest().body("不被接收的token");
        }
        String email = authenticationSecurity.getUserEmailFromToken(token);
        orderService.buy(cartItems, email);

        return ResponseEntity.ok("已傳送訂單需求，待使用者確認");
    }

    @PostMapping(path = "/user/get")
    @JsonView(View.UserOrders.class)
    private ResponseEntity getOrder(@RequestHeader("Authorization") String authorization){
        String token = authorization.replace("Bearer ", "");
        if(!authenticationSecurity.validateUsersToken(token))
            return ResponseEntity.badRequest().body("不被接受的token");

        String email = authenticationSecurity.getUserEmailFromToken(token);
        List orders = orderService.getOrder(email);
        if(!orders.isEmpty()){
            return ResponseEntity.ok(orders);
        }else if(orders.isEmpty()){
            return null;
        }

        return ResponseEntity.internalServerError().body("獲取訂單資訊失敗");
    }

    @PostMapping(path = "/user/cancel")
    @JsonView(View.UserOrders.class)
    private String cancelOrder(Long id){
        orderService.cancelOrder(id);
        return "訂單編號"+id+"已取消";
    }

    @PostMapping(path = "/admin/check_order")
    private String checkOrder(@RequestParam Long id){
        orderService.checkOrder(id);
        return "訂單編號"+id+"已確認";
    }

    @PostMapping(path = "/admin/complete_order")
    private String completeOrder(@RequestParam Long id){
        orderService.completeOrder(id);
        return "訂單編號"+id+"已完成";
    }

    @PostMapping(path = "/admin/remove_order")
    private String removeOrder(@RequestParam Long id){
        orderService.removeOrder(id);
        return "訂單編號"+id+"已刪除";
    }

    @JsonView(View.AdminCheckOrders.class)
    @PostMapping(path = "/admin/order_need_confirm")
    private List<Order> getTheOrderNeedToConfirm(@RequestParam String status){
        return orderService.getTheOrderNeedToConfirm(status);
    }

    @PostMapping(path = "/admin/order_need_confirm_length")
    private Integer getTheOrderNeedToConfirmLength(@RequestParam String status){
        return orderService.getTheOrderNeedToConfirm(status).size();
    }

    @PostMapping(path = "/admin/orders_summary_count")
    private ResponseEntity getOrdersSummaryCount(@RequestHeader("Authorization") String authorization){
        String token = authorization.replace("Bearer ", "");
        if(!authenticationSecurity.validateAdminsToken(token))
            return ResponseEntity.badRequest().body("不被接受的token");

        return ResponseEntity.ok().body(orderService.getOrderSummaryCount());
    }

    @JsonView(View.UserOrders.class)
    @PostMapping(path = "/admin/criteria_search")
    private ResponseEntity getOrdersByCriteria(@RequestBody CriteriaSearchOrderDto criteriaSearchOrderDto){
        List<Order> result = orderService.getCriteriaSearchOrder(criteriaSearchOrderDto);

        return ResponseEntity.ok().body(result);
    }
}
