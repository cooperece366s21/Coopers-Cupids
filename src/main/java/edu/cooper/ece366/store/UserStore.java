package edu.cooper.ece366.store;

import java.util.List;

import edu.cooper.ece366.model.User;
import edu.cooper.ece366.model.Profile;

public interface UserStore {

    // returns a userID not in use
    String assignUserId();

    // checks whether email is already in user
    // returns false if email not used
    boolean checkEmail(String email);

    // checks if password is correct
    boolean validateUser(String userID, String password);

    // checks if UserID is taken
    boolean isUser(String userID);

    // returns user matching ID
    User getUserFromId(String userID);

    // adds user
    void addUser(User user);

    // deletes User
    void deleteUser(String userID);

    // returns list of users for feed
    List<Profile> feedUsers(int numUsers);

    // method to add a profile for a user
    void addProfile(Profile profile);

    // returns the email from id
    String getEmailFromId(String userID);

    // returns the id from email
    String getIdFromEmail(String email);

    // returns profile from id
    Profile getProfileFromId(String userID);

    // method to update email
    void updateEmail(String userID, String email);

    // method to update password
    void updatePassword(String userID, String password);

    // method to update profile
    void updateProfile(Profile profile);
}
