package app.tagpet.service;

import java.util.Locale;
import java.util.UUID;

import org.springframework.stereotype.Service;

import app.tagpet.dto.PetDto;
import app.tagpet.model.Pet;
import app.tagpet.repository.PetRepository;
import app.tagpet.util.Util;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final EmailService emailService;
    private final Util util;

    @Transactional
    public void delete(UUID id, String secret) {
        var existingPet = petRepository.findById(id).orElseThrow(() -> new RuntimeException("Pet not found"));

        if (!util.secret(existingPet).equals(secret)) {
            throw new RuntimeException("Invalid secret");
        }

        petRepository.delete(existingPet);
    }

    @Transactional
    public PetDto save(Pet pet, Locale locale) {
        pet.getContacts().forEach(human -> human.setPet(pet));
        var savedPet = petRepository.save(pet);
        emailService.sendPetCreatedNotification(savedPet, locale);
        return PetDto.fromModel(savedPet);
    }

    public PetDto findById(UUID id) {
        var pet = petRepository.findById(id).orElseThrow(() -> new RuntimeException("Pet not found"));
        return PetDto.fromModel(pet);
    }

    @Transactional
    public PetDto update(UUID id, PetDto petDto, String secret, Locale locale) {

        var existingPet = petRepository.findById(id).orElseThrow(() -> new RuntimeException("Pet not found"));

        if (!util.secret(existingPet).equals(secret)) {
            throw new RuntimeException("Invalid secret");
        }

        existingPet.setName(petDto.name());
        existingPet.setType(petDto.type());
        existingPet.setIsCommunity(petDto.isCommunity());
        existingPet.setMoreInfo(petDto.moreInfo());
        existingPet.getContacts().clear();

        petDto.contacts().forEach(contactDto -> {
            var contact = contactDto.toModel();
            contact.setPet(existingPet);
            existingPet.getContacts().add(contact);
        });

        var updatedPet = petRepository.save(existingPet);
        emailService.sendPetCreatedNotification(updatedPet, locale);

        return PetDto.fromModel(updatedPet);
    }
}
