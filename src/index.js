import "regenerator-runtime/runtime";

import "./styles.css";
import EmployeeTable from "./pages/EmployeeTable";

document.getElementById("app").innerHTML = EmployeeTable.render();

EmployeeTable.onMount();
