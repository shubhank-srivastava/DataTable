import EmployeeForm from "../components/EmployeeForm/employeeForm";
import EmployeeView from "../components/EmployeeView/employeeView";
import Modal from "../components/Modal/modal";
import EmployeeModel from "../models/Employee";
import DataTable from "../components/DataTable/dataTable";
import Employee from "../services/employee";

let dt;
let state = { employees: [] };

class EmployeeTable {
  static onMount() {
    dt = new DataTable(document.getElementById("data-table"), TableConfig);
    dt.setLoading(true);
    Employee.get().then((emp) => {
      state.employees = emp;
      dt.setData(state.employees);
      dt.render();
      dt.setLoading(false);
      document
        .getElementById("create-employee")
        .addEventListener("click", EmployeeTable.createEmployee);
    });
  }

  static onView(rowData) {
    Employee.read(rowData.id).then(() => {
      let modal = new Modal(document.getElementById("portal"), {
        title: rowData.preferredFullName,
        body: EmployeeView(rowData),
        onOk: () => {
          modal.hide();
        }
      });
      modal.show();
    });
  }

  static onDelete(rowData) {
    dt.setLoading(true);
    Employee.delete(rowData.id).then(() => {
      let index = state.employees.findIndex((e) => e.id === rowData.id);
      state.employees.splice(index, 1);
      dt.setData(state.employees);
      dt.render();
      dt.setLoading(false);
    });
  }

  static onUpdate(rowData) {
    let form = new EmployeeForm(rowData).render();
    let modal = new Modal(document.getElementById("portal"), {
      title: `Update Employee: ${rowData.preferredFullName}`,
      body: form,
      onOk: () => {
        let emp = new EmployeeModel(form.elements, rowData.id);
        Employee.update(emp).then(() => {
          let index = state.employees.findIndex((e) => e.id === rowData.id);
          state.employees[index] = emp;
          dt.setData(state.employees);
          dt.renderRow(rowData.id);
          modal.hide();
        });
      },
      onCancel: () => {
        modal.hide();
      }
    });
    modal.show();
  }

  static createEmployee() {
    let emp = new EmployeeModel({}, state.employees.length + 1);
    let form = new EmployeeForm(emp).render();
    let modal = new Modal(document.getElementById("portal"), {
      title: "Create New Employee",
      body: form,
      onOk: () => {
        dt.setLoading(true);
        let emp = new EmployeeModel(form.elements, state.employees.length + 1);
        Employee.create(emp).then(() => {
          state.employees.push(emp);
          dt.setData(state.employees);
          dt.render();
          dt.setLoading(false);
          modal.hide();
        });
      },
      onCancel: () => {
        modal.hide();
      }
    });
    modal.show();
  }

  static render() {
    return `
      <div class="flex-container space-between justify">
        <h1>Employees</h1>
        <div>
          <button class="btn btn-dark" id="create-employee">Create Employee</button>
        </div>
      </div>
      <div id="data-table"></div>
    `;
  }
}

export default EmployeeTable;

const TableConfig = {
  key: "id",
  columns: [
    {
      title: "ID",
      dataIndex: "id",
      sortable: true,
      sortByType: "number"
    },
    {
      title: "Full Name",
      dataIndex: "preferredFullName",
      sortable: true,
      sortByType: "string",
      searchable: true
    },
    {
      title: "Employee Code",
      dataIndex: "employeeCode"
    },
    {
      title: "Job Title",
      dataIndex: "jobTitleName",
      searchable: true
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber"
    },
    {
      title: "Email ID",
      dataIndex: "emailAddress",
      searchable: true
    },
    {
      title: "Region",
      dataIndex: "region",
      sortByType: "string"
    },
    {
      title: "DOB",
      dataIndex: "dob",
      sortable: true,
      sortByType: "date"
    }
  ],
  pageSizes: [5, 10, 15, 20],
  rowActions: [
    {
      title: "View",
      onClick: EmployeeTable.onView
    },
    {
      title: "Update",
      onClick: EmployeeTable.onUpdate
    },
    {
      title: "Delete",
      onClick: EmployeeTable.onDelete
    }
  ]
};
