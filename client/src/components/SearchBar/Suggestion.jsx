import Button from "react-bootstrap/esm/Button";
import "./SearchBar.css";

export default function Suggestion({
	symbol,
	name,
	exchangeShortName,
	handleClick,
}) {
	return (
		<div className="suggestion" onClick={() => handleClick(symbol)}>
			{symbol} - {name} - {exchangeShortName}
			<Button
				variant="primary"
				size="sm"
				id="button"
				className="quote-btn"
				onClick={() => handleClick(symbol)}
			>
				Quote
			</Button>
		</div>
	);
}
