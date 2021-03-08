package edu.cooper.ece366.store;

import edu.cooper.ece366.model.User;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

public class UserStoreImpl implements UserStore {
    // List of all users
    private List<User> users;

    // Constructor
    public UserStoreImpl() {
        users = new ArrayList<User>();
    }

    // Checks if UserID is taken
    @Override
    public boolean isUser(String userID) {
        return users.stream().anyMatch(user -> user.getUserID().equals(userID));
    }

    // Returns user matching ID
    // Only call if existence of user is known
    @Override
    public User getUserFromId(String userID) {
        for(User u : users) {
            if(u.getUserID().equals(userID)) {
                return u;
            }
        }
        // Not sure how to quiet IDE about no return statement
        return users.get(0);
    }

    // Returns list of users with given name
    @Override
    public List<User> getUsersFromName(String name) {
        return users.stream()
                .filter(user -> user.getProfile().getName().equals(name))
                .collect(Collectors.toList());
    }

    // Adds user
    @Override
    public void addUser(User user) {
        users.add(user);
    }

    // Deletes User
    @Override
    public void deleteUser(String userID) {
        for(int i = 0; i < users.size(); i++) {
            if(users.get(i).getUserID().equals(userID)) {
                users.remove(i);
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
        List<User> userFeed = new ArrayList<User>();

        // Check if number of wanted users > number of users available
        if(numUsers >= users.size()) {
            userFeed.addAll(users);
        } else {
            Random random = new Random();
            for(int i = 0, randNum = random.nextInt(users.size()); i < numUsers; i++) {
                while(userFeed.contains(users.get(randNum))) {
                    randNum = random.nextInt(users.size());
                }
                userFeed.add(users.get(randNum));
            }
        }

        return userFeed;
    }
}
