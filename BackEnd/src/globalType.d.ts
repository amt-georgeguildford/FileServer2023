declare global{
    namespace Express{
        interface Request{
            payload: jwt.JwtPayload | undefined;
            accessToken: string;
            userInfo: {
                id: string;
                firstname: string;
                lastname: string;
                email: string;
                role: string
            }
        }
    }
}

export {}