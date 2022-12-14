import requests
import os
from dotenv import load_dotenv

load_dotenv()

def get_iex_api_url(symbol):
	iex_base_url = f"https://cloud.iex.cloud/"

	stock_symbol = symbol
	iex_endpoint_path = f"stable/stock/{stock_symbol}/quote"

	iex_token = os.getenv("IEX_TOKEN")
	iex_query_params = f"?token={iex_token}"

	return f"{iex_base_url}{iex_endpoint_path}{iex_query_params}"


def get_stock_data(symbol):

	iex_api_call = get_iex_api_url(symbol)

	try:
		response = requests.get(iex_api_call)
	except:
		print("Request error.")
		return None

	data = response.json()
	# if we need more data from iex
	#print(data)

	return {
		"symbol": symbol,
		"companyName": data["companyName"],
		"change": data["change"],
		"changePercent": data["changePercent"],
		"askPrice": data["iexAskPrice"],
		"bidPrice": data["iexBidPrice"],
		"previousClose": data["previousClose"],
		"openPrice": data["iexOpen"],
		"closePrice": data["iexClose"],
		"week52High": data["week52High"],
		"week52Low": data["week52Low"],
		"isUSMarketOpen": data["isUSMarketOpen"],
	}