import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import type { Dependent, Employee } from "../types";
import "../../App.css";

export default function EmployeeForm() {
	const navigate = useNavigate();
	const params = useParams();

	const initialEmployee: Employee = {
		firstName: "",
		lastName: "",
	};
	const initialDependent: Dependent = {
		firstName: "",
		lastName: "",
		relationship: "",
		annualCost: 500,
	};
	const [employee, setEmployee] = useState<Employee>(initialEmployee);
	const [activeDependent, setActiveDependent] =
		useState<Dependent>(initialDependent);
	const [dependents, setDependents] = useState<Dependent[]>([]);
	const [dependentIndex, setDependentIndex] = useState<number | null>(null);
	const [totalAnnualCost, setTotalAnnualCost] = useState(1000);
	const [dependentsToggle, setDependentsToggle] = useState(false);

	useEffect(() => {
		axios
			.get("http://localhost:3000/employees?id=" + params.id)
			.then((resp) => {
				setEmployee(resp.data[0]);
				setDependents(resp.data[0].dependents);
				setDependentsToggle(resp.data[0].dependents.length > 0);
			});
	}, [params.id]);

	const calculateAnnualCost = useCallback(() => {
		let dependentCost = 0;
		dependents.forEach((d) => {
			if (d.annualCost) {
				dependentCost += d.annualCost;
			}
		});

		const applyDiscount = employee.firstName.toLowerCase().startsWith("a");
		const employeeCost = applyDiscount ? 900 : 1000;

		setTotalAnnualCost(dependentCost + employeeCost);
	}, [dependents, employee]);

	useEffect(() => {
		if (dependents.length > 0) {
			calculateAnnualCost();
		}
	}, [dependents, calculateAnnualCost]);

	function handleSubmit(e: React.SyntheticEvent) {
		e.preventDefault();

		const updateEmployee = {
			firstName: employee.firstName,
			lastName: employee.lastName,
			annualCost: totalAnnualCost,
			dependents: dependents,
		};

		if (params.id) {
			axios
				.put(`http://localhost:3000/employees/${params.id}`, {
					...updateEmployee,
					id: params.id,
				})
				.then((resp) => {
					if (resp.status == 200) {
						navigate("/employee/" + params.id);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			axios
				.post("http://localhost:3000/employees", updateEmployee)
				.then((resp) => {
					if (resp.status == 201) {
						console.log(resp.data);
						navigate("/employee/" + resp.data[0].id);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		e.preventDefault();

		const field = e.target.name;
		const newEmployee = { ...employee, [field]: e.target.value };

		setEmployee(newEmployee);
	};

	const toggleDependents = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (dependentsToggle) {
			setActiveDependent(initialDependent);
		} else {
			setDependents([]);
			setTotalAnnualCost(1000);
		}

		setDependentsToggle(e.target.checked);
	};

	function addDependent(dependent: Dependent) {
		const applyDiscount = dependent.firstName.toLowerCase().startsWith("a");

		if (applyDiscount) {
			dependent.annualCost = 450;
		} else {
			dependent.annualCost = 500;
		}

		if (activeDependent && dependentIndex != null) {
			setDependents((d) => {
				const newArr = [...d];
				newArr[dependentIndex] = activeDependent;

				return newArr;
			});
		} else {
			setDependents((prevState) => {
				return [...prevState, activeDependent];
			});
		}

		setActiveDependent(initialDependent);
		setDependentIndex(null);
	}

	const handleDependentChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		e.preventDefault();

		const field = e.target.name;
		const dependent = { ...activeDependent, [field]: e.target.value };

		setActiveDependent(dependent);
	};

	return (
		<>
			<h2>{params.id ? "Edit" : "Add"} Employee</h2>
			<form onSubmit={handleSubmit}>
				<div className="grid gap-6 mb-6 md:grid-cols-1">
					<label className="block text-sm font-medium text-gray-900 dark:text-white">
						First Name
						<input
							name="firstName"
							value={employee?.firstName}
							onChange={handleChange}
							onBlur={calculateAnnualCost}
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2"
						/>
					</label>
					<label className="block text-sm font-medium text-gray-900 dark:text-white">
						Last Name
						<input
							name="lastName"
							value={employee?.lastName}
							onChange={handleChange}
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2"
						/>
					</label>
					<label className="inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							id="addDependents"
							onChange={toggleDependents}
							className="sr-only peer"
							checked={dependentsToggle}
						/>
						<div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
						<span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
							Add Dependents
						</span>
					</label>

					{dependentsToggle && (
						<div>
							<label className="block mb-2.5 text-sm font-medium text-gray-900 dark:text-white">
								First Name
								<input
									id={`dependent-firstName`}
									name="firstName"
									value={activeDependent?.firstName}
									onChange={handleDependentChange}
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2"
								/>
							</label>
							<label className="block mb-2.5 text-sm font-medium text-gray-900 dark:text-white">
								Last Name
								<input
									id={`dependent-lastName`}
									name="lastName"
									value={activeDependent?.lastName}
									onChange={handleDependentChange}
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2"
								/>
							</label>
							<select
								id={`dependent-relationship`}
								name="relationship"
								value={activeDependent?.relationship}
								onChange={handleDependentChange}
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-8"
							>
								<option value="">Select Relationship</option>
								<option value="Spouse">Spouse</option>
								<option value="Child">Child</option>
							</select>

							<button
								type="button"
								onClick={() => {
									addDependent(activeDependent);
								}}
								className="addButton"
							>
								Add
							</button>
						</div>
					)}

					{dependentsToggle && dependents.length > 0 && (
						<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
							<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
								<tr>
									<th scope="col" className="px-6 py-3">
										Name
									</th>
									<th scope="col" className="px-6 py-3">
										Relationship
									</th>
									<th scope="col" className="px-6 py-3"></th>
								</tr>
							</thead>
							<tbody>
								{dependents.map((d, index) => {
									return (
										<tr
											key={`dependent-${index}`}
											className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
										>
											<th className="px-6 py-4">
												{d.firstName} {d.lastName}
											</th>
											<td className="px-6 py-4">{d.relationship}</td>
											<td className="px-6 py-4">
												<a
													onClick={() => {
														setActiveDependent(d);
														setDependentIndex(index);
													}}
													className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
												>
													Edit
												</a>
												<a
													onClick={() => {
														setDependents(() => {
															const newArr = [...dependents];
															newArr.splice(index, 1);
															return newArr;
														});
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
					)}

					<p>
						Your benefits package costs ${totalAnnualCost} annually, which
						amounts to ${Number(totalAnnualCost / 26).toPrecision(4)} per pay
						period.
					</p>

					<button type="submit">Save</button>
					<Link to="/">Cancel</Link>
				</div>
			</form>
		</>
	);
}
