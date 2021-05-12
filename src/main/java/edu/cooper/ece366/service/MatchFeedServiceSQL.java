package edu.cooper.ece366.service;

import java.util.*;
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

    // Returns a List of profile to show to user in feed
    @Override
    public List<Profile> getUserFeed(String userID, int numUsers) {
        List<Profile> userFeed;

        userFeed = this.matchStore.getLikedBy(userID)
                            .stream()
                            .map(this.userStore::getProfileFromId)
                            .filter(user -> !this.matchStore.isMatch(user.getUserID(), userID) // already matched
                                && !this.matchStore.getDislikes(userID).contains(user.getUserID())) // user disliked person that likes them
                            .collect(Collectors.toList());

        if (userFeed.size() >= numUsers) {
            // Case for very attractive person
            // GET THEM OFF THE APP
            Collections.shuffle(userFeed);
            return userFeed.subList(0, numUsers);
        }
        else {
            int tolerance = 3;
            int tolIts = 0;
            int totIts = 0;
            while (userFeed.size() < numUsers) {
                int finalTolerance = tolerance;
                List<Profile> fedUsers = this.userStore.feedUsers(numUsers * 2);
                if (tolerance > 0) {
                    // request more users that output because assuming most wont fit tolerance
                    userFeed.addAll(fedUsers
                            .stream()
                            .filter(user -> !userFeed.contains(user)
                                    && !this.matchStore.getLikes(userID).contains(user.getUserID())
                                    && !this.matchStore.getDislikes(userID).contains(user.getUserID())
                                    && !this.matchStore.getDislikes(user.getUserID()).contains(userID)
                                    && !this.matchStore.isMatch(user.getUserID(), userID)
                                    && !user.getUserID().equals(userID)
                                    && similarity(user, this.userStore.getProfileFromId(userID)) >= finalTolerance)
                            .collect(Collectors.toList()));
                    // if the size of the fed users is less than requested (meaning there are less users than requested),
                    // then decrease the tolerance immediately since everyone that could have been added at this
                    // tolerance has been
                    if (fedUsers.size() < numUsers * 2) {
                        tolerance -= 1;
                        continue;
                    }
                }
                else {
                    // no point of calling similarity function if tolerance is 0 or less (waste of time)
                    userFeed.addAll(fedUsers
                            .stream()
                            .filter(user -> !userFeed.contains(user)
                                    && !this.matchStore.getLikes(userID).contains(user.getUserID())
                                    && !this.matchStore.getDislikes(userID).contains(user.getUserID())
                                    && !this.matchStore.getDislikes(user.getUserID()).contains(userID)
                                    && !this.matchStore.isMatch(user.getUserID(), userID)
                                    && !user.getUserID().equals(userID))
                            .collect(Collectors.toList()));
                    // if the size of the users is less than requested (meaning there are less users than requested),
                    // then end loop immediately because everyone that was eligible to be added was added
                    if (fedUsers.size() < numUsers * 2) {
                        break;
                    }
                }
                if (totIts == 9) {
                    break;
                }
                else if (tolIts == 1) {
                    tolerance -= 1;
                    tolIts = 0;
                    totIts += 1;
                }
                else {
                    tolIts += 1;
                    totIts += 1;
                }
            }
            Collections.shuffle(userFeed);
            if (userFeed.size() >= numUsers) {
                return userFeed.subList(0, numUsers);
            }
            return userFeed;
        }
    }

    @Override
    public MatchStore getMatchStore() { return this.matchStore; }

    @Override
    public UserStore getUserStore() { return this.userStore; }

    public int similarity(Profile one, Profile two) {
        int same = 0;

        String ones = one.getInterests().toLowerCase();
        String twos = two.getInterests().toLowerCase();


        Set<String> oneInterests = new HashSet<>(Arrays.asList(ones.split(",")));
        String[] twoInterests = twos.split(",");


        for (String interest : twoInterests) {
            if (oneInterests.contains(interest)) {
                same += 1;
            }
        }

        return same;
    }
}
