# Database Structure Design

## Current Issues
- All trips stored in single `AITrips` collection
- Querying by `userEmail` field is inefficient
- No dedicated user management
- Poor data relationships

## Recommended Structure

### 1. Users Collection
```
users/{userId}
├── userId: string (auto-generated)
├── email: string
├── name: string
├── profilePicture: string
├── createdAt: timestamp
├── lastLoginAt: timestamp
└── preferences: object
    ├── defaultBudget: number
    ├── favoriteDestinations: array
    └── travelStyle: string
```

### 2. Trips Collection (Nested under Users)
```
users/{userId}/trips/{tripId}
├── tripId: string (auto-generated)
├── title: string
├── destination: string
├── userPreference: object
├── tripDatas: object
├── createdAt: timestamp
├── updatedAt: timestamp
├── isPublic: boolean
└── status: string (draft, active, completed)
```

### 3. Alternative: Separate Trips Collection with User Reference
```
trips/{tripId}
├── tripId: string (auto-generated)
├── userId: string (reference to users collection)
├── title: string
├── destination: string
├── userPreference: object
├── tripDatas: object
├── createdAt: timestamp
├── updatedAt: timestamp
├── isPublic: boolean
└── status: string
```

## Benefits of New Structure
1. **Better Performance**: Direct user-based queries
2. **Data Integrity**: Clear user-trip relationships
3. **Scalability**: Easier to add user features
4. **Security**: Better access control
5. **Analytics**: Easier to track user behavior

## Migration Strategy
1. Create new collections
2. Migrate existing data
3. Update application code
4. Test thoroughly
5. Remove old structure
