const saveToken = async ({accessToken, refreshToken}:{accessToken: string, refreshToken:string}) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
}

export default saveToken