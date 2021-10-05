import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, storage } from "../../shared/firebase";
import moment from "moment";
import { actionCreators as imageActions } from "./image";

const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";

const setPost = createAction(SET_POST, post_list => ({ post_list }));
const addPost = createAction(ADD_POST, post => ({ post }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({
    post_id,
    post,
}));

const initialState = {
    list: [],
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
        postDB
            .doc(post_id)
            .update(post)
            .then(doc => {
                dispatch(editPost(post_id, { ...post }));
                history.replace("/");
            });
    };
};

const getPostFB = () => {
    return function (dispatch, getState, { history }) {
        const postDB = firestore.collection("post");
        let post_list = [];

        postDB.get().then(docs => {
            docs.forEach(doc => {
                let _post = doc.data();

                // JS고수의 방법
                let post = Object.keys(_post).reduce(
                    (acc, cur) => {
                        if (cur.indexOf("user") !== -1) {
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
                // ㄴ z키값들이 배열로 들어감

                // let post = {
                //     id: doc.id,
                //     user_info: {
                //         user_name: _post.user_name,
                //         user_profile: _post.user_profile,
                //         user_id: _post.user_id,
                //     },
                //     image_url: _post.image_url,
                //     contents: _post.contents,
                //     comment_cnt: _post.comment_cnt,
                //     insert_dt: _post.insert_dt,
                // };
                post_list.push(post);
            });

            dispatch(setPost(post_list));
        });
    };
};

export default handleActions(
    {
        [SET_POST]: (state, action) =>
            produce(state, draft => {
                draft.list = action.payload.post_list;
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
    },
    initialState
);

const actionCreators = {
    setPost,
    addPost,
    getPostFB,
    addPostFB,
    editPostFB,
};

export { actionCreators };
