import React from "react";
import { Grid, Image, Text } from "../elements";

const Card = props => {
    const { image_url, user_name, post_id } = props;
    return (
        <Grid padding="16px" is_flex bg="#ffffff" margin="8px 0px">
            <Grid width="auto" margin="0px 8px 0px 8px">
                <Image src={image_url} size={85} shape="square" />
            </Grid>
            <Grid>
                <Text>
                    <b>{user_name}</b> 님이 게시물을 남겼습니다. :)
                </Text>
            </Grid>
        </Grid>
    );
};

Card.defaultProps = {
    image_url:
        "https://www.007.com/wp-content/uploads/2020/05/B25_11846_RC.jpg",
};

export default Card;
