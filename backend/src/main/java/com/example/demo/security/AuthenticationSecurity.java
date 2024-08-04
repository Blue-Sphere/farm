package com.example.demo.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

@Service
public class AuthenticationSecurity {

    private static final Key userSecretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private static final Key adminSecretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    private final long expirationMs = 3600000; //1 hour

    private final Logger logger = LoggerFactory.getLogger(AuthenticationSecurity.class);

    /* about JWT */
    public String generateUserToken(String userEmail){
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setSubject(userEmail)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(userSecretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateAdminToken(String adminEmail){
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setSubject(adminEmail)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(adminSecretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUserEmailFromToken(String token){
        Claims claims = Jwts.parser()
                .setSigningKey(userSecretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public String getAdminEmailFromToken(String token){
        Claims claims = Jwts.parser()
                .setSigningKey(adminSecretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public boolean validateUsersToken(String token){
        try {
            Jwts.parser().verifyWith((SecretKey) userSecretKey).build().parseSignedClaims(token);
            return true;
        }catch (Exception e){
            return false;
        }
    }

    public boolean validateAdminsToken(String token){
        try {
            Jwts.parser().verifyWith((SecretKey) adminSecretKey).build().parseSignedClaims(token);
            return true;
        }catch (Exception e){
            return false;
        }
    }



    /* about Password */
    public String generateSaltedPassword(String password){
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.encode(password);
    }

    public boolean validatePassword(String rawPassword, String hashedPassword){
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return  passwordEncoder.matches(rawPassword, hashedPassword);
    }

}
