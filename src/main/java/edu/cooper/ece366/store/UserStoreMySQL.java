package edu.cooper.ece366.store;

import edu.cooper.ece366.model.Profile;
import org.jdbi.v3.core.Jdbi;
import java.util.List;
import java.util.Optional;

import edu.cooper.ece366.model.User;

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
        if (dbPass.isPresent() && dbPass.equals(password)) {
            return true;
        }
        else {
            return false;
        }
    }

    // Checks if UserID is taken
    @Override
    public boolean isUser(String userID) {
        Optional<String> dbUserID = jdbi.withHandle(handle ->
                handle.createQuery("SELECT userID FROM users WHERE userID = ?")
                        .bind(0, userID)
                        .mapTo(String.class)
                        .findOne());
        if (dbUserID.isPresent()) {
            return true;
        }
        else {
            return false;
        }
    }

    // Returns user matching ID
    // Only call if existence of user is known
    @Override
    public User getUserFromId(String userID) {
        Optional<User> user = jdbi.withHandle(handle ->
                handle.createQuery("SELECT * FROM users WHERE userID = ?")
                        .bind(0, userID)
                        .map((rs, ctx) ->
                                new User(rs.getString("userID"), rs.getString("password"), rs.getBoolean("hasProfile")))
                        .findOne());
        if (user.isPresent()) {
            return user.get();
        }
        else {
            return null;
        }
    }

    // Returns list of users with given name
    // currently not in use so not actually completed
    @Override
    public List<User> getUsersFromName(String name) {
        return null;
    }

    // Adds user
    @Override
    public void addUser(User user) {
        jdbi.useHandle(handle ->
                handle.execute("INSERT INTO users (userID, password, hasProfile) VALUES (?, ?, ?)",
                        user.getUserID(), user.getPassword(), user.hasProfile()));
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
            }
        }
    }

    // Returns list of users for feed
    // TODO
    @Override
    public List<User> feedUsers(int numUsers) {
        return null;
    }

    @Override
    public void addProfile(String userID, Profile profile) {
        if (isUser(userID)) {
            User user = getUserFromId(userID);
            if (!user.hasProfile()) {
                jdbi.useHandle(handle ->
                        handle.execute("INSERT INTO profiles (userID, name, age, photo, bio, location, interests) VALUES (?, ?, ?, ?, ?, ?, ?)",
                                userID,
                                profile.getName(),
                                profile.getAge(),
                                profile.getPhoto(),
                                profile.getBio(),
                                profile.getLocation(),
                                profile.getInterests()));
            }
        }
    }

    @Override
    public Profile getProfileFromId(String userID) {
        if(isUser(userID)) {
            User user = getUserFromId(userID);
            if (user.hasProfile()) {
                Profile profile = jdbi.withHandle(handle ->
                        handle.createQuery("SELECT * FROM profiles WHERE userID = ?")
                                .bind(0, user.getUserID())
                                .map((rs, ctx) ->
                                        new Profile(rs.getString("userID"),
                                                rs.getInt("age"),
                                                rs.getString("photo"),
                                                rs.getString("bio"),
                                                rs.getString("location"),
                                                rs.getString("interests")))
                                .one());
                return profile;
            }
            return null;
        }
        return null;
    }
}
