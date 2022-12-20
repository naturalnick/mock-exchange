import requests
import os
from dotenv import load_dotenv

load_dotenv()

def get_iex_api_url(symbol):
	iex_base_url = f"https://cloud.iex.cloud/"

	stock_symbol = symbol
	iex_endpoint_path = f"stable/stock/{stock_symbol}/quote"

	iex_token = os.getenv("IEX_TOKEN")
	iex_filter = "symbol, companyName, change, changePercent,latestPrice,high,low,iexAskPrice,iexBidPrice,previousClose,iexOpen,iexClose,week52High,week52Low,isUSMarketOpen"
	iex_query_params = f"?token={iex_token}&filter={iex_filter}"

	return f"{iex_base_url}{iex_endpoint_path}{iex_query_params}"


def get_stock_data(symbol):
	iex_api_call = get_iex_api_url(symbol)

	try:
		response = requests.get(iex_api_call)
		return response.json()
	except:
		print("Request error.")
		return None