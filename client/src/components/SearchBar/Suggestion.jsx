export default function Suggestion({ symbol, company_name, handleClick }) {
	return (
		<p style={{ cursor: "pointer" }} onClick={() => handleClick(symbol)}>
			{symbol} {company_name}
		</p>
	);
}
