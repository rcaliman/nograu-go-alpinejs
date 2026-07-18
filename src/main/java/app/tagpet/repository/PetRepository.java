package app.tagpet.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import app.tagpet.model.Pet;

public interface PetRepository extends JpaRepository<Pet, UUID> {
    
}

