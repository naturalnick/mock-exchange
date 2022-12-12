import Summary from "../../components/Stats/Summary";
import Holdings from "../../components/Holdings/Holdings";

export default function Dashboard() {
	return (
		<div>
			<h2>Dashboard</h2>
			<h3>Account Summary</h3>
			<Summary />
			<h3>Holdings</h3>
			<Holdings />
		</div>
	);
}
