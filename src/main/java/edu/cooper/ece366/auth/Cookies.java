package edu.cooper.ece366.auth;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.jdbi.v3.core.Jdbi;

public class Cookies {
    private final Jdbi jdbi;

    public Cookies(final Jdbi jdbi) { this.jdbi = jdbi; }

    // Assigns a random UID to a newly logged in user
    public String assignCookie(String userID) {
        // purge cookies whenever a new one is created
        this.purgeCookies();
        String cookie = UUID.randomUUID().toString().replace("-", "");
        List<String> presentCookies = this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT cookie FROM cookies")
                        .mapTo(String.class)
                        .list());
        while (presentCookies.contains(cookie)) {
            cookie = UUID.randomUUID().toString().replace("-", "");
            // Requery just in case of update
            presentCookies = this.jdbi.withHandle(handle ->
                    handle.createQuery("SELECT cookie FROM cookies")
                            .mapTo(String.class)
                            .list());
        }
        // cookie lasts 3 hours
        Timestamp date = new Timestamp(System.currentTimeMillis() + (1000 * 60 * 60 * 3));
        String finalCookie = cookie;
        this.jdbi.useHandle(handle ->
                handle.execute("INSERT INTO cookies (cookie, userID, expire) VALUES (?, ?, ?)",
                        finalCookie, userID, date));
        return finalCookie;
    }

    // Returns whether or not a cookie matches with a userID
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
            if (timestamp.after(new Timestamp(System.currentTimeMillis()))) {
                return true;
            }
            else {
                deleteCookie(cookie, userID);
                return false;
            }
        }
        return false;
    }

    // No need for existence checking, if doesnt exist nothing deleted
    public void deleteCookie(String cookie, String userID) {
        this.jdbi.useHandle(handle ->
                handle.execute("DELETE FROM cookies WHERE cookie = ? AND userID = ?", cookie, userID));
    }

    // Removes all expired cookies from database
    public void purgeCookies() {
        this.jdbi.useHandle(handle ->
                handle.execute("SET SQL_SAFE_UPDATES = 0"));
        this.jdbi.useHandle(handle ->
                handle.execute("DELETE FROM cookies WHERE expire < NOW()"));
        this.jdbi.useHandle(handle ->
                handle.execute("SET SQL_SAFE_UPDATES = 1"));
    }
}
