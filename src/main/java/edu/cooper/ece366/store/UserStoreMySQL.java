package edu.cooper.ece366.store;

import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import java.util.Random;
import org.jdbi.v3.core.Jdbi;

import edu.cooper.ece366.model.User;
import edu.cooper.ece366.model.Profile;

public class UserStoreMySQL implements UserStore {
    private final Jdbi jdbi;

    // Constructor
    public UserStoreMySQL(final Jdbi jdbi) {
        this.jdbi = jdbi;
    }

    @Override
    public boolean validateUser(String userID, String password) {
        Optional<String> dbPass = this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT password FROM users WHERE userID = ?")
                        .bind(0, userID)
                        .mapTo(String.class)
                        .findOne());
        return dbPass.isPresent() && dbPass.get().equals(password);
    }

    // Checks if UserID is taken
    @Override
    public boolean isUser(String userID) {
        Optional<String> dbUserID = this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT userID FROM users WHERE userID = ?")
                        .bind(0, userID)
                        .mapTo(String.class)
                        .findOne());
        return dbUserID.isPresent();
    }

    // Returns user matching ID
    // Only call if existence of user is known
    @Override
    public User getUserFromId(String userID) {
        Optional<User> user = this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT * FROM users WHERE userID = ?")
                        .bind(0, userID)
                        .map((rs, ctx) ->
                                new User(rs.getString("userID"),
                                        rs.getString("password"),
                                        rs.getBoolean("hasProfile")))
                        .findOne());
        return user.orElse(null);
    }

    // Adds user
    // Existence checked in handler
    @Override
    public void addUser(User user) {
        this.jdbi.useHandle(handle ->
                handle.execute("INSERT INTO users (userID, password, hasProfile) VALUES (?, ?, ?)",
                        user.getUserID(), user.getPassword(), user.hasProfile()));
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
                handle.execute("DELETE FROM matches WHERE userID1 = ? OR userID2 = ?", userID, userID));
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
}
