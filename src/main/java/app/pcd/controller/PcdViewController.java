package app.pcd.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class PcdViewController {

    @GetMapping({ "/pcd", "/pcd/" })
    public String index() {
        return "forward:/pcd/index.html";
    }

}
