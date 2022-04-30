import faunadb, { Collection, query as q } from "faunadb"
const PUBLIC_CLIENT_KEY = "fnAElcE837AAyMtgyfnBe9Lr5xztgxRfkTl5edxn"

// Instantiate a FaunaDB client using the public client key
// This key has read access to the users_by_email index and create access to the user collection
const fauna = new faunadb.Client({
    secret: PUBLIC_CLIENT_KEY,
    domain: "db.eu.fauna.com",
    scheme: "https"
})

export function createUser(email, password) {
    return new Promise((resolve, reject) => {

        // Query to create a document for this user
        // Fauna hashes the password itself, so we don't have to worry about that here
        fauna.query(
            q.Create(q.Collection("users"), {
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

export function login(email, password) {
    return new Promise((resolve, reject) => {
        // Query to get an access token from FaunaDB
        // We find the corresponding document reference (using the users_by_email index)
        // and provide a password, and Fauna will check if the hashes match
        fauna.query(
            q.Login(
                q.Match(q.Index("users_by_email"), email),
                { password: password }
            ))
            .then((ret) => {
                console.log(ret)
                alert("Login successful! Token is " + ret.secret)
            })
            .catch((err) => console.error(
                'Error: [%s] %s: %s',
                err.name,
                err.message,
                err.errors()[0].description,
            ))
    })
}