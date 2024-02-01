package project.appointment;

import java.util.Date;
import java.util.Map;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
@RequestMapping("/api")
public class AppointmentApplication {
	public static void main(String[] args) {
		SpringApplication.run(AppointmentApplication.class, args);

		Database.setDatabase("jdbc:postgresql://localhost:5432/postgres", "postgres", "password");
	}

	@GetMapping(value="/getAvailableTimes", produces = MediaType.APPLICATION_JSON_VALUE)
	public ArrayList<String> getAvailableTimes(@RequestParam(value = "date") String date) {
		try {
			ResultSet result = Database.query("SELECT * FROM schedule WHERE date = " + date + " AND time_confirmed IS NULL");
			ArrayList<String> results = new ArrayList<String>();
			while(result.next()) {
				results.add(result.getString("appointment_time"));
			}
			return results;
		} catch (SQLException e) {
			System.out.println(date);
			return null;
		}
	}

	@GetMapping(value="/getBookedTimes", produces = MediaType.APPLICATION_JSON_VALUE)
	public ArrayList<BookedAppointment> getBookedTimes(@RequestParam(value = "date") String date) {
		try {
			ResultSet result = Database.query("SELECT * FROM schedule WHERE date = " + date + " AND time_confirmed IS NOT NULL");
			ArrayList<BookedAppointment> results = new ArrayList<BookedAppointment>();
			while(result.next()) {
				String time = result.getString("appointment_time");
				String name = result.getString("name");
				String email = result.getString("email");
				results.add(new BookedAppointment(name, email, time));
			}
			return results;
		} catch (SQLException e) {
			System.out.println(date);
			return null;
		}
	}

	@PostMapping(value="/createAvailableTime", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> createAvailableTime(@RequestBody Map<String, Object> requestBody) {
		String date = (String) requestBody.get("date");
		String time = (String) requestBody.get("time");

		Date currentDate = new Date();
        Timestamp timestamp = new Timestamp(currentDate.getTime());
		try {
			Database.update("INSERT INTO schedule (name, email, time_created, date, time_confirmed, appointment_time) VALUES ('name', 'email@email', '"+timestamp+"', '"+date+"', NULL, '"+time+"')");
		} catch (SQLException e) {
			return new ResponseEntity<>("Error message" , HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>("Appointment created successfully", HttpStatus.CREATED);
	}

	@PostMapping(value="/bookAppointment", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> bookAppointment(@RequestBody Map<String, Object> requestBody) {
		String date = (String) requestBody.get("date");
		String time = (String) requestBody.get("time");
		String name = (String) requestBody.get("name");
		String email = (String) requestBody.get("email");

		Date currentDate = new Date();
        Timestamp timestamp = new Timestamp(currentDate.getTime());
		try {
			Database.update("UPDATE schedule set time_confirmed='"+timestamp+"', name='"+name+"', email='"+email+"' WHERE date='"+date+"' AND appointment_time='"+time+"';");
		} catch (SQLException e) {
			System.out.println("ERROR");
			return new ResponseEntity<>("Error message" , HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>("Appointment created successfully", HttpStatus.CREATED);
	}
}
