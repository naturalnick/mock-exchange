from flask import Blueprint, request
from database import (
    check_email_exists,
    get_account,
    create_account,
    get_account_holdings,
    get_account_daily_totals,
    modify_holdings,
    adjust_balance,
    log_transaction,
    get_account_transactions,
    update_watchlist,
    check_credentials,
)
from helpers import decode_token, generate_token
import api

blueprint = Blueprint(
    "blueprint", __name__, static_folder="../client/build", static_url_path=""
)


@blueprint.route("/")
def index():
    return blueprint.send_static_file("index.html"), 200


@blueprint.errorhandler(404)
def not_found(e):
    return blueprint.send_static_file("index.html"), 200


@blueprint.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]

    if check_email_exists(email) is False:
        return {"error": "Account does not exist for that email."}, 404

    if check_credentials(email, password) is False:
        return {"error": "Incorrect password."}, 401

    return {"token": generate_token(email)}, 200


@blueprint.route("/register", methods=["POST"])
def register_user():
    email = request.json["email"]
    password = request.json["password"]

    if check_email_exists(email) is True:
        return {"error": "This email already has an account."}, 403

    create_account(email, password)
    return {"token": generate_token(email)}, 200


@blueprint.route("/api/stock/quote", methods=["GET"])
def get_stock():
    symbols_string = request.args.get("symbols")
    symbol_array = symbols_string.split(",")
    data = api.get_stock_data(symbol_array)

    if data is not None:
        return data, 200
    return {"error": "Stock not found."}, 404


@blueprint.route("/api/stock/search", methods=["GET"])
def search_stocks():
    query = request.args.get("query")
    stocks = api.search_stocks(query)
    if stocks is not None:
        return stocks, 200
    return {"error": "Stock not found."}, 404


@blueprint.route("/api/account/info", methods=["GET"])
def account_info():
    token = request.headers.get("Authorization").replace("token ", "")
    email = decode_token(token)["email"]
    if token is None:
        return {"error": "invalid token"}, 401

    account = get_account(email)

    return {
        "account_number": account.id,
        "balance": account.balance,
        "watch_list": account.watch_list,
    }, 200


@blueprint.route("/api/account/watchlist", methods=["POST"])
def account_watchlist():
    token = request.headers.get("Authorization").replace("token ", "")
    email = decode_token(token)["email"]

    if email is None:
        return {"error": "invalid token"}, 401

    data = request.json

    update_watchlist(email, data["symbol"])

    return {}, 200


@blueprint.route("/api/account/holdings", methods=["GET"])
def account_holdings():
    token = request.headers.get("Authorization").replace("token ", "")
    email = decode_token(token)["email"]

    if decode_token(token) is None:
        return {"error": "invalid token"}, 401

    account = get_account(email)
    holdings = get_account_holdings(account.id)

    return {"holdings": holdings}, 200


@blueprint.route("/api/account/totals", methods=["GET"])
def account_totals():
    token = request.headers.get("Authorization").replace("token ", "")
    email = decode_token(token)["email"]

    if decode_token(token) is None:
        return {"Error": "invalid token"}, 401

    account = get_account(email)
    totals = get_account_daily_totals(account.id)

    return {"totals": totals}, 200


@blueprint.route("/api/account/transactions", methods=["GET"])
def account_transactions():
    token = request.headers.get("Authorization").replace("token ", "")
    email = decode_token(token)["email"]

    if decode_token(token) is None:
        return {"Error": "invalid token"}, 401

    account = get_account(email)
    transactions = get_account_transactions(account.id)

    return {"transactions": transactions}, 200


@blueprint.route("/api/trade", methods=["POST"])
def trade():
    token = request.headers.get("Authorization").replace("token ", "")
    email = decode_token(token)["email"]

    if decode_token(token) is None:
        return {"Error": "invalid token"}, 401

    transaction = request.json

    account = get_account(email)
    transaction.update({"account_number": account.id})

    transaction_amount = float(transaction["quantity"]) * float(
        transaction["cost_per_share"]
    )

    modify_holdings(**transaction)
    adjust_balance(account.id, account.balance, transaction_amount)
    log_transaction(**transaction)
    return {}, 200
