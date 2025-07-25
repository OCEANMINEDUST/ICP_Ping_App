#!/bin/bash

# Deploy to Internet Computer
# This script would be used to deploy the Motoko backend and frontend

echo "Starting deployment to Internet Computer..."

# Start local replica (for testing)
dfx start --background --clean

# Deploy the backend canister
echo "Deploying backend canister..."
dfx deploy google_docs_manager

# Build frontend
echo "Building frontend..."
npm run build

# Deploy frontend assets
echo "Deploying frontend..."
dfx deploy google_docs_frontend

# Get canister URLs
echo "Deployment complete!"
echo "Backend canister: $(dfx canister id google_docs_manager)"
echo "Frontend URL: $(dfx canister call google_docs_frontend http_request)"

# For mainnet deployment, use:
# dfx deploy --network ic
