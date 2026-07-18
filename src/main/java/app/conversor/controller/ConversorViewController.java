package app.conversor.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ConversorViewController {

    @GetMapping({ "/conversor", "/conversor/" })
    public String index() {
        return "forward:/conversor/index.html";
    }

}
