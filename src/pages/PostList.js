// PostList.js
import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import Post from "../components/Post";
import { Button } from "../elements";

import { actionCreators as postActions } from "../redux/modules/post";
import InfinityScroll from "../shared/InfinityScroll";

const PostList = props => {
    const dispatch = useDispatch();
    const post_list = useSelector(state => state.post.list);
    const user_info = useSelector(state => state.user.user);
    const is_loading = useSelector(state => state.post.is_loading);
    const paging = useSelector(state => state.post.paging);

    useEffect(() => {
        // 게시글을 작성하는 시점에 게시글.length는 0이 아니다.
        // 0이 아니니까 새로 갖고 오지 않고 기존 배열에 추가해서 새로운 게시글이 가장 앞에 나오게 한다.

        dispatch(postActions.getPostFB());
    }, []);
    return (
        <React.Fragment>
            <InfinityScroll>
                {post_list.map((p, idx) => {
                    if (user_info && p.user_info.user_id === user_info.uid) {
                        return <Post key={p.id} {...p} is_me />;
                    } else {
                        return <Post key={p.id} {...p} />;
                    }
                })}
            </InfinityScroll>
            <Button
                _onClick={() => {
                    dispatch(postActions.getPostFB(paging.next));
                }}
            >
                추가로드
            </Button>
            ;
        </React.Fragment>
    );
};

export default PostList;
