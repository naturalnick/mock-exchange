import requests
import os
from dotenv import load_dotenv

load_dotenv()

finnhub_token = os.getenv("FINNHUB_TOKEN")

def get_stock_data(symbol):
	try:
		res1 = requests.get(f"https://finnhub.io/api/v1/stock/profile2?symbol={symbol}&token={finnhub_token}")
		data1 = res1.json()
		company_name = {"companyName": data1["name"]}
		res2 = requests.get(f"https://finnhub.io/api/v1/quote?symbol={symbol}&token={finnhub_token}")
		data2 = res2.json()
		stock_data = {"symbol": symbol, "latestPrice": data2["c"], "change": data2["d"], "changePercent": data2["dp"], "high": data2["h"], "low": data2["l"], "open": data2["o"], "previousClose": data2["pc"] }
		return {**company_name, **stock_data}
	except:
		print("Request error.")
		return None


def get_stock_list():
	stock_ref_url = "https://cloud.iexapis.com/beta/ref-data/symbols?token="
	response = requests.get(f"{stock_ref_url}{iex_token}")
	data = response.json()
	stock_list = []
	for item in data:
		stock_list.append({"symbol": item["symbol"], "company_name": item["name"]})
	return stock_list