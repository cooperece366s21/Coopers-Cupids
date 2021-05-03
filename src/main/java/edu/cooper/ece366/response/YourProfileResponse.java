package edu.cooper.ece366.response;

import edu.cooper.ece366.model.Profile;

public class YourProfileResponse {
    private final String name;
    private final int age;
    private final String photo;
    private final String bio;
    private final String location;
    private final String interests;

    public YourProfileResponse(Profile profile) {
        this.name = profile.getName();
        this.age = profile.getAge();
        this.photo = profile.getPhoto();
        this.bio = profile.getBio();
        this.location = profile.getLocation();
        this.interests = profile.getInterests();
    }

    public String getName() { return this.name; }

    public int getAge() { return this.age; }

    public String getPhoto() { return this.photo; }

    public String getBio() { return this.bio; }

    public String getLocation() { return this.location; }

    public String getInterests() { return this.interests; }
}
