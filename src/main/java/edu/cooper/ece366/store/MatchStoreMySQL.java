package edu.cooper.ece366.store;

import org.jdbi.v3.core.Jdbi;

import java.util.List;

public class MatchStoreMySQL implements MatchStore {

    private final Jdbi jdbi;

    public MatchStoreMySQL(final Jdbi jdbi) { this.jdbi = jdbi; }

    @Override
    public boolean addLike(String userID, String likedUserID) {
        return false;
    }

    @Override
    public void addDislike(String userID, String dislikedUserID) {

    }

    @Override
    public void unmatch(String userID, String unmatchedUserID) {

    }

    // Returns list of userIDs that user has liked
    // If none, returns empty list
    @Override
    public List<String> getLikes(String userID) {
        return null;
    }

    // Returns list of userIDs that user has disliked
    // If none, returns empty list
    @Override
    public List<String> getDislikes(String userID) {
        return null;
    }

    // Returns list of userIDs that liked user
    // If none, returns empty list
    @Override
    public List<String> getLikedBy(String userID) {
        return null;
    }

    // Returns list of userIDs that matched with user (users liked each other)
    // If none, returns empty list
    @Override
    public List<String> getMatches(String userID) {
        return null;
    }

    @Override
    public boolean isMatch(String userID, String matchUserID) {
        return false;
    }
}
