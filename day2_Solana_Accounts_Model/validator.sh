#!/bin/bash

# Simple automation for Solana test validator

case "$1" in

# For starting the Solana-Test-Validator
start)
echo "Starting Solana Test Validator"
solana-test-validator --reset --quiet &
sleep 5
solana config set --url http://127.0.0.1:8899
echo "Validator running on localhost:8899"
;;

# For stopping the Solana-Test-Validator
stop)
echo "Stopping solana test validator"
pkill -f solana-test-validator
echo "Validator stopped!!!!"
;;

# For displaying the logs
logs)
echo "Show latest validator logs: "
pgrep -af solana-test-validator
;;

*)
echo "Usage: ./validator.sh {start|stop|logs}"
;;

esac
