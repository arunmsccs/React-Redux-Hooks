import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false,
    authRedirectPath: '/'
};

const setAuthRedirectPath = (state, action) => {
    return updateObject(state, {authRedirectPath: action.path })
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START:
            return updateObject(state, { error : null, loading: true });
        
        case actionTypes.AUTH_SUCCESS:
            return updateObject( state, {
                token: action.idToken,
                userId: action.userId,
                error: null,
                loading: false 
            });

        case actionTypes.AUTH_FAIL:
            return updateObject (state, {
                 error: action.error,
                 loading: false   
            });
           
        case actionTypes.AUTH_LOGOUT:
            return updateObject(state, {
                token: null, 
                userId: null });

        case actionTypes.SET_AUTH_REDIRECT_PATH:     
                return setAuthRedirectPath(state, action);
             
        default:
            return state;          
    }

}

export default reducer;