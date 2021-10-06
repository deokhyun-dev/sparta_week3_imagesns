import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, storage } from "../../shared/firebase";
import moment from "moment";
import { actionCreators as imageActions } from "./image";

const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";
const LOADING = "LOADING";

const setPost = createAction(SET_POST, (post_list, paging) => ({
    post_list,
    paging,
}));
const addPost = createAction(ADD_POST, post => ({ post }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({
    post_id,
    post,
}));
const loading = createAction(LOADING, is_loading => ({ is_loading }));

const initialState = {
    list: [],
    paging: { start: null, next: null, size: 3 },
    is_loading: false,
};

const initialPost = {
    // id: 0,
    // user_info: {
    //     user_name: "다니엘",
    //     user_profile:
    //         "https://www.007.com/wp-content/uploads/2020/05/B25_11846_RC.jpg",
    // },
    image_url:
        "https://www.007.com/wp-content/uploads/2020/05/B25_11846_RC.jpg",
    contents: "노타임투다이",
    comment_cnt: 0,
    insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
};

const addPostFB = (contents = "") => {
    return function (dispatch, getState, { history }) {
        const postDB = firestore.collection("post");
        const _image = getState().image.preview;
        const _user = getState().user.user;

        const user_info = {
            user_name: _user.user_name,
            user_id: _user.uid,
            user_profile: _user.user_profile,
        };
        const _post = {
            ...initialPost,
            contents: contents,
            insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
        };

        const _upload = storage
            .ref(`images/${user_info.user_id}_${new Date().getTime()}`)
            .putString(_image, "data_url");

        _upload.then(snapshot => {
            snapshot.ref
                .getDownloadURL()
                .then(url => {
                    return url;
                    // return 값이 다음 then 인자로 들어간다.
                })
                .then(url => {
                    postDB
                        .add({ ...user_info, ..._post, image_url: url })
                        .then(doc => {
                            let post = {
                                user_info,
                                ..._post,
                                id: doc.id,
                                image_url: url,
                            };
                            dispatch(addPost(post));
                            history.replace("/");
                            dispatch(imageActions.setPreview(null));

                            // 업로드가 완료된 후 에 state.image.preview에 있던 값을 null로 변경해줘야함
                        })
                        .catch(error => {
                            window.alert("포스트 작성 에러");
                            console.log("작성에 실패했어요", error);
                        });
                })
                .catch(err => {
                    window.alert("이미지 업로드 에러");
                    console.log("앗 이미지 업로드에 문제가 있어요", err);
                });
        });
    };
};

const editPostFB = (post_id = null, post = {}) => {
    return function (dispatch, getState, { history }) {
        if (!post_id) {
            console.log("게시물 정보가 없어요!");
            return;
        }

        const _image = getState().image.preview;

        const _post_idx = getState().post.list.findIndex(p => p.id === post_id);
        const _post = getState().post.list[_post_idx];

        const postDB = firestore.collection("post");

        if (_image === _post.image_url) {
            postDB
                .doc(post_id)
                .update(post)
                .then(doc => {
                    dispatch(editPost(post_id, { ...post }));
                    history.replace("/");
                });
        } else {
            const user_id = getState().user.user.uid;
            const _upload = storage
                .ref(`images/${user_id}_${new Date().getTime()}`)
                .putString(_image, "data_url");

            _upload.then(snapshot => {
                snapshot.ref
                    .getDownloadURL()
                    .then(url => {
                        console.log(url);
                        return url;
                    })
                    .then(url => {
                        postDB
                            .doc(post_id)
                            .update({ ...post, image_url: url })
                            .then(doc => {
                                dispatch(
                                    editPost(post_id, {
                                        ...post,
                                        image_url: url,
                                    })
                                );
                                history.replace("/");
                            });
                    })
                    .catch(err => {
                        window.alert("이미지 업로드 잣됨");
                        console.log("이미지 업로드 잣됨", err);
                    });
            });
        }
    };
};

const getPostFB = (start = null, size = 2) => {
    return function (dispatch, getState, { history }) {
        // state에서 페이징 정보 가져오기
        let _paging = getState().post.paging;

        // 시작정보가 기록되었는데 다음 가져올 데이터가 없다면? 앗, 리스트가 끝났겠네요!
        // 그럼 아무것도 하지말고 return을 해야죠!
        if (_paging.start && !_paging.next) {
            return;
        }

        // 가져오기 시작~!
        dispatch(loading(true));

        const postDB = firestore.collection("post");

        let query = postDB.orderBy("insert_dt", "desc");

        // 시작점 정보가 있으면? 시작점부터 가져오도록 쿼리 수정!
        if (start) {
            query = query.startAt(start);
        }

        // 사이즈보다 1개 더 크게 가져옵시다.
        // 3개씩 끊어서 보여준다고 할 때, 4개를 가져올 수 있으면? 앗 다음 페이지가 있겠네하고 알 수 있으니까요.
        // 만약 4개 미만이라면? 다음 페이지는 없겠죠! :)
        query
            .limit(size + 1)
            .get()
            .then(docs => {
                let post_list = [];

                // 새롭게 페이징 정보를 만들어줘요.
                // 시작점에는 새로 가져온 정보의 시작점을 넣고,
                // next에는 마지막 항목을 넣습니다.
                // (이 next가 다음번 리스트 호출 때 start 파라미터로 넘어올거예요.)
                let paging = {
                    start: docs.docs[0],
                    next:
                        docs.docs.length === size + 1
                            ? docs.docs[docs.docs.length - 1]
                            : null,
                    size: size,
                };

                docs.forEach(doc => {
                    let _post = doc.data();

                    let post = Object.keys(_post).reduce(
                        (acc, cur) => {
                            if (cur.indexOf("user_") !== -1) {
                                return {
                                    ...acc,
                                    user_info: {
                                        ...acc.user_info,
                                        [cur]: _post[cur],
                                    },
                                };
                            }
                            return { ...acc, [cur]: _post[cur] };
                        },
                        { id: doc.id, user_info: {} }
                    );

                    post_list.push(post);
                });

                //         let post_list = [];

                //         postDB.get().then(docs => {
                //             docs.forEach(doc => {
                //                 let _post = doc.data();

                //                 // JS고수의 방법
                //                 let post = Object.keys(_post).reduce(
                //                     (acc, cur) => {
                //                         if (cur.indexOf("user") !== -1) {
                //                             return {
                //                                 ...acc,
                //                                 user_info: {
                //                                     ...acc.user_info,
                //                                     [cur]: _post[cur],
                //                                 },
                //                             };
                //                         }

                //                         return { ...acc, [cur]: _post[cur] };
                //                     },
                //                     { id: doc.id, user_info: {} }
                //                 );
                //                 // ㄴ z키값들이 배열로 들어감

                //                 // let post = {
                //                 //     id: doc.id,
                //                 //     user_info: {
                //                 //         user_name: _post.user_name,
                //                 //         user_profile: _post.user_profile,
                //                 //         user_id: _post.user_id,
                //                 //     },
                //                 //     image_url: _post.image_url,
                //                 //     contents: _post.contents,
                //                 //     comment_cnt: _post.comment_cnt,
                //                 //     insert_dt: _post.insert_dt,
                //                 // };
                //                 post_list.push(post);
                //             });

                //             dispatch(setPost(post_list));
                //         });
                //     };
                // };

                // 마지막 하나는 빼줍니다.
                // 그래야 size대로 리스트가 추가되니까요!
                // 마지막 데이터는 다음 페이지의 유무를 알려주기 위한 친구일 뿐! 리스트에 들어가지 않아요!
                post_list.pop();

                dispatch(setPost(post_list, paging));
            });
    };
};

const getOnePostFB = id => {
    return function (dispatch, getState, { history }) {
        const postDB = firestore.collection("post");

        postDB
            .doc(id)
            .get()
            .then(doc => {
                let _post = doc.data();

                if (!_post) {
                    return;
                }
                let post = Object.keys(_post).reduce(
                    (acc, cur) => {
                        if (cur.indexOf("user_") !== -1) {
                            return {
                                ...acc,
                                user_info: {
                                    ...acc.user_info,
                                    [cur]: _post[cur],
                                },
                            };
                        }
                        return { ...acc, [cur]: _post[cur] };
                    },
                    { id: doc.id, user_info: {} }
                );
                dispatch(setPost([post], { start: null, next: null, size: 3 }));
            });
    };
};

export default handleActions(
    {
        [SET_POST]: (state, action) =>
            produce(state, draft => {
                draft.list.push(...action.payload.post_list);

                // 중복 post가 있다면 제거
                draft.list = draft.list.reduce((acc, cur) => {
                    // cur에 postlist값이 하나하나 들어올텐데
                    // postlist id와 cur id가 같은게 없으면 -1
                    // -1인 값만 acc에 넣어주기
                    if (acc.findIndex(a => a.id === cur.id) === -1) {
                        return [...acc, cur];
                    } else {
                        acc[acc.findIndex(a => a.id === cur.id)] = cur;
                        return acc;
                    }
                }, []);
                if (action.payload.paging) {
                    draft.paging = action.payload.paging;
                }
                // 로딩 끝나면 바꿔줘야지
                draft.is_loading = false;
            }),

        [ADD_POST]: (state, action) =>
            produce(state, draft => {
                draft.list.unshift(action.payload.post);
                // 목록페이지에서 온 게 아니라서 목록이 0개로 나온다.
            }),
        [EDIT_POST]: (state, action) =>
            produce(state, draft => {
                let idx = draft.list.findIndex(
                    p => p.id === action.payload.post_id
                );
                draft.list[idx] = {
                    ...draft.list[idx],
                    ...action.payload.post,
                };
            }),
        [LOADING]: (state, action) =>
            produce(state, draft => {
                draft.is_loading = action.payload.is_loading;
            }),
    },
    initialState
);

const actionCreators = {
    setPost,
    addPost,
    editPost,
    getPostFB,
    addPostFB,
    editPostFB,
    getOnePostFB,
};

export { actionCreators };
