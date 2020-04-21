# `@basementscripts/dynamodb-utils`

```
{
    "access": "public",
    "level": "beginner",
    "maxCapacity": 1000,
    "description": "Some cool class that burns some calories",
    "calories": 240,
    "type": "d2a64fb4-ee55-4f5f-9553-debe943ec35f",
    "uri": "kMOOsHYm0gJ",
    "duration": 60,
    "intensity": "moderate",
    "createdAt": 1587498636863,
    "instructor": "7489022c-3a87-4873-a9a2-9188b39af2ec",
    "name": "Acro 101",
    "id": "ec0b0de2-9515-4832-8d32-2b8de592bc69",
    "categories": [
        "379b8d3c-d6e5-4c3d-a450-243d0806cb0b",
        "b2c7ea80-3da9-4c4c-984a-2ba85ff88123"
    ],
    "account": "3ea5714d-b346-444f-8841-403ea7568e04",
    "status": "unpublished",
    "updatedAt": 1587498636863
}
```

## Query

```
const schema: QueryInputRequest = {
  tableName: 'Classes',
  indexName: 'ClassByTypeIndex',
  params: {
    type: 'd2a64fb4-ee55-4f5f-9553-debe943ec35f'
  }
}

```

## Scan

```
const schema: ScanInputRequest = {
  tableName: 'Classes',
  params: {
    categories: ['379b8d3c-d6e5-4c3d-a450-243d0806cb0b]
  }
}

```

```
{
  "params": {
    "N": 9,
    "S": "ec0b0de2-9515-4832-8d32-2b8de592bc69",
    "SS": ["ec0b0de2-9515-4832-8d32-2b8de592bc69"],
    "BOOL": true
  }
}

```
