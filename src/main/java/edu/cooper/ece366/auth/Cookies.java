package edu.cooper.ece366.auth;

import java.util.UUID;
import org.jdbi.v3.core.Jdbi;

public class Cookies {
    private final Jdbi jdbi;

    public Cookies(final Jdbi jdbi) { this.jdbi = jdbi; }

    public String assignCookie() {
        String cookie = UUID.randomUUID().toString();
        cookie = cookie.replace("-", "");
        return cookie;
    }

    public boolean verifyCookie(String cookie) {
        return true;
    }

    public String getUser(String UserID) {
        return "yo";
    }
}
