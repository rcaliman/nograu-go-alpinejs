package app.tagpet.dto;

import java.util.List;
import java.util.UUID;

import app.tagpet.model.Pet;

public record PetDto(UUID id, String name, String type, Boolean isCommunity, String moreInfo, List<ContactDto> contacts) {

    public PetDto(String name2, String type2, Boolean isCommunity2, String moreInfo2, List<ContactDto> list) {
        this(null, name2, type2, isCommunity2, moreInfo2, list);
    }

    public static PetDto fromModel(Pet pet) {
        return new PetDto(
            pet.getId(),
            pet.getName(),
            pet.getType(),
            pet.getIsCommunity(),
            pet.getMoreInfo(),
            pet.getContacts().stream().map(ContactDto::fromModel).toList()
        );
    }

    public static PetDto toView(PetDto pet) {
        return new PetDto(
            pet.name(),
            pet.type(),
            pet.isCommunity(),
            pet.moreInfo(),
            pet.contacts().stream().map(ContactDto::toView).toList()
        );
    }

    public static Pet toModel(PetDto petDto) {
        var pet = new Pet();
        pet.setId(petDto.id);
        pet.setName(petDto.name);
        pet.setType(petDto.type);
        pet.setIsCommunity(petDto.isCommunity);
        pet.setMoreInfo(petDto.moreInfo);
        pet.setContacts(
            petDto.contacts() == null
                ? List.of()
                : petDto.contacts().stream()
                    .map(contactDto -> contactDto.toModel())
                    .toList()
        );
        return pet;
    }

}
