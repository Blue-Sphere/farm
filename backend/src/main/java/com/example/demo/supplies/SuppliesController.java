package com.example.demo.supplies;

import com.example.demo.admin.Admin;
import com.example.demo.admin.CriteriaSearchAdminDto;
import com.example.demo.security.AuthenticationSecurity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/supplies")
public class SuppliesController {
    @Autowired
    SuppliesService suppliesService;

    @Autowired
    AuthenticationSecurity authenticationSecurity;

    @PostMapping(path = "/get_all")
    public ResponseEntity getAllSupplies(@RequestHeader("Authorization") String token){
        String adminToken = token.replace("Bearer ", "");
        if(!authenticationSecurity.validateAdminsToken(adminToken)){
            return ResponseEntity.badRequest().body("不被接受的token");
        }
        return suppliesService.getAllSupplies();
    }

    @PostMapping(path = "/buy")
    public ResponseEntity buyNewSupplies(@RequestHeader("Authorization") String token, @RequestBody Supplies supplies){
        String adminToken = token.replace("Bearer ", "");
        if(!authenticationSecurity.validateAdminsToken(adminToken)){
            return ResponseEntity.badRequest().body("不被接受的token");
        }
        return suppliesService.buyNewSupplies(supplies);
    }

    @PostMapping(path = "/remove")
    public ResponseEntity removeSupplies(@RequestHeader("Authorization") String token, @RequestParam Long id){
        String adminToken = token.replace("Bearer ", "");
        if(!authenticationSecurity.validateAdminsToken(adminToken)){
            return ResponseEntity.badRequest().body("不被接受的token");
        }
        return suppliesService.removeSupplies(id);
    }

    @PostMapping(path = "/criteria_search")
    private ResponseEntity getSuppliesByCriteria(@RequestBody CriteriaSearchSuppliesDto criteriaSearchSuppliesDto){
        List<Supplies> result = suppliesService.getCriteriaSearchSupplies(criteriaSearchSuppliesDto);

        return ResponseEntity.ok().body(result);
    }
}
