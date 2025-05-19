import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import type { Dependent, Employee } from "../types";
import "../../App.css";

export default function Employee() {
	const params = useParams();
	const [employee, setEmployee] = useState<Employee>({
		firstName: "",
		lastName: "",
	});

	useEffect(() => {
		axios
			.get("http://localhost:3000/employees?id=" + params.id)
			.then((resp) => {
				setEmployee(resp.data[0]);
			});
	}, [params.id]);

	return (
		<>
			<h1>
				{employee?.firstName} {employee?.lastName}
			</h1>

			{employee.annualCost && (
				<p className="mb-8">
					Your benefits package costs ${employee?.annualCost} annually, which
					amounts to ${Number(employee?.annualCost / 26).toPrecision(4)} per pay
					period.
				</p>
			)}

			<Link
				to={`/editEmployee/${employee?.id}`}
				className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
			>
				Update Employee Data
			</Link>

			{employee.dependents && employee.dependents.length > 0 && (
				<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-8 mb-4">
					<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
						<tr>
							<th scope="col" className="px-6 py-3">
								Name
							</th>
							<th scope="col" className="px-6 py-3">
								Relationship
							</th>
						</tr>
					</thead>
					<tbody>
						{employee.dependents.map((d: Dependent, index) => {
							return (
								<tr
									key={`dependent-${index}`}
									className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
								>
									<th className="px-6 py-4">
										{d.firstName} {d.lastName}
									</th>
									<td className="px-6 py-4">{d.relationship}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			)}

			<Link to="/">Return to Home</Link>
		</>
	);
}
