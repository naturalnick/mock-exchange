import { useEffect, useState, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { getStockData, getStockList } from "../../utils/API";
import Suggestion from "./Suggestion";
import "./SearchBar.css";

export default function SearchBar({ setStock }) {
	const [input, setInput] = useState("");
	const [stockList, setStocklist] = useState([]);
	const [suggestions, setSuggestions] = useState([]);
	const [isSearching, setIsSearching] = useState(false);
	const [error, setError] = useState("");

	const getSuggestions = useCallback(() => {
		const query = input.toLowerCase();
		const filteredStocks = stockList.filter((stock) => {
			return (
				stock.symbol.toLowerCase().includes(query) ||
				stock.company_name.toLowerCase().includes(query)
			);
		});
		if (filteredStocks.length > 0) {
			setSuggestions(filteredStocks);
		} else {
			setError("No stocks found.");
		}
	}, [input, stockList]);

	useEffect(() => {
		loadStocklist();

		async function loadStocklist() {
			const response = await getStockList();
			setStocklist(response);
		}
	}, []);

	useEffect(() => {
		if (input !== "") getSuggestions();
	}, [input, getSuggestions]);

	function handleKeyDown(e) {
		if (e.key === "Enter") {
			handleSearch(input);
		} else {
			setIsSearching(true);
			setStock({});
		}
	}

	async function handleSearch(symbol) {
		const stockData = await getStockData(symbol);

		if ("error" in stockData) {
			setError(stockData.error);
		} else {
			setStock(stockData);
			setIsSearching(false);
		}
	}

	function displaySuggestions() {
		return suggestions.length > 0 ? (
			suggestions.map((suggestion) => {
				return (
					<Suggestion
						key={suggestion.id}
						{...suggestion}
						handleClick={handleSuggestion}
					/>
				);
			})
		) : (
			<>{error}</>
		);
	}

	function handleSuggestion(symbol) {
		setInput(symbol);
		handleSearch(symbol);
		setSuggestions([]);
	}

	return (
		<div className="search-container">
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
					Search
				</Button>
			</InputGroup>
			{isSearching && (
				<div className="suggestions">{displaySuggestions()}</div>
			)}
		</div>
	);
}
