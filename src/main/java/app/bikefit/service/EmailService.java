package app.bikefit.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender emailSender;

    @Value("${nograu.mail.from}")
    private String senderEmail;

    @Value("${nograu.base-url}")
    private String baseUrl;

    @Async
    public void enviarEmail(String to, String subject, String text) {
        log.info("Enviando email para {} | assunto: {}", to, subject);
        try {
            var mime = emailSender.createMimeMessage();
            var helper = new MimeMessageHelper(mime, false, "UTF-8");
            helper.setFrom(senderEmail, "Mural do site No Grau");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text);
            emailSender.send(mime);
            log.info("Email enviado com sucesso para {}", to);
        } catch (Exception e) {
            log.error("Falha ao enviar email para {} | assunto: {} | erro: {}", to, subject, e.getMessage(), e);
        }
    }
}
