import Table from "react-bootstrap/Table";
import "./Summary.css";

export default function Summary({ accountNumber, cashBalance }) {
	return (
		<>
			<div>Account Summary</div>
			<Table>
				<thead>
					<tr>
						<th>Account Balance</th>
						<th>Cash Balance</th>
						<th>Market Value</th>
						<th>Base Cost</th>
						<th>Gain/Loss</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th>$99</th>
						<td>${cashBalance}</td>
						<td>$100,000</td>
						<td>$460</td>
						<td>-$2000</td>
					</tr>
				</tbody>
			</Table>
		</>
	);
}
