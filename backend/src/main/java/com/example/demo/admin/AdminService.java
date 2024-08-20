package com.example.demo.admin;

import com.example.demo.security.AuthenticationSecurity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    AdminRepository adminRepository;

    @Autowired
    AuthenticationSecurity authenticationSecurity;

    public Admin getAdminByEmail(String email){
        Optional<Admin> optionalAdmin = adminRepository.findByEmail(email);
        if (optionalAdmin.isPresent()){
            Admin admin = optionalAdmin.get();
            return admin;
        }
        throw new IllegalStateException("Admin "+email+" is not exist");
    }

    public void addAdmin(Admin admin){
        String hashedPassword =  authenticationSecurity.generateSaltedPassword(admin.getPassword());
        admin.setPassword(hashedPassword);
        adminRepository.save(admin);
    }

    public String AuthenticateLogin(String email, String password){
        Admin adminFromDataBase = getAdminByEmail(email);
        if(authenticationSecurity.validatePassword(password, adminFromDataBase.getPassword()) == true){
            return authenticationSecurity.generateAdminToken(email);
        }
        throw new IllegalStateException("incorrect password");
    }

    public boolean existByEmail(String email){
        return adminRepository.existsByEmail(email);
    }

    public List<Admin> getCriteriaSearchAdmin(CriteriaSearchAdminDto criteriaSearchAdminDto) {
        return adminRepository.findAdminByCriteria(criteriaSearchAdminDto);
    }
}
