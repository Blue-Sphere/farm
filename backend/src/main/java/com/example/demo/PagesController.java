package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(path = "/pages")
public class PagesController {

    @GetMapping(path = "/home/index")
    public String index() {
        return "home/index";
    }

    @GetMapping(path = "/admin/index")
    public String adminIndex() {
        return "admin/index.html";
    }

}
