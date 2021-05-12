// Backend url to make requests from

const BACKEND_URL = "http://localhost:4567";
const COOKIE_EXP_CODE = 450;

// Types
// -----

export type User = {
    email: string;
    hasProfile: boolean;
};

export type Profile = {
    userID?: string,
    name: string;
    age: number;
    photo: string;
    bio: string;
    location: string;
    interests: string;
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
    user: User;
    status: "Success";
} | {
    error: string;
    status: "Failure";
};

export type emailSettings = {
    matchEmails: boolean;
    messageEmails: boolean;
};

// Functions
// ---------

// Checks if cookie has expired
function checkCookieExpiration(status: number) {
    // Checks status in response
    if(status === COOKIE_EXP_CODE) {
        // Clears local storage
        setCurrentUsername("");
        setUserToken("");
    }
}

// Auth Token
// Stores the UserID (for requests) and an auth token (for authentication) in local storage
function getUserToken(): string {
    return localStorage.getItem("current_user_auth_token") || "";
}

function setUserToken(token: string): void {
    localStorage.setItem("current_user_auth_token", token);
}

// UserID
export function getCurrentUsername(): string {
    return localStorage.getItem("current_user") || "";
}


function setCurrentUsername(userID: string): void {
    localStorage.setItem("current_user", userID);
}

// Checks if values are still present in local storage
export function isStillSignedIn() {
    return getUserToken() !== "" && getCurrentUsername() !== "";
}

/*  Expecting in response:
        header: Cookie / Auth Token
        body: User (See User type above)
 */
export async function signup(username: string, password: string): Promise<loginResponse> {
    const resp = await fetch(`${BACKEND_URL}/signup`, {
        method: 'POST',
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: username, password: password})
    });

    if(resp.ok) {
        const user: User = await resp.json()
        // Should never get back null, but need to keep TypeScript happy
        setUserToken(resp.headers.get("auth_token") || "");
        setCurrentUsername(user.email || "");
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
        body: JSON.stringify({username: username, password: password})
    });

    if(resp.ok) {
        const user: User = await resp.json()
        // Should never get back null, but need to keep TypeScript happy
        setUserToken(resp.headers.get("auth_token") || "");
        setCurrentUsername(user.email);
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
        headers: {auth_token: getUserToken()},
        body: JSON.stringify({email: getCurrentUsername()})
    });


    setCurrentUsername("");
    setUserToken("");

    return resp.ok;
}

/* Expecting in response:
        Nothing - Just looking at status
 */
export async function deleteAccount(password: string): Promise<boolean> {
    const resp = await fetch(`${BACKEND_URL}/user/${getCurrentUsername()}/delete`, {
        method: 'POST',
        headers: {auth_token: getUserToken()},
        body: JSON.stringify({password: password})
    });

    if(resp.ok) {
        setCurrentUsername("");
        setUserToken("");
    }

    return resp.ok;
}


/* Expecting in response:
       header: Cookie / Auth Token
       body: emailSettings (See emailSettings type above)
 */
// TODO: THIS NEEDS A HANDLER ENDPOINT
export async function getEmailSettings(): Promise<emailSettings | null> {
    const resp = await fetch(`${BACKEND_URL}/TODO`, {
        method: 'GET',
        headers: {auth_token: getUserToken()}
    });

    checkCookieExpiration(resp.status);

    return resp.ok ? await resp.json() : null;
}

/* Expecting in response:
        Nothing - Just looking at status
 */
//TODO: THIS NEEDS A HANDLER ENDPOINT
export async function setEmailSettings(matchEmails: boolean, messageEmails: boolean): Promise<boolean> {
    const resp = await fetch(`${BACKEND_URL}/TODO`, {
        method: 'POST',
        mode: 'cors',
        headers: {auth_token: getUserToken(), 'Content-Type': 'application/json'},
        body: JSON.stringify({matchEmails: matchEmails, messageEmails: messageEmails})
    });

    checkCookieExpiration(resp.status);

    return resp.ok;
}

/* Expecting in response:
        Nothing - Just looking at status
 */
export async function updateEmail(newEmail: string, password: string): Promise<boolean> {

    const resp = await fetch(`${BACKEND_URL}/user/${getCurrentUsername()}/editEmail`, {
        method: 'POST',
        mode: 'cors',
        headers: {auth_token: getUserToken(), 'Content-Type': 'application/json'},
        body: JSON.stringify({email: newEmail, password: password})
    });

    checkCookieExpiration(resp.status);

    // Updates email
    if(resp.ok) {
        setCurrentUsername(newEmail);
    }

    return resp.ok;
}

/* Expecting in response:
        Nothing - Just looking at status
 */
export async function updatePassword(oldPassword: string, newPassword: string): Promise<boolean> {

    const resp = await fetch(`${BACKEND_URL}/user/${getCurrentUsername()}/editPassword`, {
        method: 'POST',
        mode: 'cors',
        headers: {auth_token: getUserToken(), 'Content-Type': 'application/json'},
        body: JSON.stringify({old_password: oldPassword, new_password: newPassword})
    });

    checkCookieExpiration(resp.status);

    return resp.ok;
}

/* Expecting in response:
       header: Cookie / Auth Token
       body: User (See User type above)
 */
export async function getCurrentUser(): Promise<User | null> {
    return getUserFromEmail(getCurrentUsername());
}

/* Expecting in response:
       header: Cookie / Auth Token
       body: User (See User type above)
 */
export async function getUserFromEmail(email: string): Promise<User | null> {
    const resp = await fetch(`${BACKEND_URL}/user/${email}`, {
        method: 'GET',
        headers: {auth_token: getUserToken()}
    });

    checkCookieExpiration(resp.status);

    return resp.ok ? await resp.json() : null;
}

// Will either create new profile if none exists, or will update fields in profile
/* Expecting in response:
       header: Cookie / Auth Token
       body: Profile (See Profile type above)
 */
export async function setUserProfile(profile: Profile): Promise<Profile | null> {
    const email = getCurrentUsername();

    const resp = await fetch(`${BACKEND_URL}/user/${email}/create`, {
        method: 'POST',
        mode: 'cors',
        headers: {auth_token: getUserToken(), 'Content-Type': 'application/json'},
        body: JSON.stringify(profile)
    });

    checkCookieExpiration(resp.status);

    return resp.ok ? await resp.json() : null;
}

export async function editProfile(profile: Profile): Promise<Profile | null> {

    const resp = await fetch(`${BACKEND_URL}/user/${getCurrentUsername()}/profile/edit`, {
        method: 'POST',
        mode: 'cors',
        headers: {auth_token: getUserToken(), 'Content-Type': 'application/json'},
        body: JSON.stringify(profile)
    });

    checkCookieExpiration(resp.status);

    return resp.ok ? await resp.json() : null;
}

/* Expecting in response:
       header: Cookie / Auth Token
       body: Profile (See Profile type above)
 */
export async function getCurrentUserProfile(): Promise<Profile | null> {

    const resp = await fetch(`${BACKEND_URL}/user/${getCurrentUsername()}/profile`, {
        method: 'GET',
        headers: {auth_token: getUserToken()}
    });

    checkCookieExpiration(resp.status);

    return resp.ok ? await resp.json() : null;
}

/* Expecting in response:
       header: Cookie / Auth Token
       body: Profile (See Profile type above)
 */
export async function getUserProfile(userID: string): Promise<Profile | null> {
    const resp = await fetch(`${BACKEND_URL}/user/${getCurrentUsername()}/profile/${userID}`, {
        method: 'GET',
        headers: {auth_token: getUserToken()}
    });

    checkCookieExpiration(resp.status);

    return resp.ok ? await resp.json() : null;
}

/* Expecting in response:
       header: Cookie / Auth Token
       body: Array of type Profile (See Profile type above)
 */
export async function getFeed(): Promise<Profile[]> {

    const resp = await fetch(`${BACKEND_URL}/user/${getCurrentUsername()}/feed`, {
        method: 'GET',
        headers: {auth_token: getUserToken()}
    })

    checkCookieExpiration(resp.status);

    return resp.ok ? await resp.json() : null;
}

/* Expecting in response:
        Nothing - Just looking at status
 */
export async function like(likedUserID: string): Promise<boolean> {

    const resp = await fetch(`${BACKEND_URL}/user/${getCurrentUsername()}/feed/like`, {
        method: 'POST',
        mode: 'cors',
        headers: {auth_token: getUserToken(), 'Content-Type': 'application/json'},
        body: JSON.stringify({liked_userID: likedUserID})
    });

    checkCookieExpiration(resp.status);

    return resp.ok;
}

/* Expecting in response:
        Nothing - Just looking at status
 */
export async function dislike(dislikedUserID: string): Promise<boolean> {

    const resp = await fetch(`${BACKEND_URL}/user/${getCurrentUsername()}/feed/dislike`, {
        method: 'POST',
        mode: 'cors',
        headers: {auth_token: getUserToken(), 'Content-Type': 'application/json'},
        body: JSON.stringify({disliked_userID: dislikedUserID})
    });

    checkCookieExpiration(resp.status);

    return resp.ok;
}

/* Expecting in response:
       header: Cookie / Auth Token
       body: Array of type Conversation (See Conversation type above)
 */
export async function getAllConversations(): Promise<Conversation[]> {
    const resp = await fetch(`${BACKEND_URL}/user/${getCurrentUsername()}/convos`, {
        method: 'GET',
        headers: {auth_token: getUserToken()}
    });

    checkCookieExpiration(resp.status);

    return resp.ok ? await resp.json() : null;
}

/* Expecting in response:
       header: Cookie / Auth Token
       body: Array of type Message (See Message type above)
 */
export async function getUserConversation(withUserID: string): Promise<Message[]> {

    const resp = await fetch(`${BACKEND_URL}/user/${getCurrentUsername()}/convos/${withUserID}`, {
        method: 'GET',
        headers: {auth_token: getUserToken()}
    });

    checkCookieExpiration(resp.status);

    return resp.ok ? await resp.json() : null;
}

/* Expecting in response:
        Nothing - Just looking at status
 */
export async function sendMessage(toUserID: string, message: string): Promise<boolean> {

    const resp = await fetch(`${BACKEND_URL}/user/${getCurrentUsername()}/convos/${toUserID}/send`, {
        method: 'POST',
        mode: 'cors',
        headers: {auth_token: getUserToken(), 'Content-Type': 'application/json'},
        body: JSON.stringify({message: message})
    });

    checkCookieExpiration(resp.status);

    return resp.ok;
}

/* Expecting in response:
        Nothing - Just looking at status
 */
export async function unmatch(unmatchedUserID: string): Promise<boolean> {

    const resp = await fetch(`${BACKEND_URL}/user/${getCurrentUsername()}/convos/${unmatchedUserID}/unmatch`, {
        method: 'POST',
        mode: 'cors',
        headers: {auth_token: getUserToken(), 'Content-Type': 'application/json'}
    });

    checkCookieExpiration(resp.status);

    return resp.ok;
}

const exports = {
    getCurrentUsername,
    isStillSignedIn,
    signup,
    login,
    logout,
    deleteAccount,
    getEmailSettings,
    setEmailSettings,
    updateEmail,
    updatePassword,
    getCurrentUser,
    getUserFromEmail,
    setUserProfile,
    editProfile,
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


