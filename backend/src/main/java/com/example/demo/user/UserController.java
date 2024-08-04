package com.example.demo.user;

import com.example.demo.security.AuthenticationSecurity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/user")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;

    @Autowired
    AuthenticationSecurity authenticationSecurity;

    final static Logger logger = LoggerFactory.getLogger(UserController.class);

    @PostMapping(path = "/register")
    public ResponseEntity<String> register(@RequestBody User user){
        return userService.saveUnverifiedUserToRedis(user.getEmail(), user.getPassword());
    }

    @PostMapping(path = "/register/verify")
    public ResponseEntity register_verify(@RequestBody User user){
        ResponseEntity<String> verifyResult = userService.verifyUsersVerificationCode(user.getEmail(), user.getVerificationCode());
        if(verifyResult.getStatusCode() == HttpStatus.OK){
            verifyResult = userService.saveVerifiedUser(user.getEmail());
        }
        return verifyResult;
    }

    @PostMapping(path = "/login")
    public ResponseEntity<String> Authenticate(@RequestBody User user){
        return userService.AuthenticateLogin(user.getEmail(), user.getPassword());
    }

    @PostMapping(path = "/validate_token")
    public ResponseEntity validateToken(@RequestHeader("Authorization") String authorization){
        String token = authorization.replace("Bearer ", "");
        if(authenticationSecurity.validateUsersToken(token)) {
            return ResponseEntity.ok().body("");
        }
        return ResponseEntity.badRequest().body("不被接受的token");
    }

    @PostMapping(path = "/get")
    public ResponseEntity getUserInfo(@RequestHeader("Authorization") String authorization){
        String token = authorization.replace("Bearer ", "");
        if(!authenticationSecurity.validateUsersToken(token)){
            return ResponseEntity.badRequest().body("不被接受的token");
        }

        String email = authenticationSecurity.getUserEmailFromToken(token);
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    @PostMapping(path = "/change_email")
    public ResponseEntity changeEmail(@RequestHeader("Authorization") String authorization, @RequestBody UserChangeEmailDto changeEmailDto){
        String token = authorization.replace("Bearer ", "");
        if(!authenticationSecurity.validateUsersToken(token)){
            return ResponseEntity.badRequest().body("不被接受的token");
        }
        String email = authenticationSecurity.getUserEmailFromToken(token);
        return userService.saveTempVerificationCodeToChangeEmail(email, changeEmailDto.getNewEmail());
    }

    @PostMapping(path = "/change_email/verify")
    public ResponseEntity verifyChangeEmail(@RequestHeader("Authorization") String authorization, @RequestBody UserChangeEmailDto changeEmailDto){
        String token = authorization.replace("Bearer ", "");
        if(!authenticationSecurity.validateUsersToken(token)){
            return ResponseEntity.badRequest().body("不被接受的token");
        }

        String email = authenticationSecurity.getUserEmailFromToken(token);
        return userService.verifyTempVerificationCodeToChangeEmail(email, changeEmailDto.getNewEmail(), changeEmailDto.getVerificationCode());
    }

    @PostMapping(path = "/change_password")
    public ResponseEntity changePassword(@RequestHeader("Authorization") String authorization, @RequestBody UserChangePasswordDto changePasswordDto){
        String token = authorization.replace("Bearer ", "");
        if(!authenticationSecurity.validateUsersToken(token)){
            return ResponseEntity.badRequest().body("不被接受的token");
        }

        String email = authenticationSecurity.getUserEmailFromToken(token);
        return userService.changePassword(email, changePasswordDto.password, changePasswordDto.newPassword);
    }

    @PostMapping(path = "/line/connect")
    public ResponseEntity connectLine(@RequestHeader("Authorization") String authorization, @RequestBody Map<String, String> requestLineCode) throws Exception {
        String token = authorization.replace("Bearer ", "");
        if(!authenticationSecurity.validateUsersToken(token)){
            return ResponseEntity.badRequest().body("不被接受的token");
        }
        String email = authenticationSecurity.getUserEmailFromToken(token);
        User user = userService.getUserByEmail(email);

        try{
            String lineId = userService.connectLine(requestLineCode.get("code"));
            user.setLineId(lineId);
            userRepository.save(user);

            return ResponseEntity.ok().body("已成功連接Line帳號");
        }catch (Exception e){
            return ResponseEntity.badRequest().body("未成功連接Line帳號: "+e.getMessage());
        }

    }

    @GetMapping(path = "/all")
    public Iterable<User> getAllUser(){
        return userRepository.findAll();
    }

    @GetMapping(path = "/test")
    public String test(){
        return "Hello World";
    }
}
