import Form from "react-bootstrap/Form";

export default function TradeActionSelect({ action, handleChange }) {
	return (
		<Form.Group className="mb-3" controlId="action">
			<Form.Label>Action</Form.Label>
			<Form.Select
				onChange={(e) => handleChange("action")(e.target.value)}
				value={action}
				aria-label="select-action"
			>
				<option>Select...</option>
				<option value="buy">Buy</option>
				<option value="sell">Sell</option>
			</Form.Select>
		</Form.Group>
	);
}
