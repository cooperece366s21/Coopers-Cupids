// Backend url to make requests from
export const BACKEND_URL = "http://localhost:4567";

// Types
// -----

export type User = {
    userID: string;
    hasProfile: boolean;
};

export type Profile = {
    userID: string;
    name: string;
    age: number | null;
    photo: string | null;
    bio: string | null;
    location: string | null;
    interests: string | null; // In future make array of strings and show as badges?
};

export type Conversation = {
    userID: string,
    name: string,
    photo: string
};

enum MType {'TEXT', 'IMAGE', 'GIF'}

export type Message = {
    fromUserID: string;
    toUserID: string;
    messageType: MType;
    messageText: string;
    timestamp: Date;
};

// Types of responses expected from backend after login attempt
type loginResponse = {
    user: User
    status: "Success"
} | {
    error: string,
    status: "Failure"
};

// Functions
// ---------

// Stores the UserID (for requests) and an auth token (for authentication) in local storage

// TODO: Reset local storage on logout
// TODO: Store auth token expiration
// Auth Token
function getUserToken(): string {
    return localStorage.getItem("current_user_auth_token") || "";
}

function setUserToken(token: string): void {
    localStorage.setItem("current_user_auth_token", token);
}

// UserID
export function getCurrentUserID(): string {
    return localStorage.getItem("current_user") || "";
}


function setCurrentUserID(userID: string): void {
    localStorage.setItem("current_user", userID);
}

// TODO: Add error code that indicates user needs to sign in again
// Checks if values are still present in local storage
export function isStillSignedIn() {
    return getUserToken() !== "" && getCurrentUserID() !== "";
}

// TODO: Check header on response to verify source

/*  Expecting in response:
        header: Cookie / Auth Token
        body: User (See User type above)
 */
export async function signup(username: string, password: string): Promise<loginResponse> {
    const resp = await fetch(`${BACKEND_URL}/signup`, {
        method: 'POST',
        mode: 'cors',
        headers: {'Content-Type': 'application/json', "Access-Control-Allow-Headers": 'auth_key'},
        body: JSON.stringify({'username': username, 'password': password})
    })

    if(resp.ok) {
        const user: User = await resp.json()
        // Should never get back null, but need to keep TypeScript happy
        setUserToken(resp.headers.get("auth_token") || "");
        setCurrentUserID(user.userID);
        return {user: user, status: "Success"};
    } else {
        return {error: resp.status.toString(), status: "Failure"};
    }
}

/*  Expecting in response:
        header: Cookie / Auth Token
        body: User (See User type above)
 */
export async function login(username: string, password: string): Promise<loginResponse> {
    const resp = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({'username': username, 'password': password})
    });

    if(resp.ok) {
        const user: User = await resp.json()
        // Should never get back null, but need to keep TypeScript happy
        setUserToken(resp.headers.get("auth_token") || "");
        setCurrentUserID(user.userID);
        return {user: user, status: "Success"};
    } else {
        return {error: resp.status.toString(), status: "Failure"};
    }
}

/* Expecting in response:
        Nothing - Just looking at status
 */
export async function logout(): Promise<boolean> {
    const resp = await fetch(`${BACKEND_URL}/logout`, {
        method: 'POST',
        headers: {auth_token: getUserToken()}
    });

    return resp.ok;
}

/* Expecting in response:
        Nothing - Just looking at status
 */
//TODO: THIS NEEDS A HANDLER ENDPOINT
export async function updatePassword(password: string): Promise<boolean> {
    const resp = await fetch(`${BACKEND_URL}/TODO`, {
        method: 'POST',
        mode: 'cors',
        headers: {auth_token: getUserToken(), 'Content-Type': 'application/json'},
        body: JSON.stringify({'password': password})
    })

    return resp.ok;
}

/* Expecting in response:
       header: Cookie / Auth Token
       body: User (See User type above)
 */
export async function getCurrentUser(): Promise<User | null> {
    return getUserFromID(getCurrentUserID());
}

/* Expecting in response:
       header: Cookie / Auth Token
       body: User (See User type above)
 */
export async function getUserFromID(userID: string): Promise<User | null> {
    const resp = await fetch(`${BACKEND_URL}/user/${userID}`, {
        method: 'GET',
        headers: {auth_token: getUserToken()}
    });

    return resp.ok ? await resp.json() : null;
}

// Will either create new profile if none exists, or will update fields in profile
/* Expecting in response:
       header: Cookie / Auth Token
       body: Profile (See Profile type above)
 */
export async function setUserProfile(profile: Profile): Promise<Profile | null> {
    const userID = getCurrentUserID();

    const resp = await fetch(`${BACKEND_URL}/user/${userID}/create`, {
        method: 'POST',
        mode: 'cors',
        headers: {auth_token: getUserToken(), 'Content-Type': 'application/json'},
        body: JSON.stringify(profile)
    });

    return resp.ok ? await resp.json() : null;
}

export async function getCurrentUserProfile(): Promise<Profile | null> {
    return getUserProfile(getCurrentUserID());
}

/* Expecting in response:
       header: Cookie / Auth Token
       body: Profile (See Profile type above)
 */
export async function getUserProfile(userID: string): Promise<Profile | null> {
    const resp = await fetch(`${BACKEND_URL}/user/${userID}/profile`, {
        method: 'GET',
        headers: {auth_token: getUserToken()}
    })

    return resp.ok ? await resp.json() : null;
}

/* Expecting in response:
       header: Cookie / Auth Token
       body: Array of type Profile (See Profile type above)
 */
export async function getFeed(): Promise<Profile[]> {
    const userID = getCurrentUserID();
    const resp = await fetch(`${BACKEND_URL}/user/${userID}/feed`, {
        method: 'GET',
        headers: {auth_token: getUserToken()}
    })

    return resp.ok ? await resp.json() : null;
}

/* Expecting in response:
        Nothing - Just looking at status
 */
export async function like(likedUserID: string): Promise<boolean> {
    const userID = getCurrentUserID();

    const resp = await fetch(`${BACKEND_URL}/user/${userID}/feed/like`, {
        method: 'POST',
        mode: 'cors',
        headers: {auth_token: getUserToken(), 'Content-Type': 'application/json'},
        body: JSON.stringify({liked_userID: likedUserID})
    });

    return resp.ok;
}

/* Expecting in response:
        Nothing - Just looking at status
 */
export async function dislike(dislikedUserID: string): Promise<boolean> {
    const userID = getCurrentUserID();

    const resp = await fetch(`${BACKEND_URL}/user/${userID}/feed/dislike`, {
        method: 'POST',
        mode: 'cors',
        headers: {auth_token: getUserToken(), 'Content-Type': 'application/json'},
        body: JSON.stringify({disliked_userID: dislikedUserID})
    });

    return resp.ok;
}

/* Expecting in response:
       header: Cookie / Auth Token
       body: Array of type Conversation (See Conversation type above)
 */
export async function getAllConversations(): Promise<Conversation[]> {
    const userID = getCurrentUserID();
    const resp = await fetch(`${BACKEND_URL}/user/${userID}/convos`, {
        method: 'GET',
        headers: {auth_token: getUserToken()}
    })

    return resp.ok ? await resp.json() : null;
}

/* Expecting in response:
       header: Cookie / Auth Token
       body: Array of type Message (See Message type above)
 */
export async function getUserConversation(withUserID: string): Promise<Message[]> {
    const userID = getCurrentUserID();
    const resp = await fetch(`${BACKEND_URL}/user/${userID}/convos/${withUserID}`, {
        method: 'GET',
        headers: {auth_token: getUserToken()}
    })

    return resp.ok ? await resp.json() : null;
}

/* Expecting in response:
        Nothing - Just looking at status
 */
export async function sendMessage(toUserID: string, message: string): Promise<boolean> {
    const userID = getCurrentUserID();

    const resp = await fetch(`${BACKEND_URL}/user/${userID}/convos/${toUserID}/send`, {
        method: 'POST',
        mode: 'cors',
        headers: {auth_token: getUserToken(), 'Content-Type': 'application/json'},
        body: JSON.stringify({message: message})
    });

    return resp.ok;
}

/* Expecting in response:
        Nothing - Just looking at status
 */
export async function unmatch(unmatchedUserID: string): Promise<boolean> {
    const userID = getCurrentUserID();

    const resp = await fetch(`${BACKEND_URL}/user/${userID}/convos/${unmatchedUserID}/unmatch`, {
        method: 'POST',
        mode: 'cors',
        headers: {auth_token: getUserToken(), 'Content-Type': 'application/json'},
        body: JSON.stringify({unmatched_userID: unmatchedUserID})
    });

    return resp.ok;
}

const exports = {
    getCurrentUserID,
    isStillSignedIn,
    signup,
    login,
    logout,
    updatePassword,
    getCurrentUser,
    getUserFromID,
    setUserProfile,
    getCurrentUserProfile,
    getUserProfile,
    getFeed,
    like,
    dislike,
    getAllConversations,
    getUserConversation,
    sendMessage,
    unmatch
};

export default exports;


