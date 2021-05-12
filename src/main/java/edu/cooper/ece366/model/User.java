package edu.cooper.ece366.model;

public class User {
    private boolean hasProfile;
    private final String userID;
    private String email;
    private String password;

    public User(String uid, String email, String password, boolean hp) {
        this.userID = uid;
        this.email = email;
        this.password = password;
        this.hasProfile = hp;
    }

    public boolean hasProfile() { return this.hasProfile; }

    public String getUserID() { return this.userID; }

    public String getEmail() { return this.email; }

    public String getPassword() { return this.password; }
}

