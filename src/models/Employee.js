class Employee {
  constructor(emp, id) {
    this.id = id;
    this.jobTitleName = emp.jobTitleName?.value || "";
    this.firstName = emp.firstName?.value || "";
    this.lastName = emp.lastName?.value || "";
    this.preferredFullName = emp.firstName?.value
      ? emp.firstName.value + " " + emp.lastName.value
      : "";
    this.employeeCode = emp.employeeCode?.value || "";
    this.region = emp.region?.value || "";
    if (emp.dob && emp.dob.valueAsNumber) {
      this.dob = new Date(emp.dob.valueAsNumber).toLocaleDateString();
    } else {
      this.dob = "";
    }
    this.phoneNumber = emp.phoneNumber?.value || "";
    this.emailAddress = emp.emailAddress?.value || "";
  }
}

export default Employee;
