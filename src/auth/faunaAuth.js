import faunadb, { Collection, query as q } from "faunadb"
const PUBLIC_CLIENT_KEY = "fnAElcE837AAyMtgyfnBe9Lr5xztgxRfkTl5edxn"

// Instantiate a FaunaDB client using the public client key
// This key has read access to the users_by_email index and create access to the user collection
const fauna = new faunadb.Client({
    secret: PUBLIC_CLIENT_KEY,
    domain: "db.eu.fauna.com",
    scheme: "https"
})

// Creates a new account and resolves to an access token if successful
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
            .then((ret) => {
                // If the account was created successfully,
                // log the user in the using the same credentials
                console.log(ret)
                login(email, password)
                    .then((secret) => resolve(secret))
                    .catch((err) => reject(err))
            })
            .catch((err) => {
                console.error(err)
                reject(err)
            })
    })
}

// Tries to log the user in and resolves to an access token if credentials are valid
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
                resolve(ret.secret)
            })
            .catch((err) => {
                console.error(err)
                reject(err)
            })
    })
}