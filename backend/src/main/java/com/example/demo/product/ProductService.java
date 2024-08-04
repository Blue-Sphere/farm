package com.example.demo.product;

import com.example.demo.admin.Admin;
import com.example.demo.admin.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ModelAttribute;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Iterator;
import java.util.Optional;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    ProductRepository productRepository;

    @Autowired
    AdminService adminService;

    public byte[] compressImage(byte[] originalImage) throws IOException {
        BufferedImage bufferedImage = ImageIO.read(new ByteArrayInputStream(originalImage));

        int width = bufferedImage.getWidth();
        int height = bufferedImage.getWidth();

        BufferedImage compressedImage = new BufferedImage(width, height, BufferedImage.TYPE_3BYTE_BGR);

        Graphics2D graphics = compressedImage.createGraphics();
        graphics.drawImage(bufferedImage, 0, 0, width, height, null);
        graphics.dispose();

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpeg");
        ImageWriter writer = writers.next();
        ImageWriteParam writeParam = writer.getDefaultWriteParam();
        writeParam.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
        writeParam.setCompressionQuality(0.5f);

        ImageOutputStream imageOutputStream = ImageIO.createImageOutputStream(byteArrayOutputStream);
        writer.setOutput(imageOutputStream);
        writer.write(null, new IIOImage(compressedImage, null, null), writeParam);
        writer.dispose();

        return byteArrayOutputStream.toByteArray();
    }

    public List<Product> getAllInventory(){
        return productRepository.findAllInventory();
    }

    public Product getProductById(Integer Id){
        Optional<Product> optionalProduct = productRepository.findById(Id);
        if(optionalProduct.isPresent()){
            return optionalProduct.get();
        }
        return null;
    }

    public Product getProductById(Long id){
        Optional<Product> optionalProduct = productRepository.findById(Math.toIntExact(id));
        if(optionalProduct.isPresent()){
            Product product = optionalProduct.get();
            return product;
        }
        throw new IllegalStateException("The Product is not exist");
    }

    public Product getProductByName(String name){
        Optional<Product> optionalProduct = productRepository.findByName(name);
        if(optionalProduct.isPresent()){
            Product product = optionalProduct.get();
            return product;
        }
        throw new IllegalStateException("The Product is not exist");
    }

    public void addProduct(@ModelAttribute Product product, String adminEmail) throws IOException {
        byte[] compressImage = compressImage(product.getImage());
        product.setImage(compressImage);
        product.setAddedByAdmin(adminService.getAdminByEmail(adminEmail));

        productRepository.save(product);
    }

    public void updateProduct(Product product){
        Optional<Product> productOptional = productRepository.findByName(product.getName());
        if(productOptional.isPresent()){
            Product productFromDataBase = productOptional.get();
            if(!product.equals(productFromDataBase)){
                productFromDataBase = product;
                productRepository.save(productFromDataBase);
            }
        }
    }

    public void deleteProduct(Product product){
        Optional<Product> productOptional = productRepository.findByName(product.getName());
        if(productOptional.isPresent()){
            productRepository.deleteById(productOptional.get().getId());
        }
    }
}
