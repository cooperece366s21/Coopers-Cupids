package edu.cooper.ece366.store;

import edu.cooper.ece366.model.User;

import java.util.List;

public interface UserStore {

    // Checks if password is correct
    boolean validateUser(String userID, String password);

    // Checks if UserID is taken
    boolean isUser(String userID);

    // Returns user matching ID
    User getUserFromId(String userID);

    // Returns list of users with given name
    List<User> getUsersFromName(String name);

    // Adds user
    void addUser(User user);

    // Deletes User
    void deleteUser(String userID);

    // Returns list of users for feed
    List<User> feedUsers(int numUsers);
}