package app.tagpet.dto;

import java.util.List;
import java.util.UUID;

import app.tagpet.model.Contact;

public record ContactDto(UUID id, String name, String contactNumber, String email, List<String> chatApp, String location) {

    ContactDto(String name, String contactNumber, String email, List<String> chatApp, String location) {
        this(null, name, contactNumber, email, chatApp, location);
    }

    public static ContactDto fromModel(Contact contact) {
        return new ContactDto(
            contact.getId(),
            contact.getName(),
            contact.getContactNumber(),
            contact.getEmail(),
            contact.getChatApp(),
            contact.getLocation()
        );
    }

    public static ContactDto toView(ContactDto contact) {
        return new ContactDto(
            contact.name(),
            contact.contactNumber(),
            contact.email(),
            contact.chatApp(),
            contact.location()
        );
    }

    public Contact toModel() {
        var contact = new Contact();
        contact.setId(id);
        contact.setName(name);
        contact.setContactNumber(contactNumber);
        contact.setEmail(email);
        contact.setChatApp(chatApp);
        contact.setLocation(location);
        return contact;
    }

}
