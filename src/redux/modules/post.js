import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";

const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";

const setPost = createAction(SET_POST, post_list => ({ post_list }));
const addPost = createAction(ADD_POST, post => ({ post }));

const initialState = {
    list: [],
};

const initialPost = {
    id: 0,
    user_info: {
        user_name: "다니엘",
        user_profile:
            "https://www.007.com/wp-content/uploads/2020/05/B25_11846_RC.jpg",
    },
    image_url:
        "https://www.007.com/wp-content/uploads/2020/05/B25_11846_RC.jpg",
    contents: "노타임투다이",
    comment_cnt: 10,
    insert_dt: "2021-02-27 10:00:00",
};

export default handleActions(
    {
        [SET_POST]: (state, action) => produce(state, draft => {}),

        [ADD_POST]: (state, action) => produce(state, draft => {}),
    },
    initialState
);

const actionCreators = {
    setPost,
    addPost,
};

export { actionCreators };
