import "./Holdings.css";

export default function HoldingRow({
	id,
	symbol,
	companyName,
	quantity,
	marketValue,
	base_cost,
}) {
	const marketValueTotal = (marketValue * quantity).toFixed(2);
	const baseCostTotal = (base_cost * quantity).toFixed(2);
	const gainLoss = Number((marketValueTotal - baseCostTotal).toFixed(2));

	const gainLossStyle = gainLoss < 0 ? { color: "red" } : { color: "green" };
	const gainLossPrefix = gainLoss > 0 ? "+$" : "-$";
	return (
		<tr key={id}>
			<td>{symbol}</td>
			<td>{companyName}</td>
			<td>{quantity}</td>
			<td>${marketValueTotal}</td>
			<td>${baseCostTotal}</td>
			<td style={gainLossStyle}>
				{gainLossPrefix}
				{gainLoss}
			</td>
		</tr>
	);
}
