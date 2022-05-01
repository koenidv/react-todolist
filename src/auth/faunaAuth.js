import faunadb, { query as q } from "faunadb"
import { getSecret } from "../faunaDb"
const PUBLIC_CLIENT_KEY = "fnAElcE837AAyMtgyfnBe9Lr5xztgxRfkTl5edxn"

// Instantiate a FaunaDB client using the public client key
// This key has read access to the users_by_email index and create access to the user collection
// Once we have obtained an access token, we will use that
export const fauna = new faunadb.Client({
    secret: PUBLIC_CLIENT_KEY,
    domain: "db.eu.fauna.com",
    scheme: "https"
})

export function saveToSession([secret, userRef]) {
    sessionStorage.setItem("secret", secret)
    sessionStorage.setItem("userId", userRef.value.id)
}

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
                    .then((res) => resolve(res))
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
            .then((res) => {
                console.log(res)
                resolve([res.secret, res.instance])
            })
            .catch((err) => {
                console.error(err)
                reject(err)
            })
    })
}

// Logs the user out and invalidates the access token
export function logout() {
    return new Promise((resolve, reject) => {
        const secret = getSecret()

        // Check if a secret is saved in session storage, 
        // reject if not
        if (secret === null) reject({
            name: "PermissionDenied",
            message: "No access token provided"
        })

        const clientWithSecret = new faunadb.Client({ secret: secret, domain: "db.eu.fauna.com" })

        // Log out using the current access token
        clientWithSecret.query(q.Logout(false))
            .then((res) => resolve(res))
            .catch((err) => reject(err))

    })

}