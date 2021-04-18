package edu.cooper.ece366.store;

import java.io.File;
import java.io.FileReader;
import java.io.BufferedReader;
import org.jdbi.v3.core.Jdbi;

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
}
