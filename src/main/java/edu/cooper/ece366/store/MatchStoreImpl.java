package edu.cooper.ece366.store;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MatchStoreImpl implements MatchStore {
    // Maps userID to list of UserIDs that user has liked
    private Map<String, List<String>> likes;
    // Maps userID to list of UserIDs that user has disliked (blocked)
    private Map<String, List<String>> dislikes;
    // Maps userID to list of UserIDs that have liked user
    // Makes reverse-lookup easier to populate feed faster
    private Map<String, List<String>> likedBy;
    // Maps userID to list of userIDs that user has matched with
    private Map<String, List<String>> matches;

    public MatchStoreImpl() {
        likes = new HashMap<String, List<String>>();
        dislikes = new HashMap<String, List<String>>();
        likedBy = new HashMap<String, List<String>>();
        matches = new HashMap<String, List<String>>();
    }

    // Assumes user is not already liked (can't like twice)
    // Maybe use a Set instead to enforce this?
    @Override
    public void addLike(String userID, String likedUserID) {
        // --- Adds to liked list ---
        // Checks if user is in list already
        if(likes.containsKey(userID)) {
            likes.get(userID).add(likedUserID);
        } else {
            List<String> userLikes = new ArrayList<String>();
            userLikes.add(likedUserID);
            likes.put(userID, userLikes);
        }

        // --- Adds to likedBy list ---
        // Checks if user is in list already
        if(likedBy.containsKey(likedUserID)) {
            likedBy.get(likedUserID).add(userID);
        } else {
            List<String> userLikedBy = new ArrayList<String>();
            userLikedBy.add(userID);
            likedBy.put(likedUserID, userLikedBy);
        }

        // --- Checks for matches ---
        if(likes.containsKey(likedUserID) && likes.get(likedUserID).contains(userID)) {
            // Checks if user is in match list already
            if(matches.containsKey(userID)) {
                matches.get(userID).add(likedUserID);
            } else {
                List<String> userMatches = new ArrayList<String>();
                userMatches.add(likedUserID);
                matches.put(userID, userMatches);
            }

            // Checks if liked user is in match list already
            if(matches.containsKey(likedUserID)) {
                matches.get(likedUserID).add(userID);
            } else {
                List<String> userMatches = new ArrayList<String>();
                userMatches.add(userID);
                matches.put(likedUserID, userMatches);
            }
        }
    }

    @Override
    public void removeLike(String userID, String likedUserID) {
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

    @Override
    public void addDislike(String userID, String dislikedUserID) {
        // Checks if user is in list already
        if(dislikes.containsKey(userID)) {
            dislikes.get(userID).add(dislikedUserID);
        } else {
            List<String> userDislikes = new ArrayList<String>();
            userDislikes.add(dislikedUserID);
            dislikes.put(userID, userDislikes);
        }
    }

    @Override
    public void removeDislike(String userID, String dislikedUserID) {
        dislikes.get(userID).remove(dislikedUserID);
    }

    // Returns list of userIDs that user has liked
    // If none, returns empty list
    @Override
    public List<String> getLikes(String userID) {
        if(likes.containsKey(userID)) {
            return likes.get(userID);
        } else {
            return List.of();
        }
    }

    // Returns list of userIDs that user has disliked
    // If none, returns empty list
    @Override
    public List<String> getDislikes(String userID) {
        if(dislikes.containsKey(userID)) {
            return dislikes.get(userID);
        } else {
            return List.of();
        }
    }

    // Returns list of userIDs that liked user
    // If none, returns empty list
    @Override
    public List<String> getLikedBy(String userID) {
        if(likedBy.containsKey(userID)) {
            return likedBy.get(userID);
        } else {
            return List.of();
        }
    }

    // Returns list of userIDs that matched with user (users liked each other)
    // If none, returns empty list
    @Override
    public List<String> getMatches(String userID) {
        if(matches.containsKey(userID)) {
            return matches.get(userID);
        } else {
            return List.of();
        }
    }
}
