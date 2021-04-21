package edu.cooper.ece366.response;

import edu.cooper.ece366.model.Profile;

public class ProfileResponse {
    private final String userID;
    private final String name;
    private final String photo;

    public ProfileResponse(Profile profile) {
        this.userID = profile.getUserID();
        this.name = profile.getName();
        this.photo = profile.getPhoto();
    }

    public String getUserID() { return this.userID; }

    public String getName() { return this.name; }

    public String getPhoto() { return this.photo; }
}
