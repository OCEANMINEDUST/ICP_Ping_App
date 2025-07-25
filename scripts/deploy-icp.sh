#!/bin/bash

# Ping ICP Deployment Script
echo "🚀 Starting Ping deployment to Internet Computer..."

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "❌ DFX CLI not found. Please install it first:"
    echo "sh -ci \"$(curl -fsSL https://sdk.dfinity.org/install.sh)\""
    exit 1
fi

# Start local replica for testing
echo "🔄 Starting local ICP replica..."
dfx start --background --clean

# Deploy backend canister
echo "📦 Deploying Ping backend canister..."
dfx deploy ping_backend

# Get backend canister ID
BACKEND_CANISTER_ID=$(dfx canister id ping_backend)
echo "✅ Backend deployed with ID: $BACKEND_CANISTER_ID"

# Build frontend
echo "🏗️ Building frontend..."
npm run build

# Deploy frontend assets
echo "🌐 Deploying frontend assets..."
dfx deploy ping_frontend

# Get frontend canister ID
FRONTEND_CANISTER_ID=$(dfx canister id ping_frontend)
echo "✅ Frontend deployed with ID: $FRONTEND_CANISTER_ID"

# Initialize with sample data
echo "🌱 Initializing with sample data..."

# Add sample products
dfx canister call ping_backend addProduct '(record {
  id = "p_001";
  name = "Coca-Cola 500ml";
  brand = "Coca-Cola";
  qrCode = "CC500ML001";
  isAuthentic = true;
  rewardAmount = 50;
})'

dfx canister call ping_backend addProduct '(record {
  id = "p_002";
  name = "Pepsi 330ml";
  brand = "PepsiCo";
  qrCode = "PP330ML002";
  isAuthentic = true;
  rewardAmount = 40;
})'

# Add sample recycling points
dfx canister call ping_backend addRecyclingPoint '(record {
  id = "rp_001";
  name = "Mall Center Collection Point";
  address = "123 Main St, Downtown";
  latitude = 40.7128;
  longitude = -74.0060;
  bottlesCollected = 0;
  isActive = true;
})'

dfx canister call ping_backend addRecyclingPoint '(record {
  id = "rp_002";
  name = "University Campus Hub";
  address = "456 College Ave";
  latitude = 40.7589;
  longitude = -73.9851;
  bottlesCollected = 0;
  isActive = true;
})'

echo "✅ Sample data initialized"

# Display deployment information
echo ""
echo "🎉 Ping deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "├── Backend Canister ID: $BACKEND_CANISTER_ID"
echo "├── Frontend Canister ID: $FRONTEND_CANISTER_ID"
echo "├── Local Frontend URL: http://localhost:8000/?canisterId=$FRONTEND_CANISTER_ID"
echo "└── Backend Interface: http://localhost:8000/_/candid?id=$BACKEND_CANISTER_ID"
echo ""
echo "🔧 Next Steps:"
echo "1. Update NEXT_PUBLIC_PING_CANISTER_ID in your .env file"
echo "2. Test the application locally"
echo "3. Deploy to mainnet with: dfx deploy --network ic"
echo ""
echo "📚 Useful Commands:"
echo "├── Check canister status: dfx canister status ping_backend"
echo "├── View logs: dfx canister logs ping_backend"
echo "├── Stop local replica: dfx stop"
echo "└── Upgrade canister: dfx deploy ping_backend --mode upgrade"
