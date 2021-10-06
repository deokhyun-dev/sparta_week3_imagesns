import React, { useEffect, useState } from "react";
import Post from "../components/Post";
import CommentList from "../components/CommentList";
import CommentWrite from "../components/CommentWrite";

import { firestore } from "../shared/firebase";

import { useSelector } from "react-redux";

const PostDetail = props => {
    const post_list = useSelector(state => state.post.list);
    const user_info = useSelector(state => state.user.user);
    console.log(user_info, "유저인포");
    const id = props.match.params.id;

    const post_idx = post_list.findIndex(p => p.id === id);
    const post_data = post_list[post_idx];

    const [post, setPost] = useState(post_data ? post_data : null);

    useEffect(() => {
        if (post) {
            return;
        }
        const postDB = firestore.collection("post");
        postDB
            .doc(id)
            .get()
            .then(doc => {
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
                console.log(post, "포스트디테일");
                setPost(post);
            });
    }, []);

    return (
        <React.Fragment>
            {post && (
                <Post
                    {...post}
                    is_me={
                        post.user_info.user_id === user_info.uid ? true : false
                    }
                />
            )}
            <CommentWrite />
            <CommentList />
        </React.Fragment>
    );
};

export default PostDetail;
