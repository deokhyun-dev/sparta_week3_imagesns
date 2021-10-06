import produce from "immer";
import { createAction, handleActions } from "redux-actions";
import { firestore } from "../../shared/firebase";
import "moment";
import moment from "moment";
import firebase from "firebase/app";
import { actionCreators as postActions } from "../modules/post";

const ADD_LIKE = "ADD_LIKE";
const SUB_LIKE = "SUB_LIKE";

const initialState = {
    list: [],
    is_loading: false,
};

const addLike = createAction(ADD_LIKE, post_id => ({ post_id }));
const subLike = createAction(SUB_LIKE, post_id => ({ post_id }));

const addLikeFB = post_id => {
    return function (dispatch, getState, { history }) {
        const likeDB = firestore.collection("like");
        const user_info = getState().user.user;

        let like = {
            post_id: post_id,
            user_id: user_info.uid,
            insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
        };

        likeDB.add(like).then(doc => {
            const postDB = firestore.collection("post");
            like = { ...like, id: doc.id };

            const post = getState().post.list.find(p => p.id === post_id);
            const increment = firebase.firestore.FieldValue.increment(1);

            postDB
                .doc(post_id)
                .update({ like_cnt: increment })
                .then(_post => {
                    dispatch(addLike(post_id));
                    dispatch(
                        postActions.editPost(post_id, {
                            like_cnt: parseInt(post.like_cnt) + 1,
                        })
                    );
                });
        });
    };
};

export default handleActions(
    {
        [ADD_LIKE]: (state, action) => produce(state, draft => {}),
    },
    initialState
);

const actionCreators = {
    addLike,
    addLikeFB,
};

export { actionCreators };
