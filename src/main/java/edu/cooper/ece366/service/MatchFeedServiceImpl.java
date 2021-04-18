package edu.cooper.ece366.service;

import java.util.List;
import java.util.stream.Collectors;

import edu.cooper.ece366.model.User;
import edu.cooper.ece366.store.MatchStore;
import edu.cooper.ece366.store.UserStore;

public class MatchFeedServiceImpl implements MatchFeedService {
    private MatchStore matchStore;
    private UserStore userStore;

    public MatchFeedServiceImpl(MatchStore matchStore, UserStore userStore) {
        this.matchStore = matchStore;
        this.userStore = userStore;
    }

    // Builds user feed
    // Pulls list of users and filters it
    // Arguments: userID to build feed for, size of feed
    @Override
    public List<User> getUserFeed(String userID, int numUsers) {
        // Create UserFeed
        List<User> userFeed;

        // Pull list of users that liked this user
        userFeed = this.matchStore.getLikedBy(userID)
                            .stream()
                            .map(uid -> this.userStore.getUserFromId(uid))
                            .collect(Collectors.toList());

        // Repeats request to userStore until size of feed is the wanted size
        // Times out after multiple attempts that do not change feed size
        int prevFeedSize = userFeed.size(), attempts = 0;

        while(attempts < 5) {
            // Gets list of users from userStore & filters list
            // Removes already seen: for now, seen = liked + disliked
            // Removes users who disliked this user
            // Removes self (don't want to see yourself)
            // Removes users without a profile to show
            // Removes users already in feed
            userFeed.addAll(this.userStore.feedUsers(numUsers)
                            .stream()
                            .filter(user -> !this.matchStore.getLikes(userID).contains(user.getUserID())
                                && !this.matchStore.getDislikes(userID).contains(user.getUserID())
                                && !this.matchStore.getDislikes(user.getUserID()).contains(userID)
                                && this.userStore.getUserFromId(user.getUserID()).hasProfile()
                                && !user.getUserID().equals(userID)
                                && !userFeed.contains(user))
                            .collect(Collectors.toList())
                            );

            // Checks if new users were added
            if(userFeed.size() == prevFeedSize) {
                attempts++;
            }
            else {
                prevFeedSize = userFeed.size();
                attempts = 0;
            }
        }

        return userFeed;
    }

    @Override
    public MatchStore getMatchStore() { return this.matchStore; }

    @Override
    public UserStore getUserStore() { return this.userStore; }
}
