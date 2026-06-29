export interface VerifyEmailInputInterface {
    email: string;
    code: string;
}

export interface PendingRegistration {
    username: string;
    name: string;
    email: string;
    passwordHash: string;
    bornAt: string;
    code: string;
}
