package edu.cooper.ece366.service;

import edu.cooper.ece366.model.User;
import edu.cooper.ece366.store.MatchStoreImpl;
import edu.cooper.ece366.store.UserStore;
import edu.cooper.ece366.store.UserStoreImpl;

import java.util.List;
import java.util.stream.Collectors;

public class MatchFeedServiceImpl implements MatchFeedService {
    private MatchStoreImpl matchStore;
    private UserStoreImpl userStore;

    public MatchFeedServiceImpl(MatchStoreImpl matchStore, UserStoreImpl userStore) {
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
        userFeed = matchStore.getLikedBy(userID)
                            .stream()
                            .map(uid -> userStore.getUserFromId(uid))
                            .collect(Collectors.toList());

        // Repeats request to userStore until size of feed is the wanted size
        // Times out after multiple attempts that do not change feed size
        int prevFeedSize = userFeed.size(), attempts = 0;

        while(attempts < 5) {
            // Gets list of users from userStore
            userFeed.addAll(userStore.feedUsers(numUsers));

            // Removes current user from list (Don't want to see yourself)
            if(userFeed.contains(userStore.getUserFromId(userID))) {
                userFeed.remove(userStore.getUserFromId(userID));
            }

            // Filters list to not show users already seen
            // For now, seen = liked + disliked
            userFeed.stream()
                    .filter(user -> !matchStore.getLikes(userID).contains(user.getUserID())
                            && !matchStore.getDislikes(userID).contains(user.getUserID()))
                    .collect(Collectors.toList());

            // Checks if new users were added
            if(userFeed.size() == prevFeedSize) {
                attempts++;
            } else {
                prevFeedSize = userFeed.size();
                attempts = 0;
            }
        }

        return userFeed;
    }
}
