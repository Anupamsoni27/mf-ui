# Backend Integration Guide

## Overview

I've created a complete backend API implementation for the favorites feature in `favorites_api_backend.py`. This guide will help you integrate it into your existing `f.py` file.

---

## What's Included

The implementation includes:

✅ **Authentication Middleware**
- JWT token verification
- Google token validation
- `@require_auth` decorator for protected routes

✅ **All 5 API Endpoints**
1. `GET /api/favorites` - Get user's favorites
2. `POST /api/favorites` - Add to favorites
3. `DELETE /api/favorites/:itemId` - Remove from favorites
4. `GET /api/favorites/stocks` - Get favorite stocks with details
5. `GET /api/favorites/funds` - Get favorite funds with details

✅ **Database Schema**
- MongoDB collection structure
- Indexes for performance
- Unique constraint to prevent duplicates

---

## Integration Steps

### Step 1: Copy the Backend File

The complete implementation is in:
```
/Users/anupamsoni/mf-ui/favorites_api_backend.py
```

You can either:
- **Option A**: Copy the entire content into your `f.py` file
- **Option B**: Import the functions from this file

### Step 2: Update Your f.py File

Add this to your existing `f.py`:

```python
# At the top of f.py, add imports
from functools import wraps
from datetime import datetime
import jwt
from bson import ObjectId

# Copy the verify_google_token and require_auth functions
# from favorites_api_backend.py

# Copy the setup_favorites_routes function
# from favorites_api_backend.py

# After your app and db initialization, add:
setup_favorites_routes(app, db)
```

### Step 3: Create Database Indexes

Run this once to create the necessary indexes:

```python
# In Python shell or as a one-time script
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['your_database_name']  # Replace with your DB name

# Create indexes
db['favorites'].create_index([('userId', 1), ('itemType', 1)])
db['favorites'].create_index(
    [('userId', 1), ('itemId', 1), ('itemType', 1)], 
    unique=True
)

print("Indexes created successfully!")
```

### Step 4: Update Collection Names

In the `setup_favorites_routes` function, update these lines to match your collection names:

```python
stocks_collection = db['stocks']  # Change 'stocks' to your collection name
funds_collection = db['funds']    # Change 'funds' to your collection name
```

### Step 5: Configure JWT Verification

Update the `verify_google_token` function with proper Google token verification:

```python
def verify_google_token(token):
    """
    Verify Google JWT token properly.
    """
    try:
        # For production, use Google's public keys
        from google.oauth2 import id_token
        from google.auth.transport import requests
        
        CLIENT_ID = 'your-google-client-id'
        idinfo = id_token.verify_oauth2_token(
            token, 
            requests.Request(), 
            CLIENT_ID
        )
        
        return idinfo.get('sub')  # Google user ID
        
    except Exception as e:
        print(f"Token verification error: {e}")
        return None
```

Or for development/testing, you can keep the simple decode:

```python
def verify_google_token(token):
    try:
        decoded = jwt.decode(token, options={"verify_signature": False})
        return decoded.get('sub')
    except Exception as e:
        return None
```

---

## API Endpoints Documentation

### 1. GET /api/favorites

**Description:** Get all favorites for authenticated user

**Headers:**
```
Authorization: Bearer <google_jwt_token>
```

**Query Parameters:**
- `type` (optional): Filter by 'stock' or 'fund'

**Response:**
```json
{
  "status": "success",
  "count": 10,
  "data": {
    "stocks": ["stock_id_1", "stock_id_2"],
    "funds": ["fund_id_1", "fund_id_2"]
  }
}
```

---

### 2. POST /api/favorites

**Description:** Add item to favorites

**Headers:**
```
Authorization: Bearer <google_jwt_token>
```

**Body:**
```json
{
  "itemId": "68d8564a9fece62833483580",
  "itemType": "stock"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Added to favorites",
  "data": {
    "_id": "favorite_id",
    "userId": "user_id",
    "itemId": "68d8564a9fece62833483580",
    "itemType": "stock",
    "createdAt": "2025-12-12T01:00:00"
  }
}
```

---

### 3. DELETE /api/favorites/:itemId

**Description:** Remove item from favorites

**Headers:**
```
Authorization: Bearer <google_jwt_token>
```

**URL Parameters:**
- `itemId`: ID of the item to remove

**Query Parameters:**
- `type`: 'stock' or 'fund' (required)

**Example:**
```
DELETE /api/favorites/68d8564a9fece62833483580?type=stock
```

**Response:**
```json
{
  "status": "success",
  "message": "Removed from favorites"
}
```

---

### 4. GET /api/favorites/stocks

**Description:** Get detailed info for all favorite stocks

**Headers:**
```
Authorization: Bearer <google_jwt_token>
```

**Response:**
```json
{
  "status": "success",
  "count": 5,
  "records": [
    {
      "_id": "stock_id",
      "name": "Stock Name",
      "symbol": "SYMBOL",
      "sector": "Technology",
      ...
    }
  ]
}
```

---

### 5. GET /api/favorites/funds

**Description:** Get detailed info for all favorite funds

**Headers:**
```
Authorization: Bearer <google_jwt_token>
```

**Response:**
```json
{
  "status": "success",
  "count": 3,
  "records": [
    {
      "_id": "fund_id",
      "name": "Fund Name",
      "holding_count": 50,
      ...
    }
  ]
}
```

---

## Database Schema

### Favorites Collection

```javascript
{
  _id: ObjectId,
  userId: String,        // Google user ID from JWT
  itemId: String,        // Stock or Fund ID
  itemType: String,      // 'stock' or 'fund'
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes

```javascript
// Compound index for fast queries
{ userId: 1, itemType: 1 }

// Unique compound index to prevent duplicates
{ userId: 1, itemId: 1, itemType: 1 } (unique)
```

---

## Testing the API

### Using curl

**1. Add to favorites:**
```bash
curl -X POST http://localhost:5000/api/favorites \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"itemId": "68d8564a9fece62833483580", "itemType": "stock"}'
```

**2. Get favorites:**
```bash
curl http://localhost:5000/api/favorites \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**3. Remove from favorites:**
```bash
curl -X DELETE "http://localhost:5000/api/favorites/68d8564a9fece62833483580?type=stock" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**4. Get favorite stocks:**
```bash
curl http://localhost:5000/api/favorites/stocks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman

1. Create a new request
2. Set method (GET, POST, DELETE)
3. Add URL: `http://localhost:5000/api/favorites`
4. Add header: `Authorization: Bearer <token>`
5. For POST, add JSON body
6. Send request

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "status": "error",
  "message": "Error description"
}
```

**Common Error Codes:**
- `401` - Unauthorized (missing or invalid token)
- `400` - Bad Request (missing required fields)
- `404` - Not Found (favorite doesn't exist)
- `500` - Server Error

---

## Security Considerations

1. **JWT Verification**: Update `verify_google_token` to properly verify tokens in production
2. **CORS**: Add CORS headers if frontend is on different domain
3. **Rate Limiting**: Consider adding rate limiting to prevent abuse
4. **Input Validation**: All inputs are validated before database operations
5. **User Isolation**: Users can only access their own favorites

---

## CORS Configuration (if needed)

If your frontend is on a different port/domain, add CORS:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:4200"],  # Your Angular app
        "methods": ["GET", "POST", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})
```

---

## Next Steps

1. ✅ Copy the code from `favorites_api_backend.py` to your `f.py`
2. ✅ Update collection names to match your database
3. ✅ Create database indexes
4. ✅ Configure JWT verification
5. ✅ Test each endpoint with curl or Postman
6. ✅ Update CORS if needed
7. ✅ Test with the Angular frontend

---

## Troubleshooting

### Issue: "No authorization header provided"
**Solution:** Make sure the frontend is sending the `Authorization` header with the JWT token

### Issue: "Favorite not found" when deleting
**Solution:** Check that the `itemId` and `type` parameter match exactly

### Issue: ObjectId conversion errors
**Solution:** The code handles both ObjectId and string IDs. Check your database ID format.

### Issue: Duplicate key error
**Solution:** The unique index prevents duplicates. This is expected behavior when trying to favorite the same item twice.

---

## Contact

If you encounter any issues integrating the backend, let me know and I can help debug!
