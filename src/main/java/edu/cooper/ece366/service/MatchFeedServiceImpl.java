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

    @Override
    public List<User> getUserFeed(String userID) {
        // Create UserFeed
        List<User> userFeed;

        // Pull list of users that liked this user
        userFeed = matchStore.getLikedBy(userID)
                            .stream()
                            .map(uid -> userStore.getUserFromId(uid))
                            .collect(Collectors.toList());

        // TODO: Filter list for users already seen

        // TODO: Add function to UserStore that returns list of random user

        return userFeed;
    }
}
