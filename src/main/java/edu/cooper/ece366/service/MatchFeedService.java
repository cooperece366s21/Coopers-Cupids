package edu.cooper.ece366.service;

import edu.cooper.ece366.model.User;

import java.util.List;

public interface MatchFeedService {
    // Returns feed for current user
    List<User> getUserFeed(String userID);
}
