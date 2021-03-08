package edu.cooper.ece366.store;

import java.util.List;

public interface MatchStore {
    // Updates all lists to reflect like
    void addLike(String userID, String likedUserID);

    void removeLike(String userID, String likedUserID);

    // Updates all lists to reflect dislike
    void addDislike(String userID, String dislikedUserID);

    void removeDislike(String userID, String dislikedUserID);

    // Returns list of userIDs that user has liked
    List<String> getLikes(String userID);

    // Returns list of userIDs that user has disliked
    List<String> getDislikes(String userID);

    // Returns list of userIDs that liked user
    List<String> getLikedBy(String userID);

    // Returns list of userIDs that matched with user (users liked each other)
    List<String> getMatches(String userID);
}
