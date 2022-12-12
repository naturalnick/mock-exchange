import "./Hero.css";

export default function Hero() {
	return (
		<div>
			<h2>Risk-free investing.</h2>
			<p>
				Simulate stock investments with fake money to learn how stocks work
				and experience the ups and downs of the stock market in a risk free
				environment.
			</p>
			<img
				src={require("../../images/hero.png")}
				alt="hero"
				className="hero-img"
			/>
		</div>
	);
}
