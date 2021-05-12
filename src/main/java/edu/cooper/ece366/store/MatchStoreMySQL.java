package edu.cooper.ece366.store;

import java.util.List;
import java.util.Optional;
import org.jdbi.v3.core.Jdbi;

public class MatchStoreMySQL implements MatchStore {
    private final Jdbi jdbi;

    public MatchStoreMySQL(final Jdbi jdbi) { this.jdbi = jdbi; }

    // Returns if like resulted in a match
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
            // cant change decision
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
            return likedlod.isPresent() && likedlod.get().equals("LIKE");
        }
    }

    // Only adds dislike to database
    @Override
    public void addDislike(String userID, String dislikedUserID) {
        if (userID.equals(dislikedUserID)) {
            return;
        }
        // logic for if user already made decision on this other user
        Optional<String> lod = this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT like_dislike FROM likes_dislikes WHERE from_userID = ? AND to_userID = ?")
                        .bind(0, userID)
                        .bind(1, dislikedUserID)
                        .mapTo(String.class)
                        .findOne());
        // cant change decision
        if (lod.isEmpty()) {
            this.jdbi.useHandle(handle ->
                    handle.execute("INSERT INTO likes_dislikes (from_userID, to_userID, like_dislike) VALUES (?, ?, 'DISLIKE')",
                            userID, dislikedUserID));
        }
    }

    // Only removes all associated conversations and adds a dislike so user doesnt show up in feed
    @Override
    public void unmatch(String userID, String unmatchedUserID) {
        this.jdbi.useHandle(handle ->
                handle.execute("DELETE FROM messages WHERE (from_userID = ? AND to_userID = ?) OR (to_userID = ? AND from_userID = ?)",
                        userID,
                        unmatchedUserID,
                        userID,
                        unmatchedUserID));
        this.jdbi.useHandle(handle ->
                handle.execute("DELETE FROM likes_dislikes WHERE (from_userID = ? and to_userID = ?) OR (to_userID = ? AND from_userID = ?)",
                        userID,
                        unmatchedUserID,
                        userID,
                        unmatchedUserID));
        addDislike(userID, unmatchedUserID);
    }

    // Returns list of userIDs that user has liked
    // If none, returns empty list
    @Override
    public List<String> getLikes(String userID) {
        return this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT to_userID FROM likes_dislikes WHERE from_userID = ? AND like_dislike = 'LIKE'")
                        .bind(0, userID)
                        .mapTo(String.class)
                        .list());
    }

    // Returns list of userIDs that user has disliked
    // If none, returns empty list
    @Override
    public List<String> getDislikes(String userID) {
        return this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT to_userID FROM likes_dislikes WHERE from_userID = ? AND like_dislike = 'DISLIKE'")
                        .bind(0, userID)
                        .mapTo(String.class)
                        .list());
    }

    // Returns list of userIDs that liked user
    // If none, returns empty list
    @Override
    public List<String> getLikedBy(String userID) {
        return this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT from_userID FROM likes_dislikes WHERE to_userID = ? AND like_dislike = 'LIKE'")
                        .bind(0, userID)
                        .mapTo(String.class)
                        .list());
    }

    // Returns list of userIDs that matched with user (users liked each other)
    // If none, returns empty list
    @Override
    public List<String> getMatches(String userID) {
        return this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT filt.userID FROM (SELECT CASE WHEN m.from_userID= ? THEN m.to_userID " +
                        "WHEN m.to_userID = ? THEN m.from_userID END AS userID FROM messages m) filt WHERE filt.userID " +
                        "IS NOT NULL GROUP BY filt.userID")
                        .bind(0, userID)
                        .mapTo(String.class)
                        .list());
    }

    // Returns whether or not two people matched
    @Override
    public boolean isMatch(String userID, String matchUserID) {
        Optional<String> match = this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT to_userID FROM messages WHERE ((to_userID = ? AND from_userID = ?) OR (from_userID = ? AND to_userID = ?)) " +
                        "AND messageType = 'MATCH'")
                        .bind(0, userID)
                        .bind(1, matchUserID)
                        .bind(2, userID)
                        .bind(3, matchUserID)
                        .mapTo(String.class)
                        .findOne());
        return match.isPresent();
    }
}
