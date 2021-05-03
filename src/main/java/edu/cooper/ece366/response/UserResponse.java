package edu.cooper.ece366.response;

import edu.cooper.ece366.model.User;

public class UserResponse {
    private final String email;
    private final boolean hasProfile;

    public UserResponse(User user) {
        this.email = user.getEmail();
        this.hasProfile = user.hasProfile();
    }

    public String getEmail() { return this.email; }

    public boolean hasProfile() { return this.hasProfile; }
}
