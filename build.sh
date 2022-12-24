#!/usr/bin/env bash
# exit on error
set -o errexit

cd client
npm i --prefix
npm run build --prefix

cd ../server
pip install --upgrade pip
pip install -r requirements.txt