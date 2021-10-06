import React from "react";
import { Grid } from "../elements";
import Card from "../components/Card";

const Notification = props => {
    let noti = [
        { user_name: "daniel", post_id: "post1" },
        { user_name: "daniel", post_id: "post2" },
        { user_name: "daniel", post_id: "post3" },
        { user_name: "daniel", post_id: "post4" },
        { user_name: "daniel", post_id: "post5" },
    ];
    return (
        <>
            <Grid padding="16px" bg="#EFF6FF">
                {noti.map(n => {
                    return <Card {...n} key={n.post_id} />;
                })}
            </Grid>
        </>
    );
};

export default Notification;
