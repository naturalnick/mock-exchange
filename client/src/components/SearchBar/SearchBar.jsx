import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

export default function SearchBar() {
	return (
		<>
			<InputGroup className="mb-3">
				<Form.Control
					placeholder="Stock Symbol eg. AAPL"
					aria-label="Stock Ticker Symbol"
					aria-describedby="stock-ticker"
				/>
				<Button variant="primary" id="button">
					Button
				</Button>
			</InputGroup>
		</>
	);
}
