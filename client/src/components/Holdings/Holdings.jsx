import { useCallback } from "react";
import Table from "react-bootstrap/Table";
import { useAccount } from "../../context/AccountProvider";
import HoldingRow from "./HoldingRow";
import "./Holdings.css";

export default function Holdings() {
	const { holdings } = useAccount();

	const displayHoldings = useCallback(() => {
		return holdings.length > 0 ? (
			holdings.map((holding) => {
				return <HoldingRow key={holding.id} {...holding} />;
			})
		) : (
			<tr>
				<td style={{ textAlign: "center" }} colSpan={6}>
					No holdings yet, time to start investing!
				</td>
			</tr>
		);
	}, [holdings]);

	return (
		<>
			<h3>Holdings</h3>
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
				<tbody>{displayHoldings()}</tbody>
			</Table>
		</>
	);
}
