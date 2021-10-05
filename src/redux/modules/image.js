import { createAction, handleActions } from "redux-actions";
import produce from "immer";

import { storage } from "../../shared/firebase";

const UPLOADING = "UPLOADING";
const UPLOAD_IMAGE = "UPLOAD";
const SET_PREVIEW = "SET_PREVIEW";

const uploading = createAction(UPLOADING, uploading => ({ uploading }));
const uploadImage = createAction(UPLOAD_IMAGE, image_url => ({ image_url }));
const setPreview = createAction(SET_PREVIEW, preview => ({ preview }));

function uploadImageFB(image) {
    return function (dispatch, getState, { history }) {
        dispatch(uploading(true));
        const _upload = storage.ref(`images/${image.name}`).put(image);

        _upload
            .then(snapshot => {
                snapshot.ref.getDownloadURL().then(url => {
                    dispatch(uploadImage(url));
                });
            })
            .catch(err => {
                dispatch(uploading(false));
            });
    };
}

const initialState = {
    image_url:
        "https://media.gq.com/photos/5de80a645bb28e00087aa152/master/w_1600%2Cc_limit/05-Omega-Seamaster-Diver-300M-007-James-Bond-Watch-gq-december-2019.jpg",
    uploading: false,
    preview: null,
};

export default handleActions(
    {
        [UPLOAD_IMAGE]: (state, action) =>
            produce(state, draft => {
                draft.image_url = action.payload.image_url;
                draft.uploading = false;
            }),

        [UPLOADING]: (state, action) =>
            produce(state, draft => {
                draft.uploading = action.payload.uplaoding;
            }),
        [SET_PREVIEW]: (state, action) =>
            produce(state, draft => {
                draft.preview = action.payload.preview;
            }),
    },
    initialState
);

const actionCreators = {
    uploadImageFB,
    uploadImage,
    setPreview,
};

export { actionCreators };
