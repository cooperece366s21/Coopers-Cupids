package edu.cooper.ece366.store;

import java.util.*;

import org.jdbi.v3.core.Jdbi;

import edu.cooper.ece366.model.User;
import edu.cooper.ece366.model.Profile;

public class UserStoreMySQL implements UserStore {
    private final Jdbi jdbi;

    // Constructor
    public UserStoreMySQL(final Jdbi jdbi) { this.jdbi = jdbi; }

    @Override
    public String assignUserId() {
        String userID = UUID.randomUUID().toString().replace("-", "");
        List<String> presentIds = this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT userID FROM users")
                        .mapTo(String.class)
                        .list());
        while (presentIds.contains(userID)) {
            userID = UUID.randomUUID().toString().replace("-", "");
            // Requery just in case of update
            presentIds = this.jdbi.withHandle(handle ->
                    handle.createQuery("SELECT userID FROM users")
                            .mapTo(String.class)
                            .list());
        }
        return userID;
    }

    // Checks if email is already associated with an account
    // Returns true if email is already in use
    @Override
    public boolean checkEmail(String email) {
        List<String> presentEmails = this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT email FROM users")
                        .mapTo(String.class)
                        .list());
        return presentEmails.contains(email);
    }

    // Checks database if provided email and password are correct
    // Returns true is correct
    @Override
    public boolean validateUser(String email, String password) {
        Optional<String> dbPass = this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT password FROM users WHERE email = ?")
                        .bind(0, email)
                        .mapTo(String.class)
                        .findOne());
        return dbPass.isPresent() && dbPass.get().equals(password);
    }

    // Returns whether or not a userID is associated with an account
    @Override
    public boolean isUser(String userID) {
        List<String> presentIDs = this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT userID FROM users")
                        .mapTo(String.class)
                        .list());
        return presentIDs.contains(userID);
    }

    // Returns user matching ID
    // Only call if existence of user is known
    @Override
    public User getUserFromId(String userID) {
        return this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT * FROM users WHERE userID = ?")
                        .bind(0, userID)
                        .map((rs, ctx) ->
                                new User(rs.getString("userID"),
                                        rs.getString("email"),
                                        rs.getString("password"),
                                        rs.getBoolean("hasProfile")))
                        .one());
    }

    // Adds user
    // Existence checked in handler
    @Override
    public void addUser(User user) {
        this.jdbi.useHandle(handle ->
                handle.execute("INSERT INTO users (userID, email, password, hasProfile) VALUES (?, ?, ?, ?)",
                        user.getUserID(), user.getEmail(), user.getPassword(), user.hasProfile()));
    }

    // Deletes User
    // No need for existence checking, if doesnt exist nothing deleted
    @Override
    public void deleteUser(String userID) {
        this.jdbi.useHandle(handle ->
                handle.execute("DELETE FROM cookies WHERE userID = ?", userID));
        this.jdbi.useHandle(handle ->
                handle.execute("DELETE FROM profiles WHERE userID = ?", userID));
        this.jdbi.useHandle(handle ->
                handle.execute("DELETE FROM likes_dislikes WHERE from_userID = ? OR to_userID = ?", userID, userID));
        this.jdbi.useHandle(handle ->
                handle.execute("DELETE FROM messages WHERE from_userID = ? OR to_userID = ?", userID, userID));
        this.jdbi.useHandle(handle ->
                handle.execute("DELETE FROM users WHERE userID = ?", userID));
    }

    // Returns list of users for feed
    @Override
    public List<Profile> feedUsers(int numUsers) {
        List<Profile> userFeed = new ArrayList<>();

        List<String> allProfiles = this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT userID FROM profiles")
                        .mapTo(String.class)
                        .list());

        if (numUsers >= allProfiles.size()) {
            userFeed = this.jdbi.withHandle(handle ->
                    handle.createQuery("SELECT * FROM profiles")
                            .map((rs, ctx) ->
                                    new Profile(rs.getString("userID"),
                                            rs.getString("name"),
                                            rs.getInt("age"),
                                            rs.getString("photo"),
                                            rs.getString("bio"),
                                            rs.getString("location"),
                                            rs.getString("interests")))
                            .list());
        }
        else {
            Random random = new Random();
            for (int i = 0, randNum = random.nextInt(allProfiles.size()); i < numUsers; i++) {
                Profile profile = getProfileFromId(allProfiles.get(randNum));
                while (userFeed.contains(profile)) {
                    randNum = random.nextInt(allProfiles.size());
                    profile = getProfileFromId(allProfiles.get(randNum));
                }
                userFeed.add(profile);
            }
        }

        return userFeed;
    }

    // Adds profile
    // User/Profile existence checked in handler
    @Override
    public void addProfile(Profile profile) {
        this.jdbi.useHandle(handle ->
                handle.execute("INSERT INTO profiles (userID, name, age, photo, bio, location, interests) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        profile.getUserID(),
                        profile.getName(),
                        profile.getAge(),
                        profile.getPhoto(),
                        profile.getBio(),
                        profile.getLocation(),
                        profile.getInterests()));
        this.jdbi.useHandle(handle ->
                handle.execute("UPDATE users SET hasProfile = true WHERE userID = ?",
                        profile.getUserID()));
    }

    // Returns the email based on userID
    @Override
    public String getEmailFromId(String userID) {
        return this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT email FROM users WHERE userID = ?")
                        .bind(0, userID)
                        .mapTo(String.class)
                        .one());
    }

    // Returns the userID based on email
    @Override
    public String getIdFromEmail(String email) {
        return this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT userID FROM users WHERE email = ?")
                        .bind(0, email)
                        .mapTo(String.class)
                        .one());
    }

    // Gets profile
    // User/Profile existence checked in handler
    @Override
    public Profile getProfileFromId(String userID) {
        return this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT * FROM profiles WHERE userID = ?")
                        .bind(0, userID)
                        .map((rs, ctx) ->
                                new Profile(rs.getString("userID"),
                                        rs.getString("name"),
                                        rs.getInt("age"),
                                        rs.getString("photo"),
                                        rs.getString("bio"),
                                        rs.getString("location"),
                                        rs.getString("interests")))
                        .one());
    }

    // Updates a users email
    @Override
    public void updateEmail(String userID, String email) {
        this.jdbi.useHandle(handle ->
                handle.execute("UPDATE users SET email = ? WHERE userID = ?", email, userID));
    }

    // Updates a users password
    @Override
    public void updatePassword(String userID, String password) {
        this.jdbi.useHandle(handle ->
                handle.execute("UPDATE users SET password = ? WHERE userID = ?", password, userID));
    }

    // Updates a profile
    @Override
    public void updateProfile(Profile profile) {
        this.jdbi.useHandle(handle ->
                handle.execute("UPDATE profiles SET name = ?, age = ?, photo = ?, bio = ?, location = ?, interests = ? WHERE userID = ?",
                        profile.getName(),
                        profile.getAge(),
                        profile.getPhoto(),
                        profile.getBio(),
                        profile.getLocation(),
                        profile.getInterests(),
                        profile.getUserID()));
    }
}
