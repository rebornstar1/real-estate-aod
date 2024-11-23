
# API documentation for **User Controller**:

### **Overview**
This API allows management of user data in a MongoDB database. It includes functionality to create users, retrieve user details, get and update user roles, and mark users as fraud.

---

### **Endpoints**

#### 1. **POST /users**
- **Description**: Creates a new user. Checks if the user already exists based on the provided email.
- **Method**: POST
- **URL**: `/users`
- **Body**:
  - `email`: The user's email address.
    - **Type**: `string`
  - `name`: The user's full name.
    - **Type**: `string`
  - `role`: The user's role (e.g., "admin", "user").
    - **Type**: `string`
  - `agentEmail`: The email address of the agent associated with the user.
    - **Type**: `string` (optional)
- **Request Example**:
  ```json
  {
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "agentEmail": "agent@example.com"
  }
  ```
- **Response**:
  - **Success (200)**:
    ```json
    {
      "acknowledged": true,
      "insertedId": "605c72ef153207d72f14e5a4"
    }
    ```
  - **Error (400)**: If the user already exists.
    ```json
    {
      "message": "user already exist",
      "insertedId": null
    }
    ```

#### 2. **GET /users**
- **Description**: Retrieves users based on an optional email query.
- **Method**: GET
- **URL**: `/users`
- **Query Parameters**:
  - `email` (optional): Filters users by their email.
    - **Type**: `string`
    - **Example**: `?email=user@example.com`
- **Response**:
  - **Success (200)**:
    ```json
    [
      {
        "_id": "605c72ef153207d72f14e5a4",
        "email": "user@example.com",
        "name": "John Doe",
        "role": "user"
      },
      ...
    ]
    ```
  - **Error (400)**: If the query fails or the email is invalid.
    ```json
    {
      "error": "Invalid email or query"
    }
    ```

#### 3. **GET /users/role**
- **Description**: Retrieves the role of a user based on their email.
- **Method**: GET
- **URL**: `/users/role`
- **Query Parameters**:
  - `email`: The user's email address.
    - **Type**: `string`
    - **Example**: `?email=user@example.com`
- **Response**:
  - **Success (200)**:
    ```json
    "user"
    ```
  - **Error (404)**: If the user is not found.
    ```json
    {
      "error": "User not found"
    }
    ```

#### 4. **PATCH /users**
- **Description**: Updates the role of a user based on their ID.
- **Method**: PATCH
- **URL**: `/users`
- **Query Parameters**:
  - `id`: The unique ID of the user to be updated.
    - **Type**: `string` (ObjectId)
  - `role`: The new role to assign to the user.
    - **Type**: `string`
- **Request Example**:
  ```json
  {
    "id": "605c72ef153207d72f14e5a4",
    "role": "admin"
  }
  ```
- **Response**:
  - **Success (200)**:
    ```json
    {
      "acknowledged": true,
      "modifiedCount": 1
    }
    ```
  - **Error (400)**: If the request body is invalid or the user ID does not exist.
    ```json
    {
      "error": "Invalid request or user not found"
    }
    ```

#### 5. **PATCH /users/fraud**
- **Description**: Marks a user as "fraud" and updates the user's associated properties to reflect the fraud status.
- **Method**: PATCH
- **URL**: `/users/fraud`
- **Query Parameters**:
  - `id`: The unique ID of the user.
    - **Type**: `string` (ObjectId)
  - `email`: The email address of the agent.
    - **Type**: `string`
- **Request Example**:
  ```json
  {
    "id": "605c72ef153207d72f14e5a4",
    "email": "agent@example.com"
  }
  ```
- **Response**:
  - **Success (200)**:
    ```json
    {
      "result": { "acknowledged": true, "modifiedCount": 1 },
      "result2": { "acknowledged": true, "modifiedCount": 5 }
    }
    ```
  - **Error (400)**: If the user or agent does not exist.
    ```json
    {
      "error": "Invalid request or user/agent not found"
    }
    ```

---

### **Parameters**

#### Query Parameters (for GET /users, GET /users/role, PATCH /users, PATCH /users/fraud)
- **email** (optional): 
  - **Type**: `string`
  - **Description**: Filters users by their email.

- **id**: 
  - **Type**: `string` (ObjectId)
  - **Description**: Unique identifier for the user (for updating roles or marking fraud).

- **role**: 
  - **Type**: `string`
  - **Description**: Specifies the new role for a user.

- **agentEmail** (optional): 
  - **Type**: `string`
  - **Description**: Email of the agent linked with the user (used for fraud marking).

---

### **Authentication**

- **Authentication Method**: No authentication required for these endpoints (public access).
  
---

### **Error Handling**

- **Error 400**: Invalid request or missing parameters.
  - Example response:
    ```json
    {
      "error": "Bad request"
    }
    ```

- **Error 404**: Resource not found (e.g., user not found by ID or email).
  - Example response:
    ```json
    {
      "error": "User not found"
    }
    ```

- **Error 500**: Server error (e.g., database failure).
  - Example response:
    ```json
    {
      "error": "Internal server error"
    }
    ```

---

### **Usage Notes**

- Ensure that the `email` query parameter is validated when used.
- The `role` parameter must be checked against a predefined list of valid roles (e.g., "user", "admin", "fraud").
- When marking users as fraud, ensure that related properties are also updated properly.

---

### **Additional Information**

- **Rate Limits**: No explicit rate limits for these endpoints.
- **Versioning**: No versioning is implemented yet. Consider using versioned URLs for future updates (e.g., `/v1/users`).
- **Deprecation**: No endpoints are deprecated.

---

# API documentation for **Review Controller**:


### **Overview**
This API allows clients to manage reviews for properties. It includes functionality to retrieve reviews, create new reviews, and delete existing reviews.

---

### **Endpoints**

#### 1. **GET /reviews**
- **Description**: Retrieves reviews based on optional filters for property ID or user email. Reviews are sorted by review time in descending order.
- **Method**: GET
- **URL**: `/reviews`
- **Query Parameters**:
  - `id` (optional): Filters reviews by the property ID.
    - **Type**: `string`
    - **Example**: `?id=605c72ef153207d72f14e5a4`
  - `email` (optional): Filters reviews by the user's email.
    - **Type**: `string`
    - **Example**: `?email=user@example.com`
- **Response**:
  - **Success (200)**:
    ```json
    [
      {
        "_id": "605c72ef153207d72f14e5a4",
        "propertyID": "605c72ef153207d72f14e5a4",
        "userEmail": "user@example.com",
        "reviewText": "Great place to stay!",
        "reviewTime": "2024-11-23T00:00:00Z"
      },
      ...
    ]
    ```
  - **Error (400)**: If no valid query parameters are provided or if the request fails.
    ```json
    {
      "error": "Invalid query parameters"
    }
    ```

#### 2. **POST /reviews**
- **Description**: Creates a new review for a property.
- **Method**: POST
- **URL**: `/reviews`
- **Body**:
  - `propertyID`: The ID of the property being reviewed.
    - **Type**: `string` (ObjectId)
  - `userEmail`: The email of the user submitting the review.
    - **Type**: `string`
  - `reviewText`: The content of the review.
    - **Type**: `string`
  - `reviewTime`: The time the review was written.
    - **Type**: `string` (ISO 8601 date format)
- **Request Example**:
  ```json
  {
    "propertyID": "605c72ef153207d72f14e5a4",
    "userEmail": "user@example.com",
    "reviewText": "Great place to stay!",
    "reviewTime": "2024-11-23T00:00:00Z"
  }
  ```
- **Response**:
  - **Success (201)**:
    ```json
    {
      "acknowledged": true,
      "insertedId": "605c72ef153207d72f14e5a4"
    }
    ```
  - **Error (400)**: If the request body is invalid or incomplete.
    ```json
    {
      "error": "Invalid request body"
    }
    ```

#### 3. **DELETE /reviews/:id**
- **Description**: Deletes a specific review by its ID.
- **Method**: DELETE
- **URL**: `/reviews/:id`
- **Path Parameters**:
  - `id`: The unique ID of the review to be deleted.
    - **Type**: `string` (ObjectId)
    - **Example**: `/reviews/605c72ef153207d72f14e5a4`
- **Response**:
  - **Success (200)**:
    ```json
    {
      "acknowledged": true,
      "deletedCount": 1
    }
    ```
  - **Error (404)**: If the review with the given ID is not found.
    ```json
    {
      "error": "Review not found"
    }
    ```

---

### **Parameters**

#### Query Parameters (for GET /reviews)
- **id** (optional): 
  - **Type**: `string`
  - **Description**: Filters reviews by the property ID.
- **email** (optional): 
  - **Type**: `string`
  - **Description**: Filters reviews by the user's email.

#### Path Parameters (for DELETE /reviews/:id)
- **id**: 
  - **Type**: `string` (ObjectId)
  - **Description**: Unique identifier for the review to be deleted.

#### Body Parameters (for POST /reviews)
- **propertyID**:
  - **Type**: `string` (ObjectId)
  - **Description**: The ID of the property being reviewed.
- **userEmail**:
  - **Type**: `string`
  - **Description**: The email address of the user submitting the review.
- **reviewText**:
  - **Type**: `string`
  - **Description**: The content of the review.
- **reviewTime**:
  - **Type**: `string`
  - **Description**: The timestamp when the review was written (in ISO 8601 format).

---

### **Authentication**

- **Authentication Method**: No authentication required for these endpoints (public access).

---

### **Error Handling**

- **Error 400**: Invalid query parameters, body format, or request failure.
  - Example response:
    ```json
    {
      "error": "Bad request"
    }
    ```

- **Error 404**: Resource not found (e.g., review not found by ID).
  - Example response:
    ```json
    {
      "error": "Review not found"
    }
    ```

- **Error 500**: Server error (e.g., database failure).
  - Example response:
    ```json
    {
      "error": "Internal server error"
    }
    ```

---

### **Usage Notes**

- Ensure that the `propertyID` and `userEmail` parameters are properly validated when used in queries.
- `reviewTime` should be in ISO 8601 format (`YYYY-MM-DDTHH:MM:SSZ`) for consistency across all reviews.
- Deleting a review will permanently remove it from the database. Ensure that this action is intentional.

---

### **Additional Information**

- **Rate Limits**: No explicit rate limits for these endpoints.
- **Versioning**: No versioning is implemented yet. Consider using versioned URLs for future updates (e.g., `/v1/reviews`).
- **Deprecation**: No endpoints are deprecated.

---

# API documentation for **Property Controller**:

### **Overview**
This API provides endpoints to manage property listings, including functionality to create, update, retrieve, delete, and verify properties. It also includes video upload capabilities for properties.

---

### **Endpoints**

#### 1. **GET /properties**
- **Description**: Retrieves a list of properties, with optional filters for property status, agent email, and sorting by price.
- **Method**: GET
- **URL**: `/properties`
- **Query Parameters**:
  - `status` (optional): Filters properties by their status (e.g., "verified", "rejected").
    - **Type**: `string`
    - **Example**: `?status=verified`
  - `email` (optional): Filters properties by the agent's email.
    - **Type**: `string`
    - **Example**: `?email=agent@example.com`
  - `sort` (optional): Sorts properties by minimum price (`asc` or `desc`).
    - **Type**: `string`
    - **Example**: `?sort=asc`
- **Response**:
  - **Success (200)**:
    ```json
    {
      "propertiesData": [
        {
          "_id": "605c72ef153207d72f14e5a4",
          "propertyTitle": "Luxury Villa",
          "priceRange": "$500,000 - $800,000",
          "minPrice": 500000,
          "maxPrice": 800000,
          "status": "verified",
          "agentEmail": "agent@example.com"
        }
      ],
      "countData": 1
    }
    ```
  - **Error (400)**: Invalid query parameters or failure.
    ```json
    {
      "error": "Invalid query parameters"
    }
    ```

#### 2. **GET /properties/:id**
- **Description**: Retrieves details of a specific property by its ID.
- **Method**: GET
- **URL**: `/properties/:id`
- **Path Parameters**:
  - `id`: The unique ID of the property.
    - **Type**: `string` (ObjectId)
    - **Example**: `/properties/605c72ef153207d72f14e5a4`
- **Response**:
  - **Success (200)**:
    ```json
    {
      "_id": "605c72ef153207d72f14e5a4",
      "propertyTitle": "Luxury Villa",
      "priceRange": "$500,000 - $800,000",
      "minPrice": 500000,
      "maxPrice": 800000,
      "status": "verified",
      "agentEmail": "agent@example.com"
    }
    ```
  - **Error (404)**: If property not found by ID.
    ```json
    {
      "error": "Property not found"
    }
    ```

#### 3. **PATCH /properties/:id**
- **Description**: Updates a specific property by its ID.
- **Method**: PATCH
- **URL**: `/properties/:id`
- **Path Parameters**:
  - `id`: The unique ID of the property to be updated.
    - **Type**: `string` (ObjectId)
    - **Example**: `/properties/605c72ef153207d72f14e5a4`
- **Request Body**:
  - `propertyImage`: URL of the property image.
  - `propertyTitle`: The title of the property.
  - `propertyLocation`: The location of the property.
  - `priceRange`: The price range of the property.
  - `minPrice`: The minimum price of the property.
  - `maxPrice`: The maximum price of the property.
  - `agentName`: The name of the agent handling the property.
- **Response**:
  - **Success (200)**:
    ```json
    {
      "acknowledged": true,
      "modifiedCount": 1
    }
    ```
  - **Error (400)**: If the update request is invalid.
    ```json
    {
      "error": "Invalid request body"
    }
    ```

#### 4. **POST /properties**
- **Description**: Creates a new property listing.
- **Method**: POST
- **URL**: `/properties`
- **Request Body**: Same as the `PATCH /properties/:id` body.
- **Response**:
  - **Success (201)**:
    ```json
    {
      "acknowledged": true,
      "insertedId": "605c72ef153207d72f14e5a4"
    }
    ```
  - **Error (500)**: If the property creation fails.
    ```json
    {
      "error": "Failed to create property."
    }
    ```

#### 5. **POST /properties/video**
- **Description**: Uploads a video file for the property.
- **Method**: POST
- **URL**: `/properties/video`
- **Request Body**: Multipart file upload for `VideoPitch` file.
- **Response**:
  - **Success (200)**:
    ```json
    {
      "videoUrl": "https://res.cloudinary.com/.../video.mp4"
    }
    ```
  - **Error (400)**: If no video file is provided.
    ```json
    {
      "error": "No video file provided."
    }
    ```
  - **Error (500)**: If the video upload fails.
    ```json
    {
      "error": "Failed to upload video."
    }
    ```

#### 6. **DELETE /properties/:id**
- **Description**: Deletes a specific property by its ID.
- **Method**: DELETE
- **URL**: `/properties/:id`
- **Path Parameters**:
  - `id`: The unique ID of the property to be deleted.
    - **Type**: `string` (ObjectId)
    - **Example**: `/properties/605c72ef153207d72f14e5a4`
- **Response**:
  - **Success (200)**:
    ```json
    {
      "acknowledged": true,
      "deletedCount": 1
    }
    ```
  - **Error (404)**: If property not found by ID.
    ```json
    {
      "error": "Property not found"
    }
    ```

#### 7. **PATCH /make-verified**
- **Description**: Marks a property as verified.
- **Method**: PATCH
- **URL**: `/make-verified`
- **Query Parameters**:
  - `id`: The ID of the property to be verified.
    - **Type**: `string` (ObjectId)
    - **Example**: `/make-verified?id=605c72ef153207d72f14e5a4`
- **Response**:
  - **Success (200)**:
    ```json
    {
      "acknowledged": true,
      "modifiedCount": 1
    }
    ```

#### 8. **PATCH /make-rejected**
- **Description**: Marks a property as rejected.
- **Method**: PATCH
- **URL**: `/make-rejected`
- **Query Parameters**:
  - `id`: The ID of the property to be rejected.
    - **Type**: `string` (ObjectId)
    - **Example**: `/make-rejected?id=605c72ef153207d72f14e5a4`
- **Response**:
  - **Success (200)**:
    ```json
    {
      "acknowledged": true,
      "modifiedCount": 1
    }
    ```

---

### **Parameters**

#### Query Parameters (for GET /properties, PATCH /make-verified, PATCH /make-rejected)
- **status** (optional): Filters properties by their status.
  - **Type**: `string`
- **email** (optional): Filters properties by the agent's email.
  - **Type**: `string`
- **sort** (optional): Sorts the properties by minimum price (`asc` or `desc`).
  - **Type**: `string`

#### Path Parameters (for GET /properties/:id, PATCH /properties/:id, DELETE /properties/:id)
- **id**: The unique identifier of the property.
  - **Type**: `string` (ObjectId)

#### Request Body (for POST /properties, PATCH /properties/:id)
- **propertyImage**: URL for the property image.
  - **Type**: `string`
- **propertyTitle**: The title of the property.
  - **Type**: `string`
- **propertyLocation**: The location of the property.
  - **Type**: `string`
- **priceRange**: The price range of the property.
  - **Type**: `string`
- **minPrice**: The minimum price of the property.
  - **Type**: `number`
- **maxPrice**: The maximum price of the property.
  - **Type**: `number`
- **agentName**: The name of the agent handling the property.
  - **Type**: `string`

---

### **Authentication**
- **Authentication Method**: No authentication required for these endpoints (public access).

---

### **Error Handling**

- **Error 400**: Invalid query parameters, body format, or request failure.
  - Example response:
    ```json
    {
      "error": "Bad request"
    }
    ```

-

 **Error 500**: Internal server errors, such as failure to connect to the database or Cloudinary.

---

# API documentation for **Wishlist Controller**:

### **Overview**
This API allows clients to interact with a **wishlist** collection in a MongoDB database. Users can retrieve all wishlists, get a wishlist by its ID, create a new wishlist, or delete an existing wishlist.

---

### **Endpoints**

#### 1. **GET /wishlists**
- **Description**: Retrieves all wishlists. Optionally, filters wishlists by the user's email if provided.
- **Method**: GET
- **URL**: `/wishlists`
- **Query Parameters**:
  - `email` (optional): Filters wishlists by the user's email.
    - **Type**: `string`
    - **Example**: `?email=user@example.com`
- **Response**:
  - **Success (200)**:
    ```json
    [
      {
        "_id": "605c72ef153207d72f14e5a4",
        "userEmail": "user@example.com",
        "items": ["item1", "item2"]
      },
      ...
    ]
    ```
  - **Error (400)**: If the email is invalid or query fails.
    ```json
    {
      "error": "Invalid email or query"
    }
    ```

#### 2. **GET /wishlists/:id**
- **Description**: Retrieves a specific wishlist by its unique ID.
- **Method**: GET
- **URL**: `/wishlists/:id`
- **Path Parameters**:
  - `id`: The unique identifier of the wishlist.
    - **Type**: `string` (ObjectId)
    - **Example**: `/wishlists/605c72ef153207d72f14e5a4`
- **Response**:
  - **Success (200)**:
    ```json
    {
      "_id": "605c72ef153207d72f14e5a4",
      "userEmail": "user@example.com",
      "items": ["item1", "item2"]
    }
    ```
  - **Error (404)**: If the wishlist with the given ID is not found.
    ```json
    {
      "error": "Wishlist not found"
    }
    ```

#### 3. **POST /wishlists**
- **Description**: Creates a new wishlist.
- **Method**: POST
- **URL**: `/wishlists`
- **Body**:
  - `userEmail`: Email of the user for whom the wishlist is being created.
    - **Type**: `string`
  - `items`: Array of items in the wishlist.
    - **Type**: `array` of `strings`
- **Request Example**:
  ```json
  {
    "userEmail": "user@example.com",
    "items": ["item1", "item2"]
  }
  ```
- **Response**:
  - **Success (201)**:
    ```json
    {
      "acknowledged": true,
      "insertedId": "605c72ef153207d72f14e5a4"
    }
    ```
  - **Error (400)**: If the request body is invalid.
    ```json
    {
      "error": "Invalid request body"
    }
    ```

#### 4. **DELETE /wishlists/:id**
- **Description**: Deletes a specific wishlist by its ID.
- **Method**: DELETE
- **URL**: `/wishlists/:id`
- **Path Parameters**:
  - `id`: The unique identifier of the wishlist.
    - **Type**: `string` (ObjectId)
    - **Example**: `/wishlists/605c72ef153207d72f14e5a4`
- **Response**:
  - **Success (200)**:
    ```json
    {
      "acknowledged": true,
      "deletedCount": 1
    }
    ```
  - **Error (404)**: If the wishlist with the given ID is not found.
    ```json
    {
      "error": "Wishlist not found"
    }
    ```

---

### **Parameters**

#### Query Parameters (for GET /wishlists)
- **email** (optional): 
  - **Type**: `string`
  - **Description**: Filters the wishlists by the user's email.

#### Path Parameters (for GET /wishlists/:id, DELETE /wishlists/:id)
- **id**: 
  - **Type**: `string` (ObjectId)
  - **Description**: Unique identifier for the wishlist.

#### Body Parameters (for POST /wishlists)
- **userEmail**:
  - **Type**: `string`
  - **Description**: The email address of the user for whom the wishlist is created.
- **items**:
  - **Type**: `array` of `strings`
  - **Description**: List of items in the wishlist.

---

### **Authentication**

- **Authentication Method**: No authentication required for these endpoints (public access).
  
---

### **Error Handling**

- **Error 400**: Invalid request or missing parameters.
  - Example response:
    ```json
    {
      "error": "Bad request"
    }
    ```

- **Error 404**: Resource not found (e.g., wishlist not found by ID).
  - Example response:
    ```json
    {
      "error": "Wishlist not found"
    }
    ```

- **Error 500**: Server error (e.g., database failure).
  - Example response:
    ```json
    {
      "error": "Internal server error"
    }
    ```

---

### **Usage Notes**

- Ensure that the `email` query parameter is properly validated when used.
- Use `ObjectId` for ID-based queries as the `_id` in MongoDB is an ObjectId.
- Be mindful of the potential for large responses when querying for all wishlists.

---

### **Additional Information**

- **Rate Limits**: There are no explicit rate limits for these endpoints.
- **Versioning**: No versioning is implemented yet. It is recommended to include a version number in the URL path for future updates (e.g., `/v1/wishlists`).
- **Deprecation**: No endpoints are deprecated.

---


# API documentation for **Payment Controller**:


### **Overview**
This API allows for managing payments and payment intents for agents and offers. It supports retrieving payments, creating payment records, and generating payment intents using Stripe for processing payments.

---

### **Endpoints**

#### 1. **GET /payments**
- **Description**: Retrieves a list of payments. You can filter payments by the agent's email.
- **Method**: GET
- **URL**: `/payments`
- **Query Parameters**:
  - `agentEmail` (optional): Filters payments by the agent's email.
    - **Type**: `string`
    - **Example**: `?agentEmail=agent@example.com`
- **Response**:
  - **Success (200)**:
    ```json
    [
      {
        "_id": "60d3b41abd7b53001f1b7d5a",
        "transactionId": "txn_1JG3Kp2eZvKYlo2C2SAbhFcP",
        "amount": 500,
        "agentEmail": "agent@example.com",
        "paymentStatus": "completed",
        "paymentDate": "2024-11-22T15:00:00Z"
      }
    ]
    ```
  - **Error (400)**: Invalid query parameters or failure.
    ```json
    {
      "error": "Invalid query parameters"
    }
    ```

#### 2. **POST /payments**
- **Description**: Creates a new payment record and updates the associated offer status to "bought".
- **Method**: POST
- **URL**: `/payments`
- **Request Body**:
  - `transactionId`: The Stripe transaction ID for the payment.
    - **Type**: `string`
  - `amount`: The payment amount.
    - **Type**: `number`
  - `agentEmail`: The email of the agent receiving the payment.
    - **Type**: `string`
  - `offersId`: The ID of the offer being paid for.
    - **Type**: `string`
  - `paymentStatus`: The current status of the payment (e.g., "completed").
    - **Type**: `string`
  - `paymentDate`: The date the payment was made.
    - **Type**: `string` (ISO 8601 date)
- **Response**:
  - **Success (200)**:
    ```json
    {
      "result": {
        "acknowledged": true,
        "insertedId": "60d3b41abd7b53001f1b7d5a"
      },
      "updateStatus": {
        "acknowledged": true,
        "modifiedCount": 1
      }
    }
    ```
  - **Error (400)**: If the payment creation fails.
    ```json
    {
      "error": "Failed to create payment."
    }
    ```

#### 3. **POST /create-payment-intent**
- **Description**: Creates a payment intent using Stripe to initiate a payment. This is typically used to process a payment through Stripe's API.
- **Method**: POST
- **URL**: `/create-payment-intent`
- **Request Body**:
  - `price`: The total price of the transaction (in USD).
    - **Type**: `number`
    - **Example**: `100`
- **Response**:
  - **Success (200)**:
    ```json
    {
      "clientSecret": "pi_1JG3Kp2eZvKYlo2C2SAbhFcP_secret_Fgh6g6esrHKZg44ShLr9"
    }
    ```
  - **Error (500)**: If the payment intent creation fails.
    ```json
    {
      "error": "Failed to create payment intent."
    }
    ```

---

### **Parameters**

#### Query Parameters (for GET /payments)
- **agentEmail** (optional): Filters the payments by the agent's email.
  - **Type**: `string`

#### Request Body (for POST /payments)
- **transactionId**: The unique transaction ID for the payment.
  - **Type**: `string`
- **amount**: The payment amount in cents.
  - **Type**: `number`
- **agentEmail**: The agent's email.
  - **Type**: `string`
- **offersId**: The offer ID for which the payment is being made.
  - **Type**: `string`
- **paymentStatus**: The payment status (e.g., "completed").
  - **Type**: `string`
- **paymentDate**: The date the payment was made.
  - **Type**: `string` (ISO 8601 date)

#### Request Body (for POST /create-payment-intent)
- **price**: The total price of the payment in USD.
  - **Type**: `number`

---

### **Authentication**
- **Authentication Method**: No authentication required for these endpoints (public access).

---

### **Error Handling**

- **Error 400**: Invalid query parameters, body format, or request failure (e.g., invalid transaction ID or missing fields).
  - Example response:
    ```json
    {
      "error": "Bad request"
    }
    ```

- **Error 500**: Internal server errors, such as failure to create a payment intent or connect to Stripe.

---

# API documentation for **Offer Controller**:


### **Overview**
This API allows for managing property offers. It supports retrieving offers, creating new offers, accepting or rejecting offers, and filtering offers based on agent or buyer email, property ID, or offer status.

---

### **Endpoints**

#### 1. **GET /offers**
- **Description**: Retrieves a list of offers. You can filter the offers by `propertyID`, `agentEmail`, and `buyerEmail`.
- **Method**: GET
- **URL**: `/offers`
- **Query Parameters**:
  - `id` (optional): Filters offers by the property ID.
    - **Type**: `string`
  - `agentEmail` (optional): Filters offers by the agent's email.
    - **Type**: `string`
  - `buyerEmail` (optional): Filters offers by the buyer's email.
    - **Type**: `string`
- **Response**:
  - **Success (200)**:
    ```json
    [
      {
        "_id": "60d3b41abd7b53001f1b7d5a",
        "propertyID": "60d3b41abd7b53001f1b7d5b",
        "buyerEmail": "buyer@example.com",
        "agentEmail": "agent@example.com",
        "offerAmount": 500000,
        "status": "pending"
      }
    ]
    ```
  - **Error (400)**: Invalid query parameters or failure to retrieve offers.
    ```json
    {
      "error": "Failed to retrieve offers."
    }
    ```

#### 2. **GET /offers/:id**
- **Description**: Retrieves a single offer by its ID.
- **Method**: GET
- **URL**: `/offers/:id`
- **URL Parameters**:
  - `id`: The offer ID.
    - **Type**: `string`
- **Response**:
  - **Success (200)**:
    ```json
    {
      "_id": "60d3b41abd7b53001f1b7d5a",
      "propertyID": "60d3b41abd7b53001f1b7d5b",
      "buyerEmail": "buyer@example.com",
      "agentEmail": "agent@example.com",
      "offerAmount": 500000,
      "status": "pending"
    }
    ```
  - **Error (400)**: Offer not found or invalid ID.
    ```json
    {
      "error": "Offer not found."
    }
    ```

#### 3. **POST /offers**
- **Description**: Creates a new offer.
- **Method**: POST
- **URL**: `/offers`
- **Request Body**:
  - `propertyID`: The ID of the property for the offer.
    - **Type**: `string`
  - `buyerEmail`: The email of the buyer making the offer.
    - **Type**: `string`
  - `agentEmail`: The email of the agent handling the property.
    - **Type**: `string`
  - `offerAmount`: The amount of the offer.
    - **Type**: `number`
  - `status`: The initial status of the offer (e.g., "pending").
    - **Type**: `string`
- **Response**:
  - **Success (200)**:
    ```json
    {
      "acknowledged": true,
      "insertedId": "60d3b41abd7b53001f1b7d5a"
    }
    ```
  - **Error (400)**: Failed to create the offer.
    ```json
    {
      "error": "Failed to create offer."
    }
    ```

#### 4. **PATCH /accepted-offer**
- **Description**: Accepts an offer and rejects other offers for the same property.
- **Method**: PATCH
- **URL**: `/accepted-offer`
- **Query Parameters**:
  - `id`: The ID of the offer to accept.
    - **Type**: `string`
  - `title`: The title of the property for which the offer is being accepted.
    - **Type**: `string`
- **Response**:
  - **Success (200)**:
    ```json
    {
      "result1": {
        "acknowledged": true,
        "modifiedCount": 1
      },
      "result2": {
        "acknowledged": true,
        "modifiedCount": 5
      }
    }
    ```
  - **Error (400)**: Failed to accept offer or update other offers.
    ```json
    {
      "error": "Failed to accept offer."
    }
    ```

#### 5. **PATCH /rejected-offer**
- **Description**: Rejects an offer.
- **Method**: PATCH
- **URL**: `/rejected-offer`
- **Query Parameters**:
  - `id`: The ID of the offer to reject.
    - **Type**: `string`
- **Response**:
  - **Success (200)**:
    ```json
    {
      "acknowledged": true,
      "modifiedCount": 1
    }
    ```
  - **Error (400)**: Failed to reject the offer.
    ```json
    {
      "error": "Failed to reject offer."
    }
    ```

---

### **Parameters**

#### Query Parameters (for GET /offers)
- **id** (optional): Filters offers by the property ID.
  - **Type**: `string`
- **agentEmail** (optional): Filters offers by the agent's email.
  - **Type**: `string`
- **buyerEmail** (optional): Filters offers by the buyer's email.
  - **Type**: `string`

#### Request Body (for POST /offers)
- **propertyID**: The ID of the property for which the offer is being made.
  - **Type**: `string`
- **buyerEmail**: The email of the buyer making the offer.
  - **Type**: `string`
- **agentEmail**: The email of the agent handling the property.
  - **Type**: `string`
- **offerAmount**: The amount of the offer.
  - **Type**: `number`
- **status**: The status of the offer (e.g., "pending").
  - **Type**: `string`

#### Query Parameters (for PATCH /accepted-offer and PATCH /rejected-offer)
- **id**: The ID of the offer to accept or reject.
  - **Type**: `string`
- **title** (for `/accepted-offer`): The title of the property for which the offer is being accepted.
  - **Type**: `string`

---

### **Authentication**
- **Authentication Method**: No authentication required for these endpoints (public access).

---

### **Error Handling**

- **Error 400**: Invalid query parameters, request body format, or database failure (e.g., invalid ID or failed update).
  - Example response:
    ```json
    {
      "error": "Bad request"
    }
    ```

- **Error 500**: Internal server errors, such as failure to update or retrieve offers.

---

## API Documentation for **Offer Controller**

This API handles operations related to property offers, such as fetching, creating, accepting, and rejecting offers.

---

### **Base URL**
`/offers`

---

### **Endpoints**

#### 1. **GET /offers**
- **Description**: Fetches all offers. You can filter offers by `propertyID`, `agentEmail`, or `buyerEmail`.
- **Method**: `GET`
- **Query Parameters**:
  - `id` (optional): Filters offers by the property ID.
    - **Type**: `string`
  - `agentEmail` (optional): Filters offers by the agent's email.
    - **Type**: `string`
  - `buyerEmail` (optional): Filters offers by the buyer's email.
    - **Type**: `string`
- **Response**:
  - **Success (200)**:
    ```json
    [
      {
        "_id": "6483f6b0c7341a2f64d5e7d9",
        "propertyID": "6483f6b0c7341a2f64d5e7d8",
        "buyerEmail": "buyer@example.com",
        "agentEmail": "agent@example.com",
        "offerAmount": 750000,
        "status": "pending"
      }
    ]
    ```
  - **Error (500)**:
    ```json
    {
      "error": "Failed to fetch offers."
    }
    ```

---

#### 2. **GET /offers/:id**
- **Description**: Fetches details of a specific offer by its ID.
- **Method**: `GET`
- **URL Parameters**:
  - `id`: The ID of the offer to retrieve.
    - **Type**: `string`
- **Response**:
  - **Success (200)**:
    ```json
    {
      "_id": "6483f6b0c7341a2f64d5e7d9",
      "propertyID": "6483f6b0c7341a2f64d5e7d8",
      "buyerEmail": "buyer@example.com",
      "agentEmail": "agent@example.com",
      "offerAmount": 750000,
      "status": "pending"
    }
    ```
  - **Error (404)**:
    ```json
    {
      "error": "Offer not found."
    }
    ```

---

#### 3. **POST /offers**
- **Description**: Creates a new offer.
- **Method**: `POST`
- **Request Body**:
  - `propertyID`: ID of the property the offer is for.
    - **Type**: `string`
  - `buyerEmail`: Email of the buyer.
    - **Type**: `string`
  - `agentEmail`: Email of the agent handling the property.
    - **Type**: `string`
  - `offerAmount`: The monetary amount of the offer.
    - **Type**: `number`
  - `status`: Initial status of the offer (e.g., `"pending"`).
    - **Type**: `string`
- **Response**:
  - **Success (201)**:
    ```json
    {
      "acknowledged": true,
      "insertedId": "6483f6b0c7341a2f64d5e7d9"
    }
    ```
  - **Error (400)**:
    ```json
    {
      "error": "Failed to create offer."
    }
    ```

---

#### 4. **PATCH /accepted-offer**
- **Description**: Accepts an offer and rejects all other pending offers for the same property.
- **Method**: `PATCH`
- **Query Parameters**:
  - `id`: The ID of the offer to accept.
    - **Type**: `string`
  - `title`: The title of the property associated with the offer.
    - **Type**: `string`
- **Response**:
  - **Success (200)**:
    ```json
    {
      "result1": {
        "acknowledged": true,
        "modifiedCount": 1
      },
      "result2": {
        "acknowledged": true,
        "modifiedCount": 4
      }
    }
    ```
  - **Error (500)**:
    ```json
    {
      "error": "Failed to update offers."
    }
    ```

---

#### 5. **PATCH /rejected-offer**
- **Description**: Rejects an offer.
- **Method**: `PATCH`
- **Query Parameters**:
  - `id`: The ID of the offer to reject.
    - **Type**: `string`
- **Response**:
  - **Success (200)**:
    ```json
    {
      "acknowledged": true,
      "modifiedCount": 1
    }
    ```
  - **Error (500)**:
    ```json
    {
      "error": "Failed to reject the offer."
    }
    ```

---

### **Error Codes**
- **400**: Invalid input or request body.
- **404**: Offer not found.
- **500**: Internal server error (e.g., database failure).

---

### **Authentication**
No authentication is implemented. This API is publicly accessible for now.



Here’s an API documentation for the authentication route and controller:

---

# API Documentation for  **Authentication Controller**

This API is used to generate JWT tokens for user authentication.

---

### **Base URL**
`/jwt`

---

### **Endpoints**

#### 1. **POST /jwt**
- **Description**: Generates a JWT token for the user.
- **Method**: `POST`
- **Request Body**:
  - Must include user information required for the token payload.
  - Example:
    ```json
    {
      "userId": "12345",
      "email": "user@example.com",
      "role": "admin"
    }
    ```
- **Response**:
  - **Success (200)**:
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
  - **Error (500)**:
    ```json
    {
      "error": "Failed to generate token."
    }
    ```

---

### **Token Details**
- **Algorithm**: `HS256` (HMAC using SHA-256)
- **Expiration**: 1 hour
- **Payload**:
  - Any fields included in the request body are encoded into the token payload.
- **Secret Key**: Derived from the environment variable `ACCESS_TOKEN_SECRET`.

---

### **Usage Example**
Once the token is generated, it can be used in the `Authorization` header of subsequent requests:
```http
Authorization: Bearer <token>
```

---

### **Error Codes**
- **500**: Internal server error (e.g., missing or invalid environment variables).

---

### **Authentication**
No initial authentication is required to generate the token, but you must ensure sensitive user validation is performed elsewhere in your application.

Let me know if you'd like further clarifications or improvements!

