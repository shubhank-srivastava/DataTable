import request from "../utils/request";
import mock from "./mock";
const BASE_URL = "https://my-json-server.typicode.com/darshanp40/employeedb";

class EmployeeService {
  static async get() {
    try {
      let emp = await request(`${BASE_URL}/employees`);
      emp = emp[0];
      return [...emp, ...mock];
    } catch (err) {
      return [];
    }
  }

  static async read(id) {
    try {
      await request(`${BASE_URL}/employees/${id}`, { method: "GET" });
      return;
    } catch (err) {
      return err;
    }
  }

  static async delete(id) {
    try {
      await request(`${BASE_URL}/employees/${id}`, { method: "DELETE" });
      return;
    } catch (err) {
      return err;
    }
  }

  static async create(employee) {
    try {
      await request(`${BASE_URL}/employees/${employee.id}`, {
        method: "POST",
        data: employee
      });
      return;
    } catch (err) {
      return err;
    }
  }

  static async update(employee) {
    try {
      await request(`${BASE_URL}/employees/${employee.id}`, {
        method: "PUT",
        data: employee
      });
      return;
    } catch (err) {
      return err;
    }
  }
}

export default EmployeeService;
