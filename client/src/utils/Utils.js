const dollar = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
});

export function formatPrice(num) {
	return dollar.format(Number(num));
}

export function formatDecoratedPrice(num) {
	let newNum = Number(num).toFixed(2);

	let priceStyle = { color: "black" };
	let prefix = "";
	if (Number(num) > 0) {
		priceStyle = { color: "green" };
		prefix = "+";
	}
	if (Number(num) < 0) {
		priceStyle = { color: "red" };
		prefix = "-";
		newNum = newNum.slice(1);
	}
	newNum = dollar.format(newNum);
	return (
		<span style={priceStyle}>
			{prefix}
			{newNum}
		</span>
	);
}

export function formatPercentage(num) {
	let newNum = Number(num).toFixed(2);

	let percentStyle = { color: "black" };
	let prefix = "";
	if (Number(num) > 0) {
		percentStyle = { color: "green" };
		prefix = "+";
	}
	if (Number(num) < 0) {
		percentStyle = { color: "red" };
		prefix = "-";
		newNum = newNum.slice(1);
	}
	return (
		<span style={percentStyle}>
			{prefix}
			{newNum}%
		</span>
	);
}

export function formatDate(date) {
	const newDate = new Date(date);

	return newDate.toLocaleString("en-US", {
		hour12: "true",
		dateStyle: "medium",
	});
}
