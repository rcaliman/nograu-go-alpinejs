package app.tagpet.controller;

import java.util.Locale;
import java.util.UUID;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import app.tagpet.dto.PetDto;
import app.tagpet.service.PetService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/pets")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    @DeleteMapping("{id}")
    public void deletePet(@PathVariable UUID id, @RequestParam String secret) {
        petService.delete(id, secret);
    }

    @PostMapping
    public PetDto savePet(@RequestBody PetDto petDto, Locale locale) {
        var pet = PetDto.toModel(petDto);
        return petService.save(pet, locale);
    }

    @GetMapping("{id}")
    public PetDto getPet(@PathVariable UUID id) {
        return petService.findById(id);
    }

    @GetMapping("/pet/{id}")
    public PetDto viewPet(@PathVariable UUID id) {
        var pet = petService.findById(id);
        return PetDto.toView(pet);
    }

    @PutMapping("{id}")
    public PetDto updatePet(@PathVariable UUID id, @RequestBody PetDto petDto,
            @RequestParam String secret, Locale locale) {
        return petService.update(id, petDto, secret, locale);
    }
}
