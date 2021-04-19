package edu.cooper.ece366.store;

import java.io.File;
import java.io.FileReader;
import java.io.BufferedReader;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import edu.cooper.ece366.model.Message;
import edu.cooper.ece366.model.User;
import org.jdbi.v3.core.Jdbi;
import org.jdbi.v3.core.mapper.RowMapper;
import org.jdbi.v3.core.statement.StatementContext;

import edu.cooper.ece366.model.Conversation;

public class CoopidsJdbi {

    public static Jdbi create(String jdbcUrl, String user, String pass) {
        Jdbi jdbi = Jdbi.create(jdbcUrl, user, pass);
        return jdbi;
    }

    public static void setupSchema(Jdbi jdbi, String sqlFilePath) {
        File schemaFile = new File(sqlFilePath);

        BufferedReader br;
        try {
            br = new BufferedReader(new FileReader(schemaFile));
        } catch (Exception e) {
            System.out.println(e);
            return;
        }

        String tot = "";
        try {
            String st;
            while ((st = br.readLine()) != null) {
                tot += st;
            }
        } catch (Exception e) {
            System.out.println(e);
            return;
        }
        String[] sqlCommands = tot.replace("   ", "").split(";");

        for (String s : sqlCommands) {
            jdbi.useHandle(handle -> handle.execute(s));
        }

        return;
    }

    public static class MesListRowMapper implements RowMapper<List<Message>> {
        @Override
        public List<Message> map(final ResultSet rs, final StatementContext ctx) throws SQLException {
            return null;
        }
    }

    public static class ConvoListRowMapper implements RowMapper<List<Conversation>> {
        @Override
        public List<Conversation> map(final ResultSet rs, final StatementContext ctx) throws SQLException {
            return null;
        }
    }
}
