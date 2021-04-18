package edu.cooper.ece366.store;

import org.jdbi.v3.core.Jdbi;
import java.util.List;

import edu.cooper.ece366.model.User;

public class UserStoreMySQL implements UserStore {

    private final Jdbi jdbi;

    // Constructor
    public UserStoreMySQL(final Jdbi jdbi) { this.jdbi = jdbi; }

    @Override
    public boolean validateUser(String userID, String password) {
        return false;
    }

    // Checks if UserID is taken
    @Override
    public boolean isUser(String userID) {
        return false;
    }

    // Returns user matching ID
    // Only call if existence of user is known
    @Override
    public User getUserFromId(String userID) {
        return null;
    }

    // Returns list of users with given name
    @Override
    public List<User> getUsersFromName(String name) {
        return null;
    }

    // Adds user
    @Override
    public void addUser(User user) {

    }

    // Deletes User
    @Override
    public void deleteUser(String userID) {

    }

    // Returns list of users for feed
    @Override
    public List<User> feedUsers(int numUsers) {
        return null;
    }
}
