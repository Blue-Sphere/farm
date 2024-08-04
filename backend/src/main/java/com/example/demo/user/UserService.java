package com.example.demo.user;

//import com.example.demo.exception.GlobalExceptionHandler;
import com.example.demo.security.AuthenticationSecurity;
import com.example.demo.MailService;
import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.JsonPath;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisKeyValueTemplate;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.util.Scanner;
import java.util.concurrent.TimeUnit;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationSecurity authenticationSecurity;

    @Resource
    private RedisTemplate<String, User> redisTemplate;

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Autowired
    private MailService mailService;

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    public ResponseEntity<String> saveUnverifiedUserToRedis(String email, String password){
        User user = new User();
        user.setEmail(email);
        user.setName("尚未驗證的使用者");
        user.setPassword(authenticationSecurity.generateSaltedPassword(password));

        // generateVerificationCode
        String verificationCode = mailService.generateVerificationCode(4);
        user.setVerificationCode(verificationCode);

        if(redisTemplate.opsForValue().get(email) == null
                && ! userRepository.findByEmail(email).isPresent()){
            redisTemplate.opsForValue().set(email, user, 5, TimeUnit.MINUTES);
            mailService.sendEmail(email, "洪福園-驗證碼通知", "您好，您的驗證碼為："+verificationCode);
            return ResponseEntity.ok()
                    .body("已成功寄送驗證碼至信箱，請於五分鐘內檢閱");
        }
        return ResponseEntity.internalServerError().body("該信箱已被使用，請更換其他電子信箱");

    }

    public ResponseEntity<String> verifyUsersVerificationCode(String email, String verificationCode){
        User newUser = redisTemplate.opsForValue().get(email);
        if(newUser != null){
            if((newUser.getVerificationCode()).equals(verificationCode))
                return ResponseEntity.ok().body("驗證成功");
            return ResponseEntity.badRequest().body("驗證碼錯誤");
        }
        return ResponseEntity.badRequest().body("已超過時間，或該名為待驗證使用者不存在，無法加入會員");
    }

    public ResponseEntity<String> saveVerifiedUser(String email){
        User user =  redisTemplate.opsForValue().get(email);
        if(user != null){
            userRepository.save(user);
            return ResponseEntity.ok("註冊成功");
        }
        return ResponseEntity.badRequest().body("已超過時間，或該名為待驗證使用者不存在，無法加入會員");
    }


    public ResponseEntity saveTempVerificationCodeToChangeEmail(String email, String newEmail){
        if(userRepository.findByEmail(email).isPresent()
                    && stringRedisTemplate.opsForValue().get(email) == null){

                // generateVerificationCode
                String verificationCode = mailService.generateVerificationCode(4);

                stringRedisTemplate.opsForValue().set(email, verificationCode, 5, TimeUnit.MINUTES);
                mailService.sendEmail(newEmail, "洪福園-驗證碼通知", "您好，您的驗證碼為："+verificationCode);
                return ResponseEntity.ok()
                        .body("已成功寄送驗證碼至信箱，請於五分鐘內檢閱");
            }
        return ResponseEntity.badRequest().body("該信箱已被使用，請更換其他電子信箱");
    }

    public ResponseEntity<String> verifyTempVerificationCodeToChangeEmail(String email, String newEmail, String verificationCode){
        String verificationCodeFromRedis = stringRedisTemplate.opsForValue().get(email);
        if(verificationCodeFromRedis == null){
            return ResponseEntity.badRequest().body("已超過時間，或該名為待驗證請求不存在，無法變更Email");
        }
        if(verificationCodeFromRedis.equals(verificationCode)){
            User user = getUserByEmail(email);
            user.setEmail(newEmail);
            userRepository.save(user);
            return ResponseEntity.ok().body("已成功變更Email，請重新登入");
        }
        return ResponseEntity.badRequest().body("驗證碼錯誤！");
    }

    public User getUserByEmail(String email){
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if(optionalUser.isPresent()){
            return optionalUser.get();
        }
        throw new IllegalStateException("User "+email+" is not exist");
    }

    public ResponseEntity<String> AuthenticateLogin(String email, String password){
        User userFromDataBase = getUserByEmail(email);
        if(authenticationSecurity.validatePassword(password, userFromDataBase.getPassword()) == true){
            String token = authenticationSecurity.generateUserToken(email);
            return ResponseEntity.ok().body(token);
        }
        return ResponseEntity.badRequest().body("錯誤的帳號或密碼");
    }

    public User checkPassword(String token, String password){
        String userLineId = authenticationSecurity.getUserEmailFromToken(token);
        Optional<User> userOptional = userRepository.findByLineId(userLineId);
        if(userOptional.isPresent()){
            User userFromDataBase = userOptional.get();
            if(authenticationSecurity.validatePassword(password, userFromDataBase.getPassword()) == true){
                return userFromDataBase;
            }
            throw new IllegalStateException("incorrect password");
        }else{
            throw new IllegalStateException("user not exist");
        }
    }

    public ResponseEntity changePassword(String email, String password, String newPassword){
        User user = getUserByEmail(email);
        if(authenticationSecurity.validatePassword(password, user.getPassword())){
            user.setPassword(authenticationSecurity.generateSaltedPassword(newPassword));
            userRepository.save(user);
            return ResponseEntity.ok().body("密碼已變更");
        }
        return ResponseEntity.badRequest().body("輸入的舊密碼不符合");
    }

    public String connectLine(String code)throws Exception{
        URL lineLoginUrl = new URL("https://api.line.me/oauth2/v2.1/token");
        HttpURLConnection connection = (HttpURLConnection) lineLoginUrl.openConnection();

        connection.setRequestMethod("POST");

        connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
        connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.78");

        // 設定可包含Body對外輸出
        connection.setDoOutput(true);

        String parameters = "grant_type=authorization_code&code=" + code
                + "&redirect_uri=https://b106-180-176-67-45.ngrok-free.app/user/setting&client_id=2005712969&client_secret=ceb13525d2e459057f2a931b8cd2e23b";

        byte[] postData = parameters.getBytes(StandardCharsets.UTF_8);

        OutputStream outputStream = connection.getOutputStream();

        outputStream.write(postData);
        outputStream.flush();
        outputStream.close();

        try{
            Scanner scanner = new Scanner(connection.getInputStream(), "UTF-8");
            String accessToken="";
            while(scanner.hasNextLine()){
                String line = scanner.nextLine();
                Object document = Configuration.defaultConfiguration().jsonProvider().parse(line);
                accessToken = JsonPath.read(document, "$['access_token']");
            }
            scanner.close();
            connection.disconnect();

            // Connect to the API, and get the userId
            URL lineGetUserIdUrl = new URL("https://api.line.me/oauth2/v2.1/userinfo");
            HttpURLConnection idConnection = (HttpURLConnection) lineGetUserIdUrl.openConnection();
            idConnection.setRequestMethod("GET");
            idConnection.setRequestProperty("authorization", "Bearer " + accessToken);

            String userLineId="";
            Scanner scanner2 = new Scanner(idConnection.getInputStream(), "UTF-8");
            while(scanner2.hasNextLine()){
                String line = scanner2.nextLine();
                Object document = Configuration.defaultConfiguration().jsonProvider().parse(line);
                userLineId = JsonPath.read(document, "$['sub']");
            }
            scanner2.close();
            idConnection.disconnect();

            return userLineId;

        }catch(Exception e){
            throw new Exception(e.getMessage());
        }
    }
}
