import { query as q } from "faunadb"
import { fauna, getSecret } from "./auth/faunaAuth"

// Instantiate a FaunaDB client using the public client key
// This key has read access to the users_by_email index and create access to the user collection
// Once we have obtained an access token, we will use that
/*export const fauna = new faunadb.Client({
    secret: PUBLIC_CLIENT_KEY,
    domain: "db.eu.fauna.com",
    scheme: "https"
})*/

export function getTodos() {
    return new Promise((resolve, reject) => {
        // Check if a secret is saved in session storage, 
        // reject if not
        const secret = getSecret()
        if (secret === null) reject({
            name: "Unauthorized",
            message: "No access token provided"
        })

        // Query all own documents using the todos_by_owner index
        // The database will not allow access to documents with a different owner
        // than the currently authenticated one
        fauna.query(q.Map(q.Paginate(q.Match(
            q.Index("todos_by_owner"),
            q.Ref(q.Collection("users"), sessionStorage.getItem("userId")))),
            q.Lambda(x => q.Get(x))),
            { secret: secret }
        )
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err)
                console.error(err)
            })
    })
}

// Creates an entry in the todos collection
export function createTodo(title, description, due, priority, checked) {
    return new Promise((resolve, reject) => {
        // Check if a secret is saved in session storage, 
        // reject if not
        const secret = getSecret()
        if (secret === null) reject({
            name: "PermissionDenied",
            message: "No access token provided"
        })

        // Create a new document in todos with the todo content
        // and the currently authenticated user's Ref
        // The database will not allow creating documents with a owner
        fauna.query(q.Create(q.Collection("todos"), {
            data: {
                title: title || "",
                descr: description || "",
                due: due || null,
                priority: priority || 1,
                checked: checked || false,
                owner: q.Ref(q.Collection("users"), sessionStorage.getItem("userId"))
            },
        }), { secret: secret })
        .then((res) => resolve(res))
        .catch((err) => {
            console.error(err)
            reject(err)
        })
    })
}