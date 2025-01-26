package com.ali.book.email;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Async
    public void sendEmail(
            String to,
            String username,
            EmailTemplateName emailTemplate,
            String confirmationUrl,
            String activationCode,  // Can be null for reset password emails
            String subject
    ) throws MessagingException {
        // Determine the template name based on the email template enum
        String templateName;
        if (emailTemplate == null) {
            templateName = "confirm-email"; // Default template for account activation
        } else {
            templateName = emailTemplate.getName();
        }

        // Create the MIME message
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage,
                MimeMessageHelper.MULTIPART_MODE_MIXED,
                StandardCharsets.UTF_8.name());

        // Prepare the properties for the Thymeleaf template
        Map<String, Object> properties = new HashMap<>();
        properties.put("username", username);
        properties.put("confirmationUrl", confirmationUrl);
        
        // Only include activation code if it's provided (for account activation emails)
        if (activationCode != null) {
            properties.put("activation_code", activationCode);
        }

        // Set the Thymeleaf context with the properties
        Context context = new Context();
        context.setVariables(properties);

        // Configure the email details
        helper.setFrom("syedaliahsan2002@gmail.com");
        helper.setTo(to);
        helper.setSubject(subject);

        // Process the template with the context and set it as the email body
        String template = templateEngine.process(templateName, context);
        helper.setText(template, true);

        // Send the email
        mailSender.send(mimeMessage);
    }
}
