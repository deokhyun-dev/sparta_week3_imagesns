import React from "react";
// import Grid from "../elements/Grid";
// import Image from "../elements/Image";
// import Text from "../elements/Text";

import { Grid, Image, Text, Button } from "../elements";
import { history } from "../redux/configureStore";
import { useSelector } from "react-redux";

const Post = props => {
    return (
        <React.Fragment>
            <Grid margin="0px 0px 10px 0px">
                <Grid is_flex padding="16px">
                    <Grid is_flex width="auto">
                        <Image shape="circle" src={props.src} />
                        <Text bold>{props.user_info.user_name}</Text>
                    </Grid>
                    <Grid is_flex width="auto">
                        {props.is_me && (
                            <Button
                                width="auto"
                                padding="4px"
                                margin="4px"
                                _onClick={() =>
                                    history.push(`/write/${props.id}`)
                                }
                            >
                                수정
                            </Button>
                        )}
                        <Text>{props.insert_dt}</Text>
                    </Grid>
                </Grid>
                <Grid padding="16px">
                    <Text>{props.contents}</Text>
                </Grid>
                <Grid>
                    <Image shape="rectangle" src={props.image_url} />
                </Grid>
                <Grid padding="16px">
                    <Text margin="0px" bold>
                        댓글 {props.comment_cnt}개
                    </Text>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

Post.defaultProps = {
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
    is_me: false,
};

export default Post;
