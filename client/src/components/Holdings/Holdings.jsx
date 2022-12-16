import Table from "react-bootstrap/Table";
import "./Holdings.css";

export default function Holdings() {
	return (
		<Table striped hover>
			<thead>
				<tr>
					<th>Symbol</th>
					<th>Name</th>
					<th>Quantity</th>
					<th>Market Value</th>
					<th>Base Cost</th>
					<th>Gain/Loss</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>AAPL</td>
					<td>APPLE INC</td>
					<td>20</td>
					<td>$1000</td>
					<td>$900</td>
					<td>+$100</td>
				</tr>
			</tbody>
		</Table>
	);
}
