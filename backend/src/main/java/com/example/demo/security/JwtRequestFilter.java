//package com.example.demo.security;
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContext;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import java.io.IOException;
//
//@Configuration
//public class JwtRequestFilter extends OncePerRequestFilter {
//    @Autowired
//    private AuthenticationSecurity authenticationSecurity;
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest servletRequest, HttpServletResponse servletResponse, FilterChain filterChain)
//        throws ServletException, IOException{
//
//        HttpServletRequest request = servletRequest;
//        HttpServletResponse response = servletResponse;
//
//        if(request.getRequestURI().startsWith("/user/") ||
//                request.getRequestURI().startsWith("/user/register") ||
//                request.getRequestURI().startsWith("/user/cart") ||
//                request.getRequestURI().startsWith("/admin/login") ||
//                request.getRequestURI().startsWith("/product/get") ||
//                request.getRequestURI().startsWith("/pages")||
//                request.getRequestURI().startsWith("/static")){
//            filterChain.doFilter(request, response);
//            return;
//        }
//
//        final String authorizationHeader = request.getHeader("Authorization");
//
//        String email = null;
//        String jwt;
//        if(authorizationHeader != null && authorizationHeader.startsWith("Bearer ")){
//            jwt = authorizationHeader.substring(7);
//
//            if(request.getRequestURI().startsWith("/user")){
//                email = authenticationSecurity.getUserEmailFromToken(jwt);
//            }else if(request.getRequestURI().startsWith("/order/user")) {
//                email = authenticationSecurity.getUserEmailFromToken(jwt);
//            }else if(request.getRequestURI().startsWith("/admin")){
//                email = authenticationSecurity.getAdminEmailFromToken(jwt);
//            }else if(request.getRequestURI().startsWith("/product/admin")){
//                email = authenticationSecurity.getAdminEmailFromToken(jwt);
//            }else if(request.getRequestURI().startsWith("/order/admin")){
//                email = authenticationSecurity.getAdminEmailFromToken(jwt);
//            }else if(request.getRequestURI().startsWith("/assets")){
//                email = authenticationSecurity.getAdminEmailFromToken(jwt);
//            }
//
//            Authentication authenticator = new UsernamePasswordAuthenticationToken(email, null);
//            SecurityContext securityContext = SecurityContextHolder.getContext();
//            securityContext.setAuthentication(authenticator);
//        }
//
//        if(email != null){
//            filterChain.doFilter(request, response);
//        }
//
//    }
//}
