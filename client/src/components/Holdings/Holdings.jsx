import Table from "react-bootstrap/Table";
import { useAccount } from "../../context/AccountProvider";
import "./Holdings.css";

export default function Holdings() {
	const { holdings } = useAccount();

	const holdingElements =
		holdings.length > 0 ? (
			holdings.map((holding) => {
				const marketValueTotal = (
					holding.marketValue * holding.quantity
				).toFixed(2);
				const baseCostTotal = (
					holding.base_cost * holding.quantity
				).toFixed(2);
				const gainLoss = (baseCostTotal - marketValueTotal).toFixed(2);
				return (
					<tr key={holding.id}>
						<td>{holding.symbol}</td>
						<td>{holding.companyName}</td>
						<td>{holding.quantity}</td>
						<td>{marketValueTotal}</td>
						<td>{baseCostTotal}</td>
						<td>
							{gainLoss > 0 && "+"}
							{gainLoss}
						</td>
					</tr>
				);
			})
		) : (
			<tr>
				<td style={{ textAlign: "center" }} colSpan={6}>
					No holdings yet, time to start investing!
				</td>
			</tr>
		);

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
				<tbody>{holdingElements}</tbody>
			</Table>
		</>
	);
}
