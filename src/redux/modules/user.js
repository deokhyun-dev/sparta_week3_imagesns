import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { setCookie, getCookie, deleteCookie } from "../../shared/Cookie";
import { auth } from "../../shared/firebase";
import firebase from "firebase/app";

// 리덕스 만드는 순서
// 1. 액션타입만들기
// 2. 액션 생성함수 만들기
// 3. initialSttate 만들기

//액션 타입 만들기
const LOG_OUT = "LOG_OUT";
const GET_USER = "GET_USER";
const SET_USER = "SET_USER";

//액션생성함수들 만들기

const logOut = createAction(LOG_OUT, user => ({ user }));
const getUser = createAction(GET_USER, user => ({ user }));
const setUser = createAction(SET_USER, user => ({ user }));
// const logIn = user => {
//     return {
//         type: LOG_IN,
//         user
//     }
// }

// initialState 만들기
const initialState = {
    user: null,
    is_login: false,
};

// middleware actions
const loginFB = (id, pwd) => {
    return function (dispatch, getState, { history }) {
        auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(
            res => {
                auth.signInWithEmailAndPassword(id, pwd)
                    .then(user => {
                        console.log(user);

                        dispatch(
                            setUser({
                                user_name: user.user.displayName,
                                id: id,
                                user_profile: "",
                                uid: user.user.uid,
                            })
                        );

                        history.push("/");
                    })
                    .catch(error => {
                        var errorCode = error.code;
                        var errorMessage = error.message;

                        console.log(errorCode, errorMessage);
                    });
            }
        );
    };
};

const loginCheckFB = () => {
    return function (dispatch, getState, { history }) {
        auth.onAuthStateChanged(user => {
            if (user) {
                dispatch(
                    setUser({
                        user_name: user.displayName,
                        user_profile: "",
                        id: user.email,
                        uid: user.uid,
                    })
                );
            } else {
                dispatch(logOut());
            }
        });
    };
};

const logoutFB = () => {
    return function (dispatch, getState, { history }) {
        auth.signOut().then(() => {
            dispatch(logOut());
            history.replace("/");
        });
    };
};

const signupFB = (id, pwd, user_name) => {
    return function (dispatch, getState, { history }) {
        auth.createUserWithEmailAndPassword(id, pwd)
            .then(user => {
                auth.currentUser
                    .updateProfile({
                        displayName: user_name,
                    })
                    .then(() => {
                        dispatch(
                            setUser({
                                user_name: user_name,
                                id: id,
                                user_profile: "",
                                uid: user.user.uid,
                            })
                        );
                        history.push("/");
                    })
                    .catch(error => {
                        console.log(error);
                    });

                // Signed in
                // ...
            })
            .catch(error => {
                var errorCode = error.code;
                var errorMessage = error.message;

                console.log(errorCode, errorMessage);
                // ..
            });
    };
};

//이전 리듀서를 이렇게 만들었다면
// const reducer = (state, action) => {
//     switch (action.type) {
//         case "LOG_IN": {
//             state.user === action.user;
//         }
//         default: {
//             return state;
//         }
//     }
// };

// 이제는 이렇게 간편하게 만들면됨!
// reducer 만들기
// const reducer = handleActions(
//     {
//         [LOG_IN]: (state, action) => {},
//     },
//     {}
// );

// immer(produce) 로직
// A={a,b,c}를 받으면 A'를 복사해서 A.a = b라고 수정하면 복사본에서 알아서 만들어줌
export default handleActions(
    {
        // draft에 복사본이 들어옴
        [SET_USER]: (state, action) =>
            produce(state, draft => {
                // 복사본에서 수정하고 싶은 것들 하면 됨
                // action.변수명으로 들어왔던 것들이 action.payload.변수명 으로 들어옴
                setCookie("is_login", "success");
                draft.user = action.payload.user;
                draft.is_login = true;
            }),
        [LOG_OUT]: (state, action) => {
            produce(state, draft => {
                deleteCookie("is_login");
                draft.user = null;
                draft.is_login = false;
            });
        },
        [GET_USER]: (state, action) => {
            produce(state, draft => {});
        },
    },
    initialState
);

const actionCreators = {
    logOut,
    getUser,
    signupFB,
    loginFB,
    loginCheckFB,
    logoutFB,
};

export { actionCreators };
