import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Int "mo:base/Int";
import Float "mo:base/Float";

actor PingBackend {
    // Types
    public type Product = {
        id: Text;
        name: Text;
        brand: Text;
        qrCode: Text;
        isAuthentic: Bool;
        rewardAmount: Nat;
    };

    public type RecyclingPoint = {
        id: Text;
        name: Text;
        address: Text;
        latitude: Float;
        longitude: Float;
        bottlesCollected: Nat;
        isActive: Bool;
    };

    public type User = {
        id: Text;
        principal: Principal;
        name: Text;
        email: Text;
        totalRewards: Nat;
        bottlesRecycled: Nat;
        joinedAt: Int;
    };

    public type ScanRecord = {
        id: Text;
        userId: Text;
        productId: Text;
        timestamp: Int;
        location: ?{latitude: Float; longitude: Float};
        isValid: Bool;
        rewardEarned: Nat;
    };

    // Storage
    private stable var nextProductId: Nat = 1;
    private stable var nextRecyclingPointId: Nat = 1;
    private stable var nextUserId: Nat = 1;
    private stable var nextScanId: Nat = 1;

    private var products = HashMap.HashMap<Text, Product>(10, Text.equal, Text.hash);
    private var recyclingPoints = HashMap.HashMap<Text, RecyclingPoint>(10, Text.equal, Text.hash);
    private var users = HashMap.HashMap<Text, User>(10, Text.equal, Text.hash);
    private var scanRecords = HashMap.HashMap<Text, ScanRecord>(10, Text.equal, Text.hash);

    // Product Management
    public func addProduct(product: Product) : async Result.Result<Text, Text> {
        products.put(product.id, product);
        #ok("Product added successfully")
    };

    public query func getProduct(id: Text) : async ?Product {
        products.get(id)
    };

    public query func getAllProducts() : async [Product] {
        Array.map<(Text, Product), Product>(products.entries() |> Array.fromIter, func((_, product)) = product)
    };

    // Recycling Point Management
    public func addRecyclingPoint(point: RecyclingPoint) : async Result.Result<Text, Text> {
        recyclingPoints.put(point.id, point);
        #ok("Recycling point added successfully")
    };

    public query func getRecyclingPoint(id: Text) : async ?RecyclingPoint {
        recyclingPoints.get(id)
    };

    public query func getAllRecyclingPoints() : async [RecyclingPoint] {
        Array.map<(Text, RecyclingPoint), RecyclingPoint>(
            recyclingPoints.entries() |> Array.fromIter, 
            func((_, point)) = point
        )
    };

    // User Management
    public func registerUser(name: Text, email: Text) : async Result.Result<User, Text> {
        let userId = "user_" # Int.toText(nextUserId);
        nextUserId += 1;
        
        let user: User = {
            id = userId;
            principal = Principal.fromActor(PingBackend);
            name = name;
            email = email;
            totalRewards = 0;
            bottlesRecycled = 0;
            joinedAt = Time.now();
        };
        
        users.put(userId, user);
        #ok(user)
    };

    public query func getUser(id: Text) : async ?User {
        users.get(id)
    };

    // Scanning and Rewards
    public func scanProduct(userId: Text, qrCode: Text, location: ?{latitude: Float; longitude: Float}) : async Result.Result<ScanRecord, Text> {
        // Find product by QR code
        let productOpt = Array.find<(Text, Product)>(
            products.entries() |> Array.fromIter,
            func((_, product)) = product.qrCode == qrCode
        );

        switch (productOpt) {
            case null { #err("Product not found") };
            case (?(_, product)) {
                let scanId = "scan_" # Int.toText(nextScanId);
                nextScanId += 1;

                let scanRecord: ScanRecord = {
                    id = scanId;
                    userId = userId;
                    productId = product.id;
                    timestamp = Time.now();
                    location = location;
                    isValid = product.isAuthentic;
                    rewardEarned = if (product.isAuthentic) product.rewardAmount else 0;
                };

                scanRecords.put(scanId, scanRecord);

                // Update user rewards if valid scan
                if (product.isAuthentic) {
                    switch (users.get(userId)) {
                        case null { };
                        case (?user) {
                            let updatedUser: User = {
                                id = user.id;
                                principal = user.principal;
                                name = user.name;
                                email = user.email;
                                totalRewards = user.totalRewards + product.rewardAmount;
                                bottlesRecycled = user.bottlesRecycled + 1;
                                joinedAt = user.joinedAt;
                            };
                            users.put(userId, updatedUser);
                        };
                    };
                };

                #ok(scanRecord)
            };
        }
    };

    public query func getScanHistory(userId: Text) : async [ScanRecord] {
        Array.filter<ScanRecord>(
            Array.map<(Text, ScanRecord), ScanRecord>(
                scanRecords.entries() |> Array.fromIter,
                func((_, record)) = record
            ),
            func(record) = record.userId == userId
        )
    };

    // Analytics
    public query func getStats() : async {
        totalUsers: Nat;
        totalProducts: Nat;
        totalScans: Nat;
        totalRewardsDistributed: Nat;
    } {
        let totalRewards = Array.foldLeft<(Text, User), Nat>(
            users.entries() |> Array.fromIter,
            0,
            func(acc, (_, user)) = acc + user.totalRewards
        );

        {
            totalUsers = users.size();
            totalProducts = products.size();
            totalScans = scanRecords.size();
            totalRewardsDistributed = totalRewards;
        }
    };

    // Health check
    public query func ping() : async Text {
        "Ping Backend is running! Time: " # Int.toText(Time.now())
    };

    // System functions for upgrades
    system func preupgrade() {
        // Stable variables are automatically preserved
    };

    system func postupgrade() {
        // Reinitialize hashmaps if needed
    };
}
