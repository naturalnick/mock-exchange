import Button from "react-bootstrap/esm/Button";

export default function Suggestions({
	suggestions,
	handleClick,
	input,
	error,
}) {
	const Suggestion = (data, handleClick) => (
		<div
			key={data.symbol}
			className="suggestion"
			onClick={() => handleClick(data.symbol)}
		>
			{data.symbol} - {data.name}
			<Button
				variant="primary"
				size="sm"
				className="quote-btn"
				onClick={() => handleClick(data.symbol)}
			>
				Quote
			</Button>
		</div>
	);

	const suggestionList = () => {
		if (suggestions.length > 0) {
			return suggestions.map((suggestion) => {
				return Suggestion(suggestion, handleClick);
			});
		} else if (input !== "" || error) {
			return <>{error}</>;
		}
	};

	return (
		input !== "" && (
			<div className="suggestion-container">{suggestionList()}</div>
		)
	);
}
