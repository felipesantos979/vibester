export interface RegisterInputInterface {
    username: string;
    name: string;
    email: string;
    password: string;
    bornAt: Date;
}

export interface LoginInputInterface {
    email?: string;
    username?: string;
    password: string; 
}

export interface RegisterOutputInterface {
    authId: string;
    accountId: string;
    username: string;
    name: string;
    email: string;
    bornAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface LoginOutputInterface {
    authId: string;
    token: string;
    accountId: string;
}