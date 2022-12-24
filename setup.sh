#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Starting app setup... Ctrl-C to exit"

cd server

touch .env

### DATABASE SETUP
echo "Enter your PostgreSQL host (default is localhost)":
read host
host=${host:="localhost"}

echo "Enter your PostgreSQL username (default is postgres)":
read username
username=${username:="postgres"}

while true; do
	echo "Enter your PostgreSQL password:"
	read password
	test "$password" != "" && break
done

echo "Enter your PostgreSQL tablename (default is postgres):"
read tablename
tablename=${tablename:="postgres"}

echo "DB_CONFIG = 'postgresql+psycopg2://$username:$password@$host/$tablename'" >> .env

### SECRET KEY SETUP

while true; do
	echo "Enter your iex Cloud API token:"
	read iex_token
	test "$iex_token" != "" && break
	echo "Your iex Cloud API token cannot be blank"
done

echo "IEX_TOKEN = '$iex_token'" >> .env

flask_secret=$(openssl rand -hex 12)
echo "FLASK_SECRET = '$flask_secret'" >> .env

jwt_secret=$(openssl rand -hex 12)
echo "JWT_SECRET = '$jwt_secret'" >> .env

password_key=$(openssl rand -base64 32)
echo "PASSWORD_KEY = '$password_key'" >> .env

### SERVER VIRTUAL ENVIRONMENT SETUP

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py