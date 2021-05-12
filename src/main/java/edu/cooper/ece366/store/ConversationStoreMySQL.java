package edu.cooper.ece366.store;

import java.util.List;

import org.jdbi.v3.core.Jdbi;

import edu.cooper.ece366.model.Message;

public class ConversationStoreMySQL implements ConversationStore {
    private final Jdbi jdbi;

    public ConversationStoreMySQL(final Jdbi jdbi) { this.jdbi = jdbi; }

    // Returns list of conversations containing user
    @Override
    public List<String> getUserConversations(String userID) {
        return this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT filt.userID " +
                        "FROM (SELECT m.timestamp, CASE WHEN m.from_userID = ? THEN m.to_userID " +
                        "WHEN m.to_userID = ? THEN m.from_userID END AS userID FROM messages m) filt" +
                        " WHERE filt.userID IS NOT NULL GROUP BY filt.userID ORDER BY MAX(filt.timestamp) DESC")
                        .bind(0, userID)
                        .bind(1, userID)
                        .mapTo(String.class)
                        .list());
    }

    // Returns a specific conversation
    @Override
    public List<Message> getUserConversation(String userID, String convoUserID) {
        return this.jdbi.withHandle(handle ->
                handle.createQuery("SELECT * FROM messages WHERE ((from_userID = ? AND to_userID = ?) " +
                        "OR (to_userID = ? AND from_userID = ?)) AND messageType != 'MATCH' ORDER BY timestamp ASC")
                        .bind(0, userID)
                        .bind(1, convoUserID)
                        .bind(2, userID)
                        .bind(3, convoUserID)
                        .map((rs, ctx) ->
                                new Message(rs.getString("from_userID"),
                                        rs.getString("to_userID"),
                                        Message.Message_Type.valueOf(rs.getString("messageType")),
                                        rs.getString("messageText"),
                                        rs.getTimestamp("timestamp")))
                        .list());
    }

    // Adds Conversation
    @Override
    public void sendMessage(Message mes) {
        this.jdbi.useHandle(handle ->
                handle.execute("INSERT INTO messages (from_userID, to_userID, messageType, messageText, timestamp) VALUES (?, ?, ?, ?, ?)",
                        mes.getSender(),
                        mes.getReceiver(),
                        mes.getMessageType().name(),
                        mes.getMessageText(),
                        mes.getTimestamp()));
    }
}
