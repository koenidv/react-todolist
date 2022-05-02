# FQL Query to set up a FaunaDB instance

Step 1: Create Collections
```js
CreateCollection({
  name: "todos",
  history_days: 14,
  ttl_days: null
})

CreateCollection({
  name: "users",
  history_days: 30,
  ttl_days: null
})
```

Step 2: Create Indices
```js
CreateIndex({
  name: "todos_by_owner",
  unique: false,
  serialized: true,
  source: Collection("todos"),
  terms: [
    {
      field: ["data", "owner"]
    }
  ]
})

CreateIndex({
  name: "users_by_email",
  unique: true,
  serialized: true,
  source: Collection("users"),
  terms: [
    {
      field: ["data", "email"]
    }
  ]
})
```

STep 3: Create Permission Roles
```js
CreateRole({
  name: "user",
  privileges: [
    {
      resource: Collection("todos"),
      actions: {
        read: Query(
          Lambda(
            "ref",
            Equals(Identity(), Select(["data", "owner"], Get(Var("ref"))))
          )
        ),
        write: Query(
          Lambda(
            ["oldData", "newData"],
            And(
              Equals(Identity(), Select(["data", "owner"], Var("oldData"))),
              Equals(
                Select(["data", "owner"], Var("oldData")),
                Select(["data", "owner"], Var("newData"))
              )
            )
          )
        ),
        create: Query(
          Lambda(
            "values",
            Equals(Identity(), Select(["data", "owner"], Var("values")))
          )
        ),
        delete: Query(
          Lambda(
            "ref",
            Equals(Identity(), Select(["data", "owner"], Get(Var("ref"))))
          )
        ),
        history_read: Query(
          Lambda(
            "ref",
            Equals(Identity(), Select(["data", "owner"], Get(Var("ref"))))
          )
        ),
        history_write: false,
        unrestricted_read: false
      }
    },
    {
      resource: Index("todos_by_owner"),
      actions: {
        unrestricted_read: false,
        read: true
      }
    }
  ],
  membership: [
    {
      resource: Collection("users")
    }
  ]
})

CreateRole({
  name: "client",
  privileges: [
    {
      resource: Collection("users"),
      actions: {
        read: false,
        write: false,
        create: true,
        delete: false,
        history_read: false,
        history_write: false,
        unrestricted_read: false
      }
    },
    {
      resource: Index("users_by_email"),
      actions: {
        unrestricted_read: false,
        read: true
      }
    }
  ],
  membership: []
})
```
