package com.example.demo.supplies;

import com.example.demo.security.AuthenticationSecurity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/supplies")
public class SuppliesController {
    @Autowired
    SuppliesService suppliesService;

    @Autowired
    AuthenticationSecurity authenticationSecurity;

    @PostMapping(path = "/buy")
    public ResponseEntity buyNewSupplies(@RequestHeader("Authorization") String token, @RequestBody Supplies supplies){
        String adminToken = token.replace("Bearer ", "");
        if(!authenticationSecurity.validateAdminsToken(adminToken)){
            return ResponseEntity.badRequest().body("不被接受的token");
        }
        return suppliesService.buyNewSupplies(supplies);
    }
}
