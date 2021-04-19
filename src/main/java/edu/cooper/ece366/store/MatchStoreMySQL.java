package edu.cooper.ece366.store;

import java.util.List;
import java.util.Optional;

import org.jdbi.v3.core.Jdbi;

public class MatchStoreMySQL implements MatchStore {

    private final Jdbi jdbi;

    public MatchStoreMySQL(final Jdbi jdbi) { this.jdbi = jdbi; }

    @Override
    public boolean addLike(String userID, String likedUserID) {
        // logic for if user already made decision on this other user
        Optional<Integer> lod = jdbi.withHandle(handle ->
                handle.createQuery("SELECT like_dislike FROM likes_dislikes WHERE from_userID = ? AND to_userID = ?")
                        .bind(0, userID)
                        .bind(1, likedUserID)
                        .mapTo(Integer.class)
                        .findOne());
        if (lod.isPresent()) {
            // decision was already handled (matched if necessary)
            return false;
        }
        else {
            jdbi.useHandle(handle ->
                    handle.execute("INSERT INTO likes_dislikes (from_userID, to_userID, like_dislike) VALUES (?, ?, 'LIKE')",
                            userID, likedUserID));
            Optional<Integer> likedlod = jdbi.withHandle(handle ->
                    handle.createQuery("SELECT like_dislike FROM likes_dislikes WHERE from_userID = ? AND to_userID = ?")
                            .bind(0, likedUserID)
                            .bind(1, userID)
                            .mapTo(Integer.class)
                            .findOne());
            if (likedlod.isPresent() && likedlod.get() == 0) {
                jdbi.useHandle(handle ->
                        handle.execute("INSERT INTO matches (userID1, userID2) VALUES (?, ?)",
                                userID, likedUserID));
                return true;
            }
            return false;
        }
    }

    @Override
    public void addDislike(String userID, String dislikedUserID) {
        Optional<Integer> lod = jdbi.withHandle(handle ->
                handle.createQuery("SELECT like_dislike FROM likes_dislikes WHERE from_userID = ? AND to_userID = ?")
                        .bind(0, userID)
                        .bind(1, dislikedUserID)
                        .mapTo(Integer.class)
                        .findOne());
        if (!lod.isPresent()) {
            jdbi.useHandle(handle ->
                    handle.execute("INSERT INTO likes_dislikes (from_userID, to_userID, like_dislike) VALUES (?, ?, 'DISLIKE')",
                            userID, dislikedUserID));
        }
    }

    @Override
    public void unmatch(String userID, String unmatchedUserID) {
        Optional<String> oneID = jdbi.withHandle(handle ->
                handle.createQuery("SELECT userID1 FROM matches WHERE (userID1 = ? and userID2 = ?) OR (userID2 = ? AND userID1 = ?)")
                        .bind(0, userID)
                        .bind(1, unmatchedUserID)
                        .bind(2, userID)
                        .bind(3, unmatchedUserID)
                        .mapTo(String.class)
                        .findOne());
        if (oneID.isPresent()) {
            jdbi.useHandle(handle ->
                    handle.execute("DELETE FROM matches WHERE (userID1 = ? and userID2 = ?) OR (userID2 = ? AND userID1 = ?)",
                            userID, unmatchedUserID, userID, unmatchedUserID));
        }
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
