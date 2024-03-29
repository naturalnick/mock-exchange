from cryptography.fernet import Fernet
from models import db, Account, Holdings, Transactions, DailyTotals
from helpers import generate_account_id, get_account_market_value
from datetime import datetime, date
import pytz
import os

password_key = os.getenv("PASSWORD_KEY").encode("utf-8")
fernet = Fernet(password_key)


def update_watchlist(email, symbol):
    account = db.session.query(Account).filter(Account.email == email).first()
    watch_list = account.watch_list

    watch_list = [] if watch_list == [""] else watch_list.split(",")

    if symbol in watch_list:
        watch_list.remove(symbol)
    else:
        watch_list.append(symbol)
        watch_list.sort()

    new_watch_list = "" if watch_list == [] else ",".join(watch_list)

    if new_watch_list != "" and new_watch_list[0] == ",":
        new_watch_list = new_watch_list[1:]

    db.session.query(Account).filter(Account.email == email).update(
        {"watch_list": new_watch_list}
    )
    db.session.commit()


def adjust_balance(account_number, balance, amount):
    db.session.query(Account).filter(Account.id == account_number).update(
        {"balance": balance - amount}
    )
    db.session.commit()


def modify_holdings(account_number, symbol, quantity, cost_per_share):
    result = (
        db.session.query(Holdings)
        .filter(Holdings.account_number == account_number, Holdings.symbol == symbol)
        .all()
    )
    if len(result) > 0:
        holding = result[0]
        new_quantity = holding.shares + float(quantity)

        if int(quantity) > 0:
            new_price = (holding.base_cost + cost_per_share) / 2
        else:
            new_price = holding.base_cost

        db.session.query(Holdings).filter(
            Holdings.account_number == account_number, Holdings.symbol == symbol
        ).update({"shares": new_quantity, "base_cost": new_price})

    else:
        new_holding = Holdings(
            account_number=account_number,
            symbol=symbol,
            shares=quantity,
            base_cost=cost_per_share,
        )
        db.session.add(new_holding)

    db.session.commit()


def log_transaction(account_number, symbol, quantity, cost_per_share):
    date = datetime.now().astimezone(pytz.utc)
    newTransaction = Transactions(
        account_number=account_number,
        date=date,
        symbol=symbol,
        shares=quantity,
        price=cost_per_share,
    )
    db.session.add(newTransaction)
    db.session.commit()


def create_account(email, password):
    while True:
        account_id = generate_account_id()
        if check_account_number_exists(account_id) == False:
            break

    encrypted_pass = fernet.encrypt(password.encode()).decode()

    starting_balance = 100000

    newAccount = Account(
        id=account_id,
        email=email,
        password=encrypted_pass,
        balance=starting_balance,
        watch_list="",
    )
    db.session.add(newAccount)

    new_total = DailyTotals(
        account_number=account_id, date=str(date.today()), value=starting_balance
    )
    db.session.add(new_total)

    db.session.commit()


def check_credentials(email, password):
    account = get_account(email)
    decrypted_pass = fernet.decrypt(account.password.encode("utf-8")).decode()
    return True if password == decrypted_pass else False


def check_email_exists(email):
    account = db.session.query(Account).filter(Account.email == email).first()
    return False if account is None else True


def get_account(email):
    return db.session.query(Account).filter(Account.email == email).first()


def check_account_number_exists(id):
    return False if db.session.get(Account, id) is None else True


def check_daily_total_logged(date):
    query = db.session.query(DailyTotals).filter(DailyTotals.date == date).first()
    return False if query is None else True


def get_account_holdings(account_number):
    query = (
        db.session.query(Holdings)
        .filter(Holdings.account_number == account_number)
        .all()
    )
    if query is None:
        return None
    return [
        {"id": q.id, "symbol": q.symbol, "quantity": q.shares, "base_cost": q.base_cost}
        for q in query
    ]


def get_account_daily_totals(account_number):
    query = (
        db.session.query(DailyTotals)
        .filter(DailyTotals.account_number == account_number)
        .order_by(DailyTotals.date)
        .all()
    )
    if query is None:
        return None
    return [{"date": q.date, "value": q.value} for q in query]


def get_account_transactions(account_number):
    query = (
        db.session.query(Transactions)
        .filter(Transactions.account_number == account_number)
        .all()
    )
    if query is None:
        return None
    return [
        {
            "id": q.id,
            "date": q.date,
            "symbol": q.symbol,
            "quantity": q.shares,
            "price": q.price,
        }
        for q in query
    ]


def set_account_totals(date):
    accounts = db.session.query(Account).all()

    for account in accounts:
        holdings = get_account_holdings(account.id)

        if holdings is None:
            market_value_total = 0
        else:
            market_value_total = get_account_market_value(holdings)

        account_value = round(account.balance + market_value_total, 2)
        new_total = DailyTotals(
            account_number=account.id, date=date, value=account_value
        )
        db.session.add(new_total)

    db.session.commit()
