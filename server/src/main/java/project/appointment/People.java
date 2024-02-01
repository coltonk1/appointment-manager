package project.appointment;

public class People {
    private Person[] people;

    public People(Person[] people) {
        setPeople(people);
    }

    public void setPeople(Person[] people) {
        this.people = people;
    }

    public Person[] getPeople() {
        return this.people;
    }
}
