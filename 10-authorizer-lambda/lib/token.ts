import * as jwt from 'jsonwebtoken';

export class Token {
    static generateToken(payload: object, secret: string, expiresIn: jwt.SignOptions['expiresIn']): string {
        const options: jwt.SignOptions = {
            expiresIn: expiresIn
        }
        return jwt.sign(payload, secret, options);
    }

    static verifyToken(token: string, secret: string): object | null {
        try {
            return jwt.verify(token, secret) as object;
        } catch (error) {
            console.error("Token verification failed:", error);
            return null;
        }
    }
}