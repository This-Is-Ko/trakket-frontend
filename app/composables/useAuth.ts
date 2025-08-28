import api from "./../services/api";

async function signup(usernameParam: string, email: string, password: string) {
    try {
        await api.post("/api/auth/signup", {
            username: usernameParam,
            email: email,
            password: password,
        });
    } catch (err: any) {
        const msg = err.response?.data?.message || "Signup failed. Please try again.";
        throw new Error(msg);
    }
}

async function verifyOtp(email: string, otp: string) {
    try {
        await api.post("/api/auth/otp/verify", {
            email: email,
            otp: otp,
        });
    } catch (err: any) {
        const msg = err.response?.data?.message || "OTP verification failed. Please try again.";
        throw new Error(msg);
    }
}

async function resendOtp(email: string) {
    try {
        await api.post("/api/auth/otp/resend", {
            email: email
        });
    } catch (err: any) {
        const msg = err.response?.data?.message || "Failed to resend OTP. Please try again.";
        throw new Error(msg);
    }
}

export function useAuth() {
    return {
        signup,
        verifyOtp,
        resendOtp
    };
}