package project.appointment;

public class BookedAppointment {
    String name;
    String email;
    String time;

    public BookedAppointment(){}; 

    public BookedAppointment(String name, String email, String time) {
        setName(name);
        setTime(time);
        setEmail(email);
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEmail() {
        return this.email;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getTime() {
        return this.time;
    }
}
