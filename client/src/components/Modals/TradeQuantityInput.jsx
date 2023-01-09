import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

function TradeQuantityInput({
	quantity,
	handleChange,
	touched,
	errors,
	shareHolding,
	setValues,
}) {
	return (
		<Form.Group className="mb-3" controlId="quantity">
			<Form.Label>Quantity</Form.Label>
			<InputGroup>
				<Form.Control
					required
					type="number"
					name="quantity"
					placeholder="Number of shares"
					value={quantity}
					onChange={handleChange}
					isInvalid={touched.quantity && errors.quantity}
				/>
				<Button
					disabled={shareHolding <= 0}
					variant="outline-secondary"
					onClick={() => {
						setValues((prevValues) => ({
							...prevValues,
							quantity: shareHolding,
						}));
						handleChange("action")("sell");
					}}
				>
					Sell All
				</Button>
			</InputGroup>
		</Form.Group>
	);
}

export default TradeQuantityInput;
