package app.tagpet.util;

import org.springframework.stereotype.Component;

import app.tagpet.model.Pet;
import app.tagpet.repository.PetRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class Util {

    private final PetRepository petRepository;

    public String secret(Pet pet) {
        petRepository.findById(pet.getId());
        return pet.getCreatedAt().toString().replaceAll("[^a-zA-Z0-9]", "");
    }
}