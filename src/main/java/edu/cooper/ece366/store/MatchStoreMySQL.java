package edu.cooper.ece366.store;

import java.util.List;
import java.util.Optional;
import org.jdbi.v3.core.Jdbi;

public class MatchStoreMySQL implements MatchStore {
    private final Jdbi jdbi;

    public MatchStoreMySQL(final Jdbi jdbi) { this.jdbi = jdbi; }

    @Override
    public boolean addLike(String userID, String likedUserID) {
        if (userID.equals(likedUserID)) {
            return false;
        }
        // logic for if user already made decision on this other user
        Optional<String> lod = this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT like_dislike FROM likes_dislikes WHERE from_userID = ? AND to_userID = ?")
                        .bind(0, userID)
                        .bind(1, likedUserID)
                        .mapTo(String.class)
                        .findOne());
        if (lod.isPresent()) {
            // decision was already handled (matched if necessary)
            return false;
        }
        else {
            this.jdbi.useHandle(handle ->
                    handle.execute("INSERT INTO likes_dislikes (from_userID, to_userID, like_dislike) VALUES (?, ?, 'LIKE')",
                            userID, likedUserID));
            Optional<String> likedlod = jdbi.withHandle(handle ->
                    handle.createQuery("SELECT like_dislike FROM likes_dislikes WHERE from_userID = ? AND to_userID = ?")
                            .bind(0, likedUserID)
                            .bind(1, userID)
                            .mapTo(String.class)
                            .findOne());
            if (likedlod.isPresent() && likedlod.get().equals("LIKE")) {
                this.jdbi.useHandle(handle ->
                        handle.execute("INSERT INTO matches (userID1, userID2) VALUES (?, ?)",
                                userID, likedUserID));
                return true;
            }
            return false;
        }
    }

    @Override
    public void addDislike(String userID, String dislikedUserID) {
        if (userID.equals(dislikedUserID)) {
            return;
        }
        Optional<String> lod = this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT like_dislike FROM likes_dislikes WHERE from_userID = ? AND to_userID = ?")
                        .bind(0, userID)
                        .bind(1, dislikedUserID)
                        .mapTo(String.class)
                        .findOne());
        if (lod.isEmpty()) {
            this.jdbi.useHandle(handle ->
                    handle.execute("INSERT INTO likes_dislikes (from_userID, to_userID, like_dislike) VALUES (?, ?, 'DISLIKE')",
                            userID, dislikedUserID));
        }
    }

    @Override
    public void unmatch(String userID, String unmatchedUserID) {
        Optional<String> oneID = this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT userID1 FROM matches WHERE (userID1 = ? and userID2 = ?) OR (userID2 = ? AND userID1 = ?)")
                        .bind(0, userID)
                        .bind(1, unmatchedUserID)
                        .bind(2, userID)
                        .bind(3, unmatchedUserID)
                        .mapTo(String.class)
                        .findOne());
        if (oneID.isPresent()) {
            this.jdbi.useHandle(handle ->
                    handle.execute("DELETE FROM matches WHERE (userID1 = ? and userID2 = ?) OR (userID2 = ? AND userID1 = ?)",
                            userID, unmatchedUserID, userID, unmatchedUserID));
        }
    }

    // Returns list of userIDs that user has liked
    // If none, returns empty list
    @Override
    public List<String> getLikes(String userID) {
        List<String> likes = this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT to_userID FROM likes_dislikes WHERE from_userID = ? AND like_dislike = 'LIKE'")
                        .bind(0, userID)
                        .mapTo(String.class)
                        .list());
        return likes;
    }

    // Returns list of userIDs that user has disliked
    // If none, returns empty list
    @Override
    public List<String> getDislikes(String userID) {
        List<String> dislikes = this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT to_userID FROM likes_dislikes WHERE from_userID = ? AND like_dislike = 'DISLIKE'")
                        .bind(0, userID)
                        .mapTo(String.class)
                        .list());
        return dislikes;
    }

    // Returns list of userIDs that liked user
    // If none, returns empty list
    @Override
    public List<String> getLikedBy(String userID) {
        List<String> likedBy = this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT from_userID FROM likes_dislikes WHERE to_userID = ? AND like_dislike = 'LIKE'")
                        .bind(0, userID)
                        .mapTo(String.class)
                        .list());
        return likedBy;
    }

    // Returns list of userIDs that matched with user (users liked each other)
    // If none, returns empty list
    @Override
    public List<String> getMatches(String userID) {
        List<String> matches1 = this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT userID1 FROM matches WHERE userID2 = ?")
                        .bind(0, userID)
                        .mapTo(String.class)
                        .list());
        List<String> matches2 = this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT userID2 FROM matches WHERE userID1 = ?")
                        .bind(0, userID)
                        .mapTo(String.class)
                        .list());
        matches1.addAll(matches2);
        return matches1;
    }

    @Override
    public boolean isMatch(String userID, String matchUserID) {
        Optional<String> match = this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT userID1 FROM matches WHERE (userID1 = ? AND userID2 = ?) OR (userID2 = ? AND userID1 = ?)")
                        .bind(0, userID)
                        .bind(1, matchUserID)
                        .bind(2, userID)
                        .bind(3, matchUserID)
                        .mapTo(String.class)
                        .findOne());
        return match.isPresent();
    }
}
