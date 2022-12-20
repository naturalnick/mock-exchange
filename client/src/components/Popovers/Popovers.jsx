import Popover from "react-bootstrap/Popover";

const askPricePopover = (
	<Popover id="ask-price-popover">
		<Popover.Header as="h3">Ask Price</Popover.Header>
		<Popover.Body>
			The lowest price at which a seller will sell the stock at any given
			time.
		</Popover.Body>
	</Popover>
);

const bidPricePopover = (
	<Popover id="bid-price-popover">
		<Popover.Header>Bid Price</Popover.Header>
		<Popover.Body>
			The highest price a buyer will pay to buy a specified number of shares
			of a stock at any given time.
		</Popover.Body>
	</Popover>
);

export { askPricePopover, bidPricePopover };
