import requests
import os
from dotenv import load_dotenv

load_dotenv()

iex_token = os.getenv("IEX_TOKEN")

def get_stock_quote_url(symbol):
	iex_base_url = f"https://cloud.iex.cloud/"

	stock_symbol = symbol
	iex_endpoint_path = f"stable/stock/{stock_symbol}/quote"

	iex_filter = "symbol, companyName, change, changePercent,latestPrice,iexAskPrice,iexBidPrice,previousClose,iexOpen,iexClose,week52High,week52Low,isUSMarketOpen"
	iex_query_params = f"?token={iex_token}&filter={iex_filter}"

	return f"{iex_base_url}{iex_endpoint_path}{iex_query_params}"


def get_stock_data(symbol):
	try:
		iex_api_call = get_stock_quote_url(symbol)
		response = requests.get(iex_api_call)
		return response.json()
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