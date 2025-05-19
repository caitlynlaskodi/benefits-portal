import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import App from "./App.tsx";
import Employee from "./components/employee/index.tsx";
import EmployeeForm from "./components/employee-form/index.tsx";

createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<App />} />
			<Route path="/employee/:id" element={<Employee />} />
			<Route path="/addEmployee" element={<EmployeeForm />} />
			<Route path="/editEmployee/:id" element={<EmployeeForm />} />
		</Routes>
	</BrowserRouter>
);
