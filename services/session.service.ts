import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'instapay_access_token';
const FIREBASE_TOKEN_KEY = 'instapay_firebase_token';
const USER_KEY = 'instapay_user';

export interface StoredUser {
    username?: string;
    id?: number;
    phoneNumber?: string;
    fullName?: string;
    email?: string;
    profileImageUrl?: string;
}

export interface StoredTokens {
    accessToken?: string;
    firebaseToken?: string;
}

export const SessionService = {
    async saveSession(tokens: StoredTokens, user?: StoredUser) {
        if (tokens.accessToken) {
            await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken);
        }
        if (tokens.firebaseToken) {
            await SecureStore.setItemAsync(FIREBASE_TOKEN_KEY, tokens.firebaseToken);
        }
        if (user) {
            await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
        }
    },

    async getAccessToken() {
        return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    },

    async getUser(): Promise<StoredUser | null> {
        const raw = await SecureStore.getItemAsync(USER_KEY);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    },

    async clearSession() {
        await Promise.all([
            SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
            SecureStore.deleteItemAsync(FIREBASE_TOKEN_KEY),
            SecureStore.deleteItemAsync(USER_KEY),
        ]);
    },
};

export default SessionService;

