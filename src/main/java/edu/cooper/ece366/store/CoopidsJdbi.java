package edu.cooper.ece366.store;

import org.jdbi.v3.core.Jdbi;

public class CoopidsJdbi {

    public static Jdbi create(String jdbcUrl, String user, String pass) {
        Jdbi jdbi = Jdbi.create(jdbcUrl, user, pass);
        String tablesPath = "sql/schema.sql";
        return jdbi;
    }
}
