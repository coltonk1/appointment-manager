package project.appointment;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class Database {
    private static String databaseURL;
    private static String username;
    private static String password;

    private static void setup(String databaseURL, String username, String password) {
        Database.databaseURL = databaseURL;
        Database.username = username;
        Database.password = password;
    }

    public static void setDatabase(String databaseURL, String username, String password) {
        Database.setup(databaseURL, username, password);
    }

    public static ResultSet query(String query) throws SQLException {
        Connection connection = DriverManager.getConnection(databaseURL, username, password);
        
        PreparedStatement preparedStatement = connection.prepareStatement(query);
        ResultSet resultSet = preparedStatement.executeQuery();

        return resultSet;
    }

    public static int update(String query) throws SQLException {
        Connection connection = DriverManager.getConnection(databaseURL, username, password);
        
        PreparedStatement preparedStatement = connection.prepareStatement(query);
        int rows = preparedStatement.executeUpdate();

        return rows;
    }
}
