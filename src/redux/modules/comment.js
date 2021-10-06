import { createAction, handleActions } from "redux-actions";
import produce from "immer";
import "moment";
import moment from "moment";
import { firestore } from "../../shared/firebase";

const SET_COMMENT = "SET_COMMENT";
const ADD_COMMENT = "ADD_COMMENT";
const LOADING = "LOADING";

const initialState = {
    list: {},
    is_loading: false,
};

const setComment = createAction(SET_COMMENT, (post_id, comment_list) => ({
    post_id,
    comment_list,
}));
const addComment = createAction(ADD_COMMENT, (post_id, comment) => ({
    post_id,
    comment,
}));
const loading = createAction(LOADING, is_loading => ({ is_loading }));

const setCommentFB = post_id => {
    return function (dispatch, getState, { history }) {
        if (!post_id) {
            return;
        }
        const commentDB = firestore.collection("comment");

        commentDB
            .where("post_id", "==", post_id)
            .orderBy("insert_dt", "desc")
            .get()
            .then(docs => {
                let list = [];
                docs.forEach(doc => {
                    list.push({ ...doc.data(), id: doc.id });
                });
                console.log(list, "commentFB");
                dispatch(setComment(post_id, list));
            })
            .catch(err => {
                console.log("댓글 못가져옴", err);
            });
    };
};

export default handleActions(
    {
        [SET_COMMENT]: (state, action) =>
            produce(state, draft => {
                // comment는 딕셔너리 구조로 만들어서,
                // post_id로 나눠 보관합시다! (각각 게시글 방을 만들어준다고 생각하면 구조 이해가 쉬워요.)
                draft.list[action.payload.post_id] =
                    action.payload.comment_list;
                console.log(draft.list, "리듀서");
            }),
        [ADD_COMMENT]: (state, action) =>
            produce(state, draft => {
                draft.comment.push(action.payload.comment);
            }),
        [LOADING]: (state, action) =>
            produce(state, draft => {
                draft.is_loading = action.payload.is_loading;
            }),
    },
    initialState
);

const actionCreators = {
    setComment,
    addComment,
    setCommentFB,
};

export { actionCreators };
