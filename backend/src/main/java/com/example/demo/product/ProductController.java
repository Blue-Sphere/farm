package com.example.demo.product;

import com.example.demo.admin.Admin;
import com.example.demo.admin.CriteriaSearchAdminDto;
import com.example.demo.security.AuthenticationSecurity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/product")
public class ProductController {

    @Autowired
    AuthenticationSecurity authenticationSecurity;

    @Autowired
    ProductService productService;

    private Logger logger = LoggerFactory.getLogger(ProductController.class);

    @PostMapping(path = "/inventory")
    public ResponseEntity getALLProduct(@RequestHeader("Authorization") String authorization){
        String token = authorization.replace("Bearer ", "");
        if(!authenticationSecurity.validateAdminsToken(token)){
            return ResponseEntity.badRequest().body("不被接受的token");
        }
        return ResponseEntity.ok().body(productService.getAllInventory());
    }

    @GetMapping(path = "/{id}")
    public Product getProduct(@PathVariable(value = "id") Integer Id){
        return productService.getProductById(Id);
    }

    @PostMapping(path = "/admin/add")
    public ResponseEntity addProduct(@ModelAttribute Product product,
                                     @RequestPart("originImage") MultipartFile image, @RequestHeader("Authorization") String authorization, BindingResult result) throws IOException {

        product.setImage(image.getBytes());

        String token = authorization.replace("Bearer ", "");
        if(!authenticationSecurity.validateAdminsToken(token)){
            return ResponseEntity.badRequest().body("不被接受的token");
        }
        String adminEmail = authenticationSecurity.getAdminEmailFromToken(token);

        productService.addProduct(product, adminEmail);
        return ResponseEntity.ok().body(product.getName() + " 商品 已被成功添加");
    }

    @PostMapping(path = "/admin/update")
    public String updateProduct(@RequestBody Product product){
        productService.updateProduct(product);
        return "Success";
    }

    @PostMapping(path = "/admin/delete")
    public String deleteProduct(@RequestBody Product product){
        productService.deleteProduct(product);
        return "Success";
    }

    @PostMapping(path = "/criteria_search")
    private ResponseEntity getProductByCriteria(@RequestBody CriteriaSearchProductDto criteriaSearchProductDto){
        List<Product> result = productService.getCriteriaSearchProduct(criteriaSearchProductDto);

        return ResponseEntity.ok().body(result);
    }
}
