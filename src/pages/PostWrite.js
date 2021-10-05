import React, { useEffect, useState } from "react";
import { useSelector, useDispatch, useHistory } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
import { actionCreators as imageActions } from "../redux/modules/image";

import { Grid, Text, Button, Image, Input } from "../elements";
import Upload from "../shared/Upload";

const PostWrite = props => {
    // 글쓰기 페이지에서 로그인 여부를 확인해서
    // 로그인 ? 글쓰기 보여주기 : 안보여주기
    // 로그인 체크를 state.user.is-login만으로 하는 이유는 이미 App.js에서 세션체크를 했기 때문.
    const dispatch = useDispatch();
    const is_login = useSelector(state => state.user.is_login);
    const preview = useSelector(state => state.image.preview);
    const post_list = useSelector(state => state.post.list);

    const post_id = props.match.params.id;

    const is_edit = post_id ? true : false;

    const { history } = props;

    const _post = is_edit ? post_list.find(p => p.id === post_id) : null;

    const [contents, setContents] = useState(_post ? _post.contents : "");

    useEffect(() => {
        if (is_edit && !_post) {
            window.alert("포스트 정보가 없어요!");
            history.goBack();
            return;
        }

        if (is_edit) {
            dispatch(imageActions.setPreview(_post.image_url));
        }
    }, []);

    const changeContent = e => {
        setContents(e.target.value);
    };

    const addPost = () => {
        dispatch(postActions.addPostFB(contents));
        history.replace("/");
    };

    const editPost = () => {
        dispatch(postActions.editPostFB(post_id, { contents: contents }));
    };

    if (!is_login) {
        return (
            <Grid margin="100px 0px" padding="16px" center>
                <Text size="32px" bold>
                    앗 잠깐!
                </Text>
                <Text size="16px" bold>
                    로그인 후에만 글을 쓸 수 있어요!
                </Text>
                <Button _onClick={() => history.replace("/login")}>
                    로그인
                </Button>
            </Grid>
        );
    }
    return (
        <React.Fragment>
            <Grid padding="16px">
                <Text margin="0px" size="36px" bold>
                    {is_edit ? "게시글 수정" : "게시글 작성"}
                </Text>
                <Upload />
            </Grid>

            <Grid>
                <Grid padding="16px">
                    <Text margin="0px" size="24px" bold>
                        미리보기
                    </Text>
                </Grid>

                <Image
                    src={
                        preview
                            ? preview
                            : "https://pyxis.nymag.com/v1/imgs/949/b6c/f0aa0346a0b0aeda3a8451644c42cb582e-no-time-to-die.rsquare.w1200.jpg"
                    }
                    shape="rectangle"
                />
            </Grid>

            <Grid padding="16px">
                <Input
                    value={contents}
                    label="게시글 내용"
                    placeholder="게시글 작성"
                    multiLine
                    _onChange={changeContent}
                />
            </Grid>

            <Grid padding="16px">
                {is_edit ? (
                    <Button text="게시글 수정" _onClick={editPost}></Button>
                ) : (
                    <Button text="게시글 작성" _onClick={addPost}></Button>
                )}
            </Grid>
        </React.Fragment>
    );
};

export default PostWrite;
