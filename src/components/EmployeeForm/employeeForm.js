import { getISODate } from "../../utils/date";
import "./employeeForm.css";

class EmployeeForm {
  constructor(employee) {
    this.employee = employee;
  }

  render() {
    let form = document.createElement("form");
    form.name = "employee-form";
    form.innerHTML = this.createForm();
    return form;
  }

  createForm() {
    let date = "";
    if (this.employee.dob) {
      date = getISODate(this.employee.dob);
    }
    return `
        <div class="emp-form-field">
          <h4>First Name</h4>
          <h4><input type="text" name="firstName" value="${this.employee.firstName}"/></h4>
        </div>
        <div class="emp-form-field">
          <h4>Last Name</h4>
          <h4><input type="text" name="lastName" value="${this.employee.lastName}"/></h4>
        </div>
        <div class="emp-form-field">
          <h4>Employee Code</h4>
          <h4><input type="text" name="employeeCode" value="${this.employee.employeeCode}"/></h4>
        </div>
        <div class="emp-form-field">
          <h4>Job Title</h4>
          <h4><input type="text" name="jobTitleName" value="${this.employee.jobTitleName}"/></h4>
        </div>
        <div class="emp-form-field">
          <h4>Phone Number</h4>
          <h4><input type="text" name="phoneNumber" value="${this.employee.phoneNumber}"/></h4>
        </div>
        <div class="emp-form-field">
          <h4>Email ID</h4>
          <h4><input type="email" name="emailAddress" value="${this.employee.emailAddress}"/></h4>
        </div>
        <div class="emp-form-field">
          <h4>Region</h4>
          <h4><input type="text" name="region" value="${this.employee.region}"/></h4>
        </div>
        <div class="emp-form-field">
          <h4>DOB</h4>
          <h4><input type="date" name="dob" value="${date}"/></h4>
        </div>
    `;
  }
}

export default EmployeeForm;
