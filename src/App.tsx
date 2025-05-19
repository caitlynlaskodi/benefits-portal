import { Link } from "react-router";
import "./App.css";
import EmployeeTable from "./components/employee-table";

function App() {
	return (
		<>
			<h1>Employee Benefits Portal</h1>
			<div className="mb-6">
				Welcome to the employee benefits portal. Select a name to view the
				benefits package cost per pay period.
			</div>
			<Link
				to="/addEmployee"
				className="relative inline-flex items-center justify-center px-5 py-2.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
			>
				Add Employee
			</Link>
			<div className="card">
				<EmployeeTable />
			</div>
		</>
	);
}

export default App;
