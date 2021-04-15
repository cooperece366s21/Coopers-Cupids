package edu.cooper.ece366.store;

import org.jdbi.v3.core.Handle;
import org.jdbi.v3.core.Jdbi;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;

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
        String[] sqlCommands = tot.replace("    ", "").split(";");

        Handle handle = jdbi.open();

        for (String s : sqlCommands) {
            handle.execute(s);
        }

        return;
    }
}
