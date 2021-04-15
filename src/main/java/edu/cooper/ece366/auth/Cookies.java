package edu.cooper.ece366.auth;

import org.jdbi.v3.core.Jdbi;

public class Cookies {
    private final Jdbi jdbi;

    public Cookies(final Jdbi jdbi) {
        this.jdbi = jdbi;
    }

    public String assignCookie(String UserID) {
        return "yo";
    }

    public boolean verifyCookie(String cookie) {
        return true;
    }

    public String getUser(String UserID) {
        return "yo";
    }
}
