package edu.cooper.ece366.store;

import java.util.Map;
import java.util.List;
import java.util.HashMap;
import java.util.ArrayList;

public class MatchStoreImpl implements MatchStore {
    // Maps userID to list of UserIDs that user has liked
    private static final Map<String, List<String>> likes = new HashMap<>();
    // Maps userID to list of UserIDs that user has disliked (blocked)
    private static final Map<String, List<String>> dislikes = new HashMap<>();
    // Maps userID to list of UserIDs that have liked user
    // Makes reverse-lookup easier to populate feed faster
    private static final Map<String, List<String>> likedBy = new HashMap<>();
    // Maps userID to list of userIDs that user has matched with
    private static final Map<String, List<String>> matches = new HashMap<>();

    // Added return value to indicate that a new match has been made
    @Override
    public boolean addLike(String userID, String likedUserID) {
        // --- Adds to liked list ---
        // Checks if user is in map already
        if(this.likes.containsKey(userID)) {
            if(!this.likes.get(userID).contains(likedUserID)) {
                this.likes.get(userID).add(likedUserID);
            }
        }
        else {
            List<String> userLikes = new ArrayList<>();
            userLikes.add(likedUserID);
            this.likes.put(userID, userLikes);
        }

        // --- Adds to likedBy list ---
        // Checks if user is in map already
        if(this.likedBy.containsKey(likedUserID)) {
            if(!this.likedBy.get(likedUserID).contains(userID)) {
                this.likedBy.get(likedUserID).add(userID);
            }
        }
        else {
            List<String> userLikedBy = new ArrayList<>();
            userLikedBy.add(userID);
            this.likedBy.put(likedUserID, userLikedBy);
        }

        // --- Checks for matches ---
        if(this.likes.containsKey(likedUserID) && this.likes.get(likedUserID).contains(userID)) {
            // Checks if user is in match list already
            if(this.matches.containsKey(userID)) {
                if(!this.matches.get(userID).contains(likedUserID)) {
                    this.matches.get(userID).add(likedUserID);
                }
            }
            else {
                List<String> userMatches = new ArrayList<>();
                userMatches.add(likedUserID);
                this.matches.put(userID, userMatches);
            }

            // Checks if liked user is in match list already and then return a match
            // If return statement not reached, then not a new match and therefore wont return true
            if(this.matches.containsKey(likedUserID)) {
                if(!this.matches.get(likedUserID).contains(userID)) {
                    this.matches.get(likedUserID).add(userID);
                    return true;
                }
            }
            else {
                List<String> userMatches = new ArrayList<>();
                userMatches.add(userID);
                this.matches.put(likedUserID, userMatches);
                return true;
            }
        }
        return false;
    }

    @Override
    public void addDislike(String userID, String dislikedUserID) {
        // Checks if user is in list already
        if(this.dislikes.containsKey(userID)) {
            if(!this.dislikes.get(userID).contains(dislikedUserID)) {
                this.dislikes.get(userID).add(dislikedUserID);
            }
        }
        else {
            List<String> userDislikes = new ArrayList<>();
            userDislikes.add(dislikedUserID);
            this.dislikes.put(userID, userDislikes);
        }
    }

    @Override
    public void unmatch(String userID, String likedUserID) {
        // Removes from likes list
        likes.get(userID).remove(likedUserID);

        // Removes from likedBy list
        likedBy.get(likedUserID).remove(userID);

        // Removes from matches list if needed
        if(matches.containsKey(userID) && matches.get(userID).contains(likedUserID)) {
            matches.get(userID).remove(likedUserID);
            matches.get(likedUserID).remove(userID);
        }

    }

    // Returns list of userIDs that user has liked
    // If none, returns empty list
    @Override
    public List<String> getLikes(String userID) {
        if(this.likes.containsKey(userID)) {
            return this.likes.get(userID);
        }
        else {
            return List.of();
        }
    }

    // Returns list of userIDs that user has disliked
    // If none, returns empty list
    @Override
    public List<String> getDislikes(String userID) {
        if(this.dislikes.containsKey(userID)) {
            return this.dislikes.get(userID);
        }
        else {
            return List.of();
        }
    }

    // Returns list of userIDs that liked user
    // If none, returns empty list
    @Override
    public List<String> getLikedBy(String userID) {
        if(this.likedBy.containsKey(userID)) {
            return this.likedBy.get(userID);
        }
        else {
            return List.of();
        }
    }

    // Returns list of userIDs that matched with user (users liked each other)
    // If none, returns empty list
    @Override
    public List<String> getMatches(String userID) {
        if(this.matches.containsKey(userID)) {
            return this.matches.get(userID);
        }
        else {
            return List.of();
        }
    }

    @Override
    public boolean isMatch(String userID, String matchUserID) {
        return this.matches.get(userID).contains(matchUserID) && this.matches.get(matchUserID).contains(userID);
    }
}
