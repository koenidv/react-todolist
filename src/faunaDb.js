import faunadb, { Collection, Documents, query as q } from "faunadb"
const PUBLIC_CLIENT_KEY = "fnAElcE837AAyMtgyfnBe9Lr5xztgxRfkTl5edxn"

// Instantiate a FaunaDB client using the public client key
// This key has read access to the users_by_email index and create access to the user collection
// Once we have obtained an access token, we will use that
export const fauna = new faunadb.Client({
    secret: PUBLIC_CLIENT_KEY,
    domain: "db.eu.fauna.com",
    scheme: "https"
})

// Retrieves the access token from session storage
export function getSecret() {
    let secret = sessionStorage.getItem("secret")
    if (secret === "") secret = null
    return secret
}

export function getTodos() {
    return new Promise((resolve, reject) => {
        // Check if a secret is saved in session storage, 
        // reject if not
        const secret = getSecret()
        if (secret === null) reject({
            name: "Unauthorized",
            message: "No access token provided"
        })

        fauna.query(q.Map(
            q.Paginate(Documents(Collection("todos"))),
            q.Lambda(x => q.Get(x))
        ), { secret: secret })
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => { reject(err) })
    })
}

// Creates an entry in the todos collection
export function createTodo(content) {
    return new Promise((resolve, reject) => {
        // Check if a secret is saved in session storage, 
        // reject if not
        const secret = getSecret()
        if (secret === null) reject({
            name: "PermissionDenied",
            message: "No access token provided"
        })

        fauna.query(q.Create(q.Collection("todos"), {
            data: {
                title: content,
                owner: q.Ref(q.Collection("users"), sessionStorage.getItem("userId"))
            },
        }), { secret: secret })
    })
}