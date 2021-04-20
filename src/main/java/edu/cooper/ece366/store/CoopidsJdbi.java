package edu.cooper.ece366.store;

import java.io.File;
import java.io.FileReader;
import java.io.BufferedReader;
import org.jdbi.v3.core.Jdbi;

public class CoopidsJdbi {

    public static Jdbi create(String jdbcUrl, String user, String pass) {
        return Jdbi.create(jdbcUrl, user, pass);
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

        StringBuilder tot = new StringBuilder();
        try {
            String st;
            while ((st = br.readLine()) != null) {
                tot.append(st);
            }
        } catch (Exception e) {
            System.out.println(e);
            return;
        }
        String[] sqlCommands = tot.toString().replace("   ", "").split(";");

        for (String s : sqlCommands) {
            jdbi.useHandle(handle -> handle.execute(s));
        }
    }
}
