import { createAction, handleActions } from "react-actions";
import produce from "immer";
import "moment";
import moment from "moment";
import { firestore } from "../../shared/firebase";

const SET_COMMENT = "SET_COMMENT";
const ADD_COMMENT = "ADD_COMMENT";
const LOADING = "LOADING";

const initialState = {};

const setComment = createAction(SET_COMMENT, (post_id, comment_list) => ({
    post_id,
    comment_list,
}));
const addComment = createAction(ADD_COMMENT, (post_id, comment) => ({
    post_id,
    comment,
}));
const loading = createAction(LOADING, is_loading => ({ is_loading }));

const setCommnetFB = () => {
    return function (dispatch, getState, { history }) {
        return null;
    };
};

export default handleActions({
    [SET_COMMENT]: (state, action) =>
        produce(state, draft => {
            draft.comment_list = action.payload.comment_list;
        }),
    [ADD_COMMENT]: (state, action) =>
        produce(state, draft => {
            draft.comment.push(action.payload.comment);
        }),
});
