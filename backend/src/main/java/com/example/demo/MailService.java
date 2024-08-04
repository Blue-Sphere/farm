package com.example.demo;

import com.jayway.jsonpath.JsonPath;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Properties;
import java.util.Random;

@Service
public class MailService {
    private String sender, password;

    @Autowired
    public void Mailer() throws Exception {
        InputStream jsonFile = new ClassPathResource("secrets/GmailAccount.json").getInputStream();
        String document = IOUtils.toString(jsonFile, StandardCharsets.UTF_8);
        this.sender = JsonPath.read(document, "$.account");
        this.password = JsonPath.read(document, "$.password");
    }

    public String generateVerificationCode(int length) {
        int min = (int) Math.pow(10, length - 1);
        int max = (int) Math.pow(10, length) - 1;
        Random random = new Random();
        return String.valueOf(random.nextInt(max - min + 1) + min);
    }

    public void sendEmail(String receiver, String sub, String content){

        String host = "smtp.gmail.com";
        Properties properties = System.getProperties();
        properties.setProperty("mail.smtp.host", host);
        properties.setProperty("mail.smtp.auth", "true");
        properties.setProperty("mail.smtp.port", "587");
        properties.setProperty("mail.smtp.starttls.enable", "true");

        Session session = Session.getDefaultInstance(properties);

        try{
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(sender));
            message.addRecipient(MimeMessage.RecipientType.TO, new InternetAddress(receiver));
            message.setSubject(sub);
            message.setText(content);

            Transport transport = session.getTransport("smtp");
            transport.connect(host, sender, password);

            transport.sendMessage(message, message.getAllRecipients());
            transport.close();
        }catch (MessagingException e){
            e.printStackTrace();
        }
    }
}
