package edu.cooper.ece366.store;

import edu.cooper.ece366.model.User;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

public class UserStoreImpl implements UserStore {
    // List of all users
    private static final List<User> users = new ArrayList<>();

    @Override
    public boolean validateUser(String userID, String password) {
        return isUser(userID) && getUserFromId(userID).checkPass(password);
    }

    // Checks if UserID is taken
    @Override
    public boolean isUser(String userID) { return this.users.stream().anyMatch(user -> user.getUserID().equals(userID)); }

    // Returns user matching ID
    // Only call if existence of user is known
    @Override
    public User getUserFromId(String userID) {
        for(User u : this.users) {
            if(u.getUserID().equals(userID)) {
                return u;
            }
        }
        // Not sure how to quiet IDE about no return statement
        return null;
    }

    // Returns list of users with given name
    @Override
    public List<User> getUsersFromName(String name) {
        return this.users.stream()
                .filter(user -> user.getProfile().getName().equals(name))
                .collect(Collectors.toList());
    }

    // Adds user
    @Override
    public void addUser(User user) { this.users.add(user); }

    // Deletes User
    @Override
    public void deleteUser(String userID) {
        for(int i = 0; i < this.users.size(); i++) {
            if(this.users.get(i).getUserID().equals(userID)) {
                this.users.remove(i);
                return;
            }
        }
        /* With Streams
        users = users.stream()
                .filter(user -> !user.getUserID().equals(userID))
                .collect(Collectors.toList());
         */
    }

    // Returns list of users for feed
    // Currently, this list is random and receiver of list is responsible for filtering seen / liked users
    //      as well as the user asking for feed
    // Argument: Number of users to return
    @Override
    public List<User> feedUsers(int numUsers) {
        List<User> userFeed = new ArrayList<>();

        // Check if number of wanted users > number of users available
        if(numUsers >= this.users.size()) {
            userFeed.addAll(this.users);
        }
        else {
            Random random = new Random();
            for(int i = 0, randNum = random.nextInt(this.users.size()); i < numUsers; i++) {
                while(userFeed.contains(this.users.get(randNum))) {
                    randNum = random.nextInt(this.users.size());
                }
                userFeed.add(this.users.get(randNum));
            }
        }

        return userFeed;
    }
}
