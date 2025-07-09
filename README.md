# Employee Benefits Portal

This application provides the ability to view for their employees’ total cost of their healthcare benefits package per paycheck.

Calculation breakdown:
- The cost of benefits is $1000/year for each employee
- Each dependent (children and possibly spouses) incurs a cost of $500/year
- Anyone whose name starts with ‘A’ gets a 10% discount, employee or dependent
Assumptions:
- All employees are paid $2000 per paycheck before deductions.
- There are 26 paychecks in a year.

## Getting Started

### Installation

Run `npm install`

### Executing the program

- Use `npm run dev` to launch the frontend.
- The app uses `json-server` to store data locally. Move `db.json` to a folder outside of the project structure, then run `npx json-server path/to/file/db.json`
