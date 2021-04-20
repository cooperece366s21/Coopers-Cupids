package edu.cooper.ece366.auth;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.jdbi.v3.core.Jdbi;

public class Cookies {
    private final Jdbi jdbi;

    public Cookies(final Jdbi jdbi) { this.jdbi = jdbi; }

    public String assignCookie(String userID) {
        String cookie = UUID.randomUUID().toString().replace("-", "");
        List<String> presentCookies = this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT cookie FROM cookies")
                        .mapTo(String.class)
                        .list());
        while (presentCookies.contains(cookie)) {
            cookie = UUID.randomUUID().toString().replace("-", "");
        }
        // cookie lasts 3 hours
        Timestamp date = new Timestamp(System.currentTimeMillis() + (1000 * 60 * 60 * 3));
        String finalCookie = cookie;
        this.jdbi.useHandle(handle ->
                handle.execute("INSERT INTO cookies (cookie, userID, expire) VALUES (?, ?, ?)",
                        finalCookie, userID, date));
        return cookie;
    }

    public boolean verifyCookie(String cookie, String userID) {
        Optional<String> uid = this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT userID FROM cookies WHERE cookie = ?")
                        .bind(0, cookie)
                        .mapTo(String.class)
                        .findOne());
        if (uid.isPresent() && uid.get().equals(userID)) {
            Timestamp timestamp = this.jdbi.withHandle(handle ->
                    handle.createQuery("SELECT expire FROM cookies WHERE cookie = ?")
                            .bind(0, cookie)
                            .mapTo(Timestamp.class)
                            .one());
            return timestamp.after(new Timestamp(System.currentTimeMillis()));
        }
        return false;
    }

    public String getUser(String cookie) {
        Optional<String> uid = this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT userID FROM cookies WHERE cookie = ?")
                        .bind(0, cookie)
                        .mapTo(String.class)
                        .findOne());
        if (uid.isPresent()) {
            Timestamp timestamp = this.jdbi.withHandle(handle ->
                    handle.createQuery("SELECT expire FROM cookies WHERE cookie = ?")
                            .bind(0, cookie)
                            .mapTo(Timestamp.class)
                            .one());
            if (timestamp.after(new Timestamp(System.currentTimeMillis()))) {
                return uid.get();
            }
        }
        return null;
    }
}
