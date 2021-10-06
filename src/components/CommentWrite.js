import React, { useEffect, useState } from "react";

import { Grid, Input, Button } from "../elements";
import { useDispatch } from "react-redux";
import { actionCreators as commentActions } from "../redux/modules/comment";

const CommentWrite = props => {
    const [comments, setComments] = useState("");
    const { post_id } = props;
    const dispatch = useDispatch();
    console.log(comments);

    const write = () => {
        dispatch(commentActions.addCommentFB(post_id, comments));
        setComments("");
    };

    return (
        <React.Fragment>
            <Grid padding="16px" is_flex>
                <Input
                    _onChange={e => {
                        setComments(e.target.value);
                    }}
                    placeholder="댓글 내용을 입력해주세요 :)"
                    value={comments}
                    onSubmit={write}
                    is_submit
                />
                <Button width="50px" margin="0px 2px 0px 2px" _onClick={write}>
                    작성
                </Button>
            </Grid>
        </React.Fragment>
    );
};

export default CommentWrite;
