package edu.cooper.ece366.store;

import org.jdbi.v3.core.Jdbi;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import edu.cooper.ece366.model.User;
import edu.cooper.ece366.model.Profile;

public class UserStoreMySQL implements UserStore {
    private final Jdbi jdbi;

    // Constructor
    public UserStoreMySQL(final Jdbi jdbi) { this.jdbi = jdbi; }

    @Override
    public boolean validateUser(String userID, String password) {
        Optional<String> dbPass = jdbi.withHandle(handle ->
                handle.createQuery("SELECT password FROM users WHERE userID = ?")
                        .bind(0, userID)
                        .mapTo(String.class)
                        .findOne());
        return dbPass.isPresent() && dbPass.get().equals(password);
    }

    // Checks if UserID is taken
    @Override
    public boolean isUser(String userID) {
        Optional<String> dbUserID = jdbi.withHandle(handle ->
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
        Optional<User> user = jdbi.withHandle(handle ->
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
    @Override
    public void addUser(User user) {
        if (!isUser(user.getUserID())) {
            jdbi.useHandle(handle ->
                    handle.execute("INSERT INTO users (userID, password, hasProfile) VALUES (?, ?, ?)",
                            user.getUserID(), user.getPassword(), user.hasProfile()));
        }
    }

    // Deletes User
    @Override
    public void deleteUser(String userID) {
        if (isUser(userID)) {
            User user = getUserFromId(userID);
            jdbi.useHandle(handle ->
                    handle.execute("DELETE FROM users WHERE userID = ?", userID));
            if (user.hasProfile()) {
                jdbi.useHandle(handle ->
                        handle.execute("DELETE FROM profiles WHERE userID = ?", userID));
                jdbi.useHandle(handle ->
                        handle.execute("DELETE FROM likes_dislikes WHERE from_userID = ? OR to_userID = ?", userID, userID));
                jdbi.useHandle(handle ->
                        handle.execute("DELETE FROM matches WHERE userID1 = ? OR userID2 = ?", userID, userID));
                jdbi.useHandle(handle ->
                        handle.execute("DELETE FROM messages WHERE from_userID = ? OR to_userID = ?", userID, userID));
            }
        }
    }

    // Returns list of users for feed
    // TODO
    @Override
    public List<Profile> feedUsers(int numUsers) {
        return new ArrayList<>();
    }

    @Override
    public void addProfile(Profile profile) {
        if (isUser(profile.getUserID())) {
            User user = getUserFromId(profile.getUserID());
            if (!user.hasProfile()) {
                jdbi.useHandle(handle ->
                        handle.execute("INSERT INTO profiles (userID, name, age, photo, bio, location, interests) VALUES (?, ?, ?, ?, ?, ?, ?)",
                                profile.getUserID(),
                                profile.getName(),
                                profile.getAge(),
                                profile.getPhoto(),
                                profile.getBio(),
                                profile.getLocation(),
                                profile.getInterests()));
                jdbi.useHandle(handle ->
                        handle.execute("UPDATE users SET hasProfile = true WHERE userID = ?",
                                profile.getUserID()));
            }
        }
    }

    @Override
    public Profile getProfileFromId(String userID) {
        if(isUser(userID)) {
            User user = getUserFromId(userID);
            if (user.hasProfile()) {
                return jdbi.withHandle(handle ->
                        handle.createQuery("SELECT * FROM profiles WHERE userID = ?")
                                .bind(0, user.getUserID())
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
            return null;
        }
        return null;
    }
}
