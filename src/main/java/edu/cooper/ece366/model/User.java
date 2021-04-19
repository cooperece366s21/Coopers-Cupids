package edu.cooper.ece366.model;

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
        //this.profile = new Profile();
    }

    public User(String uid, String password, boolean hp) {
        this.hasProfile = hp;
        this.userID = uid;
        this.password = password;
        //this.profile = new Profile();
    }

    public void createdProfile() { this.hasProfile = true; }

    public void deletedProfile() { this.hasProfile = false; }

    public boolean hasProfile() { return this.hasProfile; }

    // Returns user's profile
    public Profile getProfile() { return this.profile; }

    public String getUserID() { return this.userID; }

    public String getPassword() { return this.password; }

    public boolean checkPass(String password) {
        return password.equals(this.password);
    }
}

