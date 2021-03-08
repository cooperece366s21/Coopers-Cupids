package edu.cooper.ece366.model;

public class Profile {
    // Variables
    // ----------
    private String name;
    private int age;
    private String photo; // Link to photo
    private String bio;
    private String location; // Can be updated to different data-type later
    private String interests;

    // Setters
    // --------
    public void setName(String name) {
        this.name = name;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setInterests(String interests) {
        this.interests = interests;
    }

    // Getters
    // --------
    public String getName() {
        return this.name;
    }

    public int getAge() {
        return this.age;
    }

    public String getPhoto() {
        return this.photo;
    }

    public String getBio() {
        return this.bio;
    }

    public String getLocation() {
        return this.location;
    }

    public String getInterests() {
        return this.interests;
    }

}