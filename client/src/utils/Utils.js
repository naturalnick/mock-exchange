export function formatPrice(number) {
	//trim to 2 decimals
	//convert to number
	//maintain trailing zeros
	//return as number
	return parseFloat(number.toFixed(2));
}

export function formatDate(date) {
	const newDate = new Date(date);

	return newDate.toLocaleString("en-US", {
		hour12: "true",
		dateStyle: "medium",
	});
}
