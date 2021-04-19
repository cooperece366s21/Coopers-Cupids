// Backend url to make requests from
export const BACKEND_URL = "";

// Types
// -----

export type User = {
    userID: string;
    has_profile: boolean;
};

export type Profile = {
    userID: string;
    name: string;
    age: number | null;
    photo: string | null;
    bio: string | null;
    location: string | null;
    interests: string | null; // In future make array of strings and show as badges?
} | null;

export type Conversation = {
    user1ID: string;
    user2ID: string;
    messages: Message[];
};

enum MType {'TEXT', 'IMAGE', 'GIF'}

export type Message = {
    from_userID: string;
    to_userID: string;
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

// Local Storage
function getCurrentUserID(): string {
    return localStorage.getItem("current_user") || "";
}

// For now this will use the userID as the authentication value.
// In the future it will use some sort of cookie value / hash to authenticate user
function setCurrentUserID(user: User): void {
    localStorage.setItem("current_user", user.userID);
}

/*  Expecting in response:
        header: userID / cookie
        body: User (See User type above)
 */
export async function signup(username: string, password: string): Promise<loginResponse> {
    const resp = await fetch(`${BACKEND_URL}/signup`, {
        method: 'POST',
        mode: 'cors',
        headers: {userID: getCurrentUserID(), 'Content-Type': 'application/json'},
        body: JSON.stringify({'username': username, 'password': password})
    })

    if(resp.ok) {
        const user: User = await resp.json()
        setCurrentUserID(user);
        return {user: user, status: "Success"};
    } else {
        return {error: resp.status.toString(), status: "Failure"};
    }
}

/*  Expecting in response:
        header: userID / cookie
        body: User (See User type above)
 */
export async function login(username: string, password: string): Promise<loginResponse> {
    const resp = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        mode: 'cors',
        headers: {userID: getCurrentUserID(), 'Content-Type': 'application/json'},
        body: JSON.stringify({'username': username, 'password': password})
    });

    if(resp.ok) {
        const user: User = await resp.json()
        setCurrentUserID(user);
        return {user: user, status: "Success"};
    } else {
        return {error: resp.status.toString(), status: "Failure"};
    }
}

export async function logout(): Promise<boolean> {
    const resp = await fetch(`${BACKEND_URL}/logout`, {
        method: 'POST',
        headers: {userID: getCurrentUserID()}
    });

    return resp.ok;
}

// THIS NEEDS A HANDLER ENDPOINT
export async function updatePassword(password: string): Promise<boolean> {
    const resp = await fetch(`${BACKEND_URL}/TODO`, {
        method: 'POST',
        mode: 'cors',
        headers: {userID: getCurrentUserID(), 'Content-Type': 'application/json'},
        body: JSON.stringify({'password': password})
    })

    return resp.ok;
}

/* Expecting in response:
       header: userID / cookie
       body: User (See User type above)
 */
export async function getCurrentUser(): Promise<User | null> {
    const resp = await fetch(`${BACKEND_URL}/me`, {
        method: 'GET',
        headers: {userID: getCurrentUserID()}
    });

    return resp.ok ? await resp.json() : null;
}

/* Expecting in response:
       header: userID / cookie
       body: User (See User type above)
 */
export async function getUserFromID(userID: string): Promise<User | null> {
    const resp = await fetch(`${BACKEND_URL}/user/${userID}`, {
        method: 'GET',
        headers: {userID: getCurrentUserID()}
    });

    return resp.ok ? await resp.json() : null;
}

// Will either create new profile if none exists, or will update fields in profile
// In future maybe only send updated fields instead of all?
/* Expecting in response:
       header: userID / cookie
       body: Profile (See Profile type above)
 */
export async function setUserProfile(profile: Profile): Promise<Profile | null> {
    const userID = getCurrentUserID();

    const resp = await fetch(`${BACKEND_URL}/user/${userID}/create`, {
        method: 'POST',
        mode: 'cors',
        headers: {userID: userID, 'Content-Type': 'application/json'},
        body: JSON.stringify(profile)
    });

    return resp.ok ? await resp.json() : null;
}

export async function getCurrentUserProfile(): Promise<Profile | null> {
    return getUserProfile(getCurrentUserID());
}

/* Expecting in response:
       header: userID / cookie
       body: Profile (See Profile type above)
 */
export async function getUserProfile(userID: string): Promise<Profile | null> {
    const resp = await fetch(`${BACKEND_URL}/user/${userID}/profile`, {
        method: 'GET',
        headers: {userID: getCurrentUserID()}
    })

    return resp.ok ? await resp.json() : null;
}

/* Expecting in response:
       header: userID / cookie
       body: Array of type User (See User type above)
 */
export async function getFeed(): Promise<User[]> {
    const userID = getCurrentUserID();
    const resp = await fetch(`${BACKEND_URL}/user/${userID}/feed`, {
        method: 'GET',
        headers: {userID: userID}
    })

    return resp.ok ? await resp.json() : null;
}

export async function like(liked_userID: string): Promise<boolean> {
    const userID = getCurrentUserID();

    const resp = await fetch(`${BACKEND_URL}/user/${userID}/feed/like`, {
        method: 'POST',
        mode: 'cors',
        headers: {userID: userID, 'Content-Type': 'application/json'},
        body: JSON.stringify({liked_userID: liked_userID})
    });

    return resp.ok;
}

export async function dislike(disliked_userID: string): Promise<boolean> {
    const userID = getCurrentUserID();

    const resp = await fetch(`${BACKEND_URL}/user/${userID}/feed/dislike`, {
        method: 'POST',
        mode: 'cors',
        headers: {userID: userID, 'Content-Type': 'application/json'},
        body: JSON.stringify({disliked_userID: disliked_userID})
    });

    return resp.ok;
}

/* Expecting in response:
       header: userID / cookie
       body: Array of type Conversation (See Conversation type above)
 */
export async function getAllConversations(): Promise<Conversation[]> {
    const userID = getCurrentUserID();
    const resp = await fetch(`${BACKEND_URL}/user/${userID}/convos`, {
        method: 'GET',
        headers: {userID: userID}
    })

    return resp.ok ? await resp.json() : null;
}

/* Expecting in response:
       header: userID / cookie
       body: Conversation (See Conversation type above)
 */
export async function getUserConversation(with_userID: string): Promise<Conversation> {
    const userID = getCurrentUserID();
    const resp = await fetch(`${BACKEND_URL}/user/${userID}/convos/${with_userID}`, {
        method: 'GET',
        headers: {userID: userID}
    })

    return resp.ok ? await resp.json() : null;
}

export async function sendMessage(to_userID: string): Promise<boolean> {
    const userID = getCurrentUserID();

    const resp = await fetch(`${BACKEND_URL}/user/${userID}/convos/${to_userID}/send`, {
        method: 'POST',
        mode: 'cors',
        headers: {userID: userID, 'Content-Type': 'application/json'},
        body: JSON.stringify({to_userID: to_userID})
    });

    return resp.ok;
}

export async function unmatch(unmatched_userID: string): Promise<boolean> {
    const userID = getCurrentUserID();

    const resp = await fetch(`${BACKEND_URL}/user/${userID}/convos/${unmatched_userID}/unmatch`, {
        method: 'POST',
        mode: 'cors',
        headers: {userID: userID, 'Content-Type': 'application/json'},
        body: JSON.stringify({unmatched_userID: unmatched_userID})
    });

    return resp.ok;
}

const exports = {
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


