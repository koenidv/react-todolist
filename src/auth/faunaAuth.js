import faunadb, { Collection, query as q } from "faunadb"
const PUBLIC_CLIENT_KEY = "fnAElcE837AAyMtgyfnBe9Lr5xztgxRfkTl5edxn"

export function createUser(email, password) {
    return new Promise((resolve, reject) => {
        // Instantiate a FaunaDB client using the public client key
        // This key has read access to the user_by_email index and create access to the user collection
        const fauna = new faunadb.Client({ 
            secret: PUBLIC_CLIENT_KEY,
            domain: "db.eu.fauna.com",
            scheme: "https"
         })

        // Query to create a document for this user
        // Fauna hashes the password itself, so we don't have to worry about that here
        fauna.query(
            q.Create(Collection("users"), {
                credentials: { password: password },
                data: {
                    email: email
                }
            })
        )
            .then((ret) => console.log(ret))
            .catch((err) => console.error(
                'Error: [%s] %s: %s',
                err.name,
                err.message,
                err.errors()[0].description,
            ))
    })
}