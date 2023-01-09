import { useEffect, useState, useCallback } from "react";
import Form from "react-bootstrap/Form";
import { getStockData, searchStocks } from "../../utils/API";
import "./SearchBar.css";
import Suggestions from "./Suggestions";

export default function SearchBar({ setStock }) {
	const [input, setInput] = useState("");
	const [suggestions, setSuggestions] = useState([]);
	const [error, setError] = useState("");

	const getSuggestions = useCallback(async (query) => {
		const queriedStocks = await searchStocks(query.toLowerCase());
		if ("error" in queriedStocks) {
			setSuggestions([]);
			setError(queriedStocks.error);
			console.log(queriedStocks);
		} else if (queriedStocks.length > 0) {
			setSuggestions(queriedStocks);
		} else {
			setSuggestions([]);
			setError("No stocks found.");
		}
	}, []);

	useEffect(() => {
		const delayTimer = setTimeout(() => {
			if (input !== "") getSuggestions(input);
			else setSuggestions([]);
		}, 1000);
		return () => clearTimeout(delayTimer);
	}, [input, getSuggestions]);

	function handleKeyDown(e) {
		if (e.key === "Enter") {
		} else {
			setStock({});
		}
	}

	async function handleSuggestionClicked(symbol) {
		const stockData = await getStockData([symbol]);
		if ("error" in stockData) {
			setError(stockData.error);
		} else {
			setStock(stockData);
			setInput("");
		}
		setSuggestions([]);
	}

	return (
		<div className="search-container">
			<Form.Control
				placeholder="Search by Ticker Symbol or Company Name"
				aria-label="Stock Ticker Symbol"
				aria-describedby="stock-ticker"
				type="text"
				value={input || ""}
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={handleKeyDown}
			/>
			<Suggestions
				suggestions={suggestions}
				handleClick={handleSuggestionClicked}
				input={input}
				error={error}
			/>
		</div>
	);
}
