package app.tagpet.service;

import java.util.Locale;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import app.tagpet.model.Pet;
import app.tagpet.util.Util;
import lombok.RequiredArgsConstructor;

@Service("tagPetEmailService")
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender emailSender;
    private final MessageSource messageSource;
    private final Util util;

    @Value("${nograu.mail.from}")
    private String senderEmail;

    @Value("${nograu.base-url}")
    private String baseUrl;

    @Async
    public void sendPetCreatedNotification(Pet pet, Locale locale) {
        String petUrl = baseUrl + "/tagpet/pet/pet-form.html?id=" + pet.getId() + "&secret=" + util.secret(pet);
        String subject = messageSource.getMessage("tagpet.email.subject", new Object[]{pet.getName()}, locale);
        String body = messageSource.getMessage("tagpet.email.body", new Object[]{pet.getName(), petUrl}, locale);

        if (pet.getContacts() != null) {
            pet.getContacts().forEach(contact -> {
                if (contact.getEmail() != null && !contact.getEmail().isEmpty()) {
                    sendEmail(contact.getEmail(), subject, body);
                }
            });
        }
    }

    private void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            emailSender.send(message);
        } catch (Exception e) {
            System.err.println("Erro ao enviar email para " + to + ": " + e.getMessage());
        }
    }
}

