import "./employeeView.css";

function EmployeeView({
  id,
  jobTitleName,
  firstName,
  lastName,
  preferredFullName,
  employeeCode,
  region,
  dob,
  phoneNumber,
  emailAddress
}) {
  return `
    <div>
      <div class="emp-display-field text-left">
        <h4>Name</h4>
        <h4>${preferredFullName}</h4>
      </div>
      <div class="emp-display-field text-left">
        <h4>Employee Code</h4>
        <h4>${employeeCode}</h4>
      </div>
      <div class="emp-display-field text-left">
        <h4>Job Title</h4>
        <h4>${jobTitleName}</h4>
      </div>
      <div class="emp-display-field text-left">
        <h4>Phone Number</h4>
        <h4>${phoneNumber}</h4>
      </div>
      <div class="emp-display-field text-left">
        <h4>Email ID</h4>
        <h4>${emailAddress}</h4>
      </div>
      <div class="emp-display-field text-left">
        <h4>Region</h4>
        <h4>${region}</h4>
      </div>
      <div class="emp-display-field text-left">
        <h4>DOB</h4>
        <h4>${dob}</h4>
      </div>
    </div>
  `;
}

export default EmployeeView;
