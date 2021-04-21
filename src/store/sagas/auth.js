import { delay } from 'redux-saga/effects';
import { put, call } from 'redux-saga/effects';
import axios from 'axios';

import * as actions  from '../actions/index';

export function* logoutSaga(action) {
    yield call([localStorage, 'removeItem'], 'token');
    yield call([localStorage, 'removeItem'], 'expirationDate');
    yield call([localStorage, 'removeItem'], 'userId');
    yield put (actions.logoutSucceed());
}

export function* checkAuthTimeoutSaga(action) {
    yield delay(action.expirationTime);
    yield put(actions.logOut());
}

export function* authUserSaga(action) {
   yield put(actions.authStart());
        const authData = {
            email: action.email,
            password: action.password,
            returnSecureToken: true
        };
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDLjQNoFEqWbgzuSKLbvgW0hFqs08iKwCs';
        if(!action.isSignup){
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDLjQNoFEqWbgzuSKLbvgW0hFqs08iKwCs';
        }
        try{
            const response = yield axios.post(url, authData)
            const expirationDate = yield new Date(new Date().getTime() + response.data.expiresIn * 1000);
            yield localStorage.setItem('token', response.data.idToken);
            yield localStorage.setItem('expirationDate', expirationDate); 
            yield localStorage.setItem('userId', response.data.localId);
                yield put(actions.authSuccess(response.data.idToken, response.data.localId));
                yield put(actions.checkAuthTimeout(response.data.expiresIn));

        }
        catch(error) {
                yield put(action.authFail(error.response.data.error));
            }
}

export function* authCHeckStateSaga(action) {
    const token = yield localStorage.getItem('token');
        if(!token) {
            yield put(actions.logOut());
        }
        else {
            const expirationDate = yield new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                yield put(actions.logOut());
            }else {
                const userId = yield localStorage.getItem('userId');
                yield put(actions.authSuccess(token, userId));
                yield put(actions.checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
            }     
        }
}
