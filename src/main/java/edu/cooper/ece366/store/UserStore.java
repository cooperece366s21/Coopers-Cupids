package edu.cooper.ece366.store;

import java.util.List;

import edu.cooper.ece366.model.User;
import edu.cooper.ece366.model.Profile;

public interface UserStore {

    // Checks if password is correct
    boolean validateUser(String userID, String password);

    // Checks if UserID is taken
    boolean isUser(String userID);

    // Returns user matching ID
    User getUserFromId(String userID);

    // Adds user
    void addUser(User user);

    // Deletes User
    void deleteUser(String userID);

    // Returns list of users for feed
    List<Profile> feedUsers(int numUsers);

    void addProfile(Profile profile);

    Profile getProfileFromId(String userID);
}
