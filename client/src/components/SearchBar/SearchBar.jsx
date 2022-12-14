import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

export default function SearchBar({ handleSearch }) {
	const [input, setInput] = useState("");

	function handleKeyDown(e) {
		if (e.key === "Enter") {
			handleSearch(input);
		}
	}

	return (
		<>
			<InputGroup className="mb-3">
				<Form.Control
					placeholder="Stock Symbol eg. AAPL"
					aria-label="Stock Ticker Symbol"
					aria-describedby="stock-ticker"
					type="text"
					value={input || ""}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<Button
					variant="primary"
					id="button"
					onClick={() => handleSearch(input)}
				>
					Button
				</Button>
			</InputGroup>
		</>
	);
}
