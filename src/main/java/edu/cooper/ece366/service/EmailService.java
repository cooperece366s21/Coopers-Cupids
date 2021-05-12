package edu.cooper.ece366.service;

import javax.activation.*;
import javax.mail.*;
import javax.mail.internet.*;
import java.util.Properties;

public class EmailService {
    String adminEmail, password;
    Properties properties = new Properties();
    final String SSL_FACTORY = "javax.net.ssl.SSLSocketFactory";
    Session session;

    public EmailService(String email, String password) {
        this.adminEmail = email;
        this.password = password;
        this.properties.put("mail.smtp.starttls.enable", true);
        this.properties.put("mail.smtp.host", "smtp.gmail.com");
        this.properties.put("mail.smtp.user", this.adminEmail);
        this.properties.put("mail.smtp.password", this.password);
        this.properties.put("mail.smtp.port", "587");
        this.properties.put("mail.smtp.auth", "true");
        this.session = Session.getDefaultInstance(this.properties, null);
    }

    public void sendMessageEmail(String email, String name, String messageName) {
        MimeMessage message = new MimeMessage(this.session);

        try {
            message.setFrom(new InternetAddress(this.adminEmail));
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(email));
            message.setSubject("Wow look at you go!");
            message.setText("Congrats " + name + ",\n\nYou just got a message from " + messageName + "! " +
                    "Now ain't that something to be excited about. Log onto Cooper Cupids and hit this cutie back!\n\nSincerely,\nCooper's Cupids");
            Transport transport = session.getTransport("smtp");
            transport.connect("smtp.gmail.com", this.adminEmail, this.password);
            transport.sendMessage(message, message.getAllRecipients());
            transport.close();
        } catch (MessagingException e) {
            e.printStackTrace();
            return;
        }
    }

    public void sendMatchEmail(String email, String name, String matchName) {
        MimeMessage message = new MimeMessage(this.session);

        try {
            message.setFrom(new InternetAddress(this.adminEmail));
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(email));
            message.setSubject("Woaw look at you good lookin'!");
            message.setText("Congrats " + name + ",\n\nYou just matched with " + matchName + "! " +
                    "We hope you're as excited as we are. Log onto Cooper Cupids and hit strike some convo cutie!\n\nSincerely,\nCooper's Cupids");
            Transport.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
            return;
        }
    }
}
