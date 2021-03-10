package edu.cooper.ece366.model;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class User {
    // Variables
    // ----------
    private boolean hasProfile;
    private final String userID;
    private String password;
    private Profile profile;

    // Methods
    // --------

    // Constructor
    public User(String uid, String password) {
        this.hasProfile = false;
        this.userID = uid;
        this.password = password;
        this.profile = new Profile();
    }

    public void createdProfile() { this.hasProfile = true; }

    public void deletedProfile() { this.hasProfile = false; }

    public boolean hasProfile() { return this.hasProfile; }

    // Returns user's profile
    public Profile getProfile() { return this.profile; }

    public String getUserID() { return this.userID; }

    public boolean checkPass(String password) {
        if(password.equals(this.password)) {
            return true;
        }
        else {
            return false;
        }
    }
}

