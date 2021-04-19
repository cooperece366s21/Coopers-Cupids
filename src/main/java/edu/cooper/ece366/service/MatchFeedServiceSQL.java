package edu.cooper.ece366.service;

import edu.cooper.ece366.model.Profile;
import edu.cooper.ece366.store.MatchStore;
import edu.cooper.ece366.store.UserStore;

import java.util.List;
import java.util.stream.Collectors;

public class MatchFeedServiceSQL implements MatchFeedService {
    private MatchStore matchStore;
    private UserStore userStore;

    public MatchFeedServiceSQL(MatchStore matchStore, UserStore userStore) {
        this.matchStore = matchStore;
        this.userStore = userStore;
    }

    @Override
    public List<Profile> getUserFeed(String userID, int numUsers) {
        List<Profile> userFeed;

        userFeed = this.matchStore.getLikedBy(userID)
                            .stream()
                            .map(uid -> this.userStore.getProfileFromId(uid))
                            .filter(user -> !this.matchStore.isMatch(user.getUserID(), userID)
                                && !this.matchStore.getDislikes(userID).contains(user.getUserID()))
                            .collect(Collectors.toList());

//        for (Profile p : userFeed) {
//            System.out.println(p.getName());
//        }

        int prevFeedSize = userFeed.size(), attempts = 0;

        while (attempts < 5) {
            userFeed.addAll(this.userStore.feedUsers(numUsers)
                                .stream()
                                .filter(user -> !this.matchStore.getLikes(userID).contains(user.getUserID())
                                    && !this.matchStore.getDislikes(userID).contains(user.getUserID())
                                    && !this.matchStore.getDislikes(user.getUserID()).contains(userID)
                                    && this.userStore.getUserFromId(user.getUserID()).hasProfile()
                                    && !this.matchStore.isMatch(user.getUserID(), userID)
                                    && !user.getUserID().equals(userID)
                                    && !userFeed.contains(user))
                                .collect(Collectors.toList())
                                );

            if (userFeed.size() == prevFeedSize) {
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
