package app.tagpet.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PetViewController {

    @GetMapping({ "/tagpet", "/tagpet/" })
    public String index() {
        return "redirect:/tagpet/pet/pet-form.html";
    }

}
