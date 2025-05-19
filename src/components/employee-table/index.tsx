import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { Employee } from "../types";
import "../../App.css";

export default function EmployeeTable() {
	const [employees, setEmployees] = useState<Employee[]>([]);

	useEffect(() => {
		axios
			.get("http://localhost:3000/employees")
			.then((resp) => setEmployees(resp.data));
	}, []);

	function deleteEmployee(id: number) {
		axios
			.delete("http://localhost:3000/employees/" + id)
			.then(() =>
				axios
					.get("http://localhost:3000/employees")
					.then((resp) => setEmployees(resp.data))
			);
	}

	return (
		<div className="relative overflow-x-auto">
			<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
				<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
					<tr>
						<th scope="col" className="px-6 py-3">
							Name
						</th>
						<th scope="col" className="px-1 py-3">
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{employees.map((employee) => {
						return (
							<tr
								key={`employee-${employee.id}`}
								className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
							>
								<th className="px-6 py-4">
									<Link
										to={`/employee/${employee.id}`}
									>{`${employee.firstName} ${employee.lastName}`}</Link>
								</th>
								<td className="px-1 py-4">
									<Link
										to={`/editEmployee/${employee.id}`}
										className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
									>
										Edit
									</Link>
									<a
										onClick={() => {
											if (employee.id) {
												deleteEmployee(employee.id);
											}
										}}
										className="text-white-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
									>
										<i className="bi bi-trash-fill"></i>
									</a>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
