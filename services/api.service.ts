import { API_CONFIG, API_ENDPOINTS } from '../constants/Config';

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

export interface SendOTPRequest {
    phoneNumber: string;
}

export interface SendOTPResponse {
    success: boolean;
    message: string;
    expiresAt: string;
}

export interface VerifyOTPRequest {
    phoneNumber: string;
    otp: string;
    deviceFingerprint?: string;
    fcmToken?: string;
}

export interface VerifyOTPResponse {
    success: boolean;
    isNewUser: boolean;
    user: {
        id: number;
        phoneNumber: string;
        fullName?: string;
        email?: string;
        profileImageUrl?: string;
    };
    tokens: {
        accessToken: string;
        firebaseToken: string;
    };
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    user: {
        id: number;
        phoneNumber: string;
        fullName?: string;
        email?: string;
        username?: string;
        profileImageUrl?: string;
    };
    tokens: {
        accessToken: string;
        firebaseToken: string;
    };
}

class ApiService {
    private baseURL: string;
    private timeout: number;

    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.timeout = API_CONFIG.TIMEOUT;
    }

    /**
     * Generic fetch wrapper with timeout and error handling
     */
    private async fetchWithTimeout(
        url: string,
        options: RequestInit = {}
    ): Promise<Response> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error: any) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        }
    }

    /**
     * Generic API request method
     */
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const url = `${this.baseURL}${endpoint}`;

            const response = await this.fetchWithTimeout(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || `HTTP ${response.status}: ${response.statusText}`,
                };
            }

            return {
                success: true,
                data,
            };
        } catch (error: any) {
            console.error('API Request Error:', error);
            return {
                success: false,
                error: error.message || 'Network request failed',
            };
        }
    }

    /**
     * Send OTP to phone number
     */
    async sendOTP(phoneNumber: string): Promise<ApiResponse<SendOTPResponse>> {
        return this.request<SendOTPResponse>(API_ENDPOINTS.SEND_OTP, {
            method: 'POST',
            body: JSON.stringify({ phoneNumber }),
        });
    }

    /**
     * Verify OTP and authenticate user
     */
    async verifyOTP(
        phoneNumber: string,
        otp: string,
        deviceFingerprint?: string,
        fcmToken?: string
    ): Promise<ApiResponse<VerifyOTPResponse>> {
        return this.request<VerifyOTPResponse>(API_ENDPOINTS.VERIFY_OTP, {
            method: 'POST',
            body: JSON.stringify({
                phoneNumber,
                otp,
                deviceFingerprint: deviceFingerprint || 'mobile-app',
                fcmToken,
            }),
        });
    }

    /**
     * Login with username and password
     */
    async login(
        username: string,
        password: string
    ): Promise<ApiResponse<LoginResponse>> {
        return this.request<LoginResponse>(API_ENDPOINTS.LOGIN, {
            method: 'POST',
            body: JSON.stringify({
                username,
                password,
            }),
        });
    }

    /**
     * Update user profile
     */
    async updateProfile(
        token: string,
        data: { fullName?: string; email?: string; username?: string; password?: string }
    ): Promise<ApiResponse> {
        return this.request(API_ENDPOINTS.UPDATE_PROFILE, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
    }

    /**
     * Change password (client sends hashed passwords)
     */
    async changePassword(
        token: string,
        oldPassword: string,
        newPassword: string
    ): Promise<ApiResponse> {
        return this.request(API_ENDPOINTS.CHANGE_PASSWORD, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ oldPassword, newPassword }),
        });
    }

    /**
     * Get user profile
     */
    async getProfile(token: string): Promise<ApiResponse> {
        return this.request(API_ENDPOINTS.GET_PROFILE, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    /**
     * Check username availability
     */
    async checkUsernameAvailability(username: string): Promise<ApiResponse<{ available: boolean }>> {
        const search = new URLSearchParams({ username });
        return this.request(API_ENDPOINTS.CHECK_USERNAME + `?${search.toString()}`, {
            method: 'GET',
        });
    }

    /**
     * Upload profile image
     */
    async uploadProfileImage(token: string, imageUri: string): Promise<ApiResponse> {
        const formData = new FormData();
        formData.append('image', {
            uri: imageUri,
            type: 'image/jpeg',
            name: 'profile.jpg',
        } as any);

        return this.request(API_ENDPOINTS.UPLOAD_PROFILE_IMAGE, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            body: formData as any,
        });
    }

    /**
     * Get wallet balance
     */
    async getWalletBalance(token: string): Promise<ApiResponse> {
        return this.request(API_ENDPOINTS.GET_BALANCE, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    /**
     * Get transactions
     */
    async getTransactions(
        token: string,
        params: {
            limit?: number;
            offset?: number;
            status?: string;
            type?: string;
            startDate?: string;
            endDate?: string;
        } = {}
    ): Promise<ApiResponse> {
        const searchParams = new URLSearchParams();
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.offset) searchParams.append('offset', params.offset.toString());
        if (params.status) searchParams.append('status', params.status);
        if (params.type) searchParams.append('type', params.type);
        if (params.startDate) searchParams.append('startDate', params.startDate);
        if (params.endDate) searchParams.append('endDate', params.endDate);

        const queryString = searchParams.toString();

        return this.request(
            `${API_ENDPOINTS.GET_TRANSACTIONS}${queryString ? `?${queryString}` : ''}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    }

    /**
     * Get wallet transaction history
     */
    async getWalletHistory(
        token: string,
        limit: number = 50,
        offset: number = 0
    ): Promise<ApiResponse> {
        const searchParams = new URLSearchParams({
            limit: String(limit),
            offset: String(offset),
        });

        return this.request(`${API_ENDPOINTS.WALLET_HISTORY}?${searchParams.toString()}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    /**
     * Send money
     */
    async sendMoney(
        token: string,
        data: {
            receiverPhone?: string;
            receiverId?: string;
            amount: number;
            description?: string;
        }
    ): Promise<ApiResponse> {
        return this.request(API_ENDPOINTS.SEND_MONEY, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
    }

    /**
     * Logout
     */
    async logout(token: string): Promise<ApiResponse> {
        return this.request(API_ENDPOINTS.LOGOUT, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}

export default new ApiService();
