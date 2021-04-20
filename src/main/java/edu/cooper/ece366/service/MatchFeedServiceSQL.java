package edu.cooper.ece366.service;

import java.util.List;
import java.util.Collections;
import java.util.stream.Collectors;

import edu.cooper.ece366.model.Profile;
import edu.cooper.ece366.store.MatchStore;
import edu.cooper.ece366.store.UserStore;

public class MatchFeedServiceSQL implements MatchFeedService {
    private final MatchStore matchStore;
    private final UserStore userStore;

    public MatchFeedServiceSQL(MatchStore matchStore, UserStore userStore) {
        this.matchStore = matchStore;
        this.userStore = userStore;
    }

    @Override
    public List<Profile> getUserFeed(String userID, int numUsers) {
        List<Profile> userFeed;

        userFeed = this.matchStore.getLikedBy(userID)
                            .stream()
                            .map(this.userStore::getProfileFromId)
                            .filter(user -> !this.matchStore.isMatch(user.getUserID(), userID) // already matched
                                && !this.matchStore.getDislikes(userID).contains(user.getUserID()) // user disliked person that likes them
                                && this.userStore.getUserFromId(user.getUserID()).hasProfile()) // make sure they have a profile
                            .collect(Collectors.toList());

        int prevFeedSize = userFeed.size(), attempts = 0;

        while (attempts < 5) {
            userFeed.addAll(this.userStore.feedUsers(numUsers)
                                .stream()
                                .filter(user -> !userFeed.contains(user)
                                    && this.userStore.getUserFromId(user.getUserID()).hasProfile()
                                    && !this.matchStore.getLikes(userID).contains(user.getUserID())
                                    && !this.matchStore.getDislikes(userID).contains(user.getUserID())
                                    && !this.matchStore.getDislikes(user.getUserID()).contains(userID)
                                    && !this.matchStore.isMatch(user.getUserID(), userID)
                                    && !user.getUserID().equals(userID))
                                .collect(Collectors.toList()));

            if (userFeed.size() == prevFeedSize) {
                attempts++;
            }
            else {
                prevFeedSize = userFeed.size();
                attempts = 0;
            }
        }
        // done so that not all the people that liked them came up first
        Collections.shuffle(userFeed);

        return userFeed;
    }

    @Override
    public MatchStore getMatchStore() { return this.matchStore; }

    @Override
    public UserStore getUserStore() { return this.userStore; }
}
