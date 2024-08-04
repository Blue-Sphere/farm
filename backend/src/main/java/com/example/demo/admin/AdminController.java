package com.example.demo.admin;

import com.example.demo.security.AuthenticationSecurity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/admin")
public class AdminController {
    @Autowired
    AdminService adminService;

    @Autowired
    AuthenticationSecurity authenticationSecurity;

    @PostMapping(path = "/add")
    private String addAdmin(@RequestBody Admin admin){
        adminService.addAdmin(admin);
        return "Success";
    }

    @PostMapping(path = "/login")
    public String Authenticate(@RequestBody Admin admin){
        return adminService.AuthenticateLogin(admin.getEmail(), admin.getPassword());
    }

    @GetMapping(path = "/exists")
    public boolean checkAdminExist(@RequestParam String email){
        return adminService.existByEmail(email);
    }

    @PostMapping(path = "/validate_token")
    public ResponseEntity validateToken(@RequestHeader("Authorization") String authorization){
        String token = authorization.replace("Bearer ", "");
        if(authenticationSecurity.validateAdminsToken(token)) {
            return ResponseEntity.ok().body("");
        }
        return ResponseEntity.badRequest().body("不被接受的token");
    }

}
