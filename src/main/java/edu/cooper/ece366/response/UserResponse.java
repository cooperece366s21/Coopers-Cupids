package edu.cooper.ece366.response;

import edu.cooper.ece366.model.User;

public class UserResponse {
    private final String userID;
    private final boolean hasProfile;

    public UserResponse(User user) {
        this.userID = user.getUserID();
        this.hasProfile = user.hasProfile();
    }

    public String getUserID() { return this.userID; }

    public boolean hasProfile() { return this.hasProfile; }
}
