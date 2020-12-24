const initState = {
    authError: null,
    isLogged: false,
		access_token:'', 
		api_key:'', 
		refresh_token:'', 
		account_id: '', 
		iam_id: '', 
		email: '', 
		name: '', 
		role: ''
}
const authReducer = (state = initState, action) => {
    switch(action.type){
        case 'LOGIN_ERROR':
            return {
                ...state,
                authError: action.message
            }
        case 'LOGIN_SUCCESS':
	
            return {
                ...state,
                authError: null, 
								isLogged: true,
                api_key: action.api_key,
                account_id: action.account_id,
                access_token: action.access_token,
                refresh_token: action.refresh_token,
                role: action.role,
                email: action.email,
                name: action.name,
                iam_id: action.iam_id,
            }
        case 'SIGN_OUT':
            return { 
                ...state,
                isLogged: false,
								access_token:'', 
								api_key:'', 
								refresh_token:'', 
								account_id: '', 
								email: '', 
								name: '', 
								iam_id: '', 
								role: ''
            }
        default:
            return state;
    }       
}

export default authReducer