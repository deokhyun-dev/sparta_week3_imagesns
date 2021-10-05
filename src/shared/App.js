import "./App.css";
import React, { useEffect } from "react";

import { BrowserRouter, Route } from "react-router-dom";

// 리덕스에서 쓰는 history 쓰게 만드는 세팅
import { ConnectedRouter } from "connected-react-router";
import { history } from "../redux/configureStore";

import PostWrite from "../pages/PostWrite";
import PostDetail from "../pages/PostDetail";
import PostList from "../pages/PostList";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Search from "./Searh";
import Notification from "../pages/Notification";

import Permit from "./Permit";
import Header from "../components/Header";
import { Button, Grid } from "../elements";

import { apiKey } from "./firebase";
import {
    actionCreators as userActions,
    loginCheckFB,
} from "../redux/modules/user";
import { useDispatch } from "react-redux";

function App() {
    const dispatch = useDispatch();
    const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
    const is_session = sessionStorage.getItem(_session_key) ? true : false;

    useEffect(() => {
        dispatch(userActions.loginCheckFB());
    }, []);

    return (
        <React.Fragment>
            <Grid>
                <Header></Header>
                <ConnectedRouter history={history}>
                    <Route path="/" exact component={PostList} />
                    <Route path="/login" exact component={Login} />
                    <Route path="/signup" exact component={Signup} />
                    <Route path="/write" exact component={PostWrite} />
                    <Route path="/write/:id" exact component={PostWrite} />
                    <Route path="/post/:id" exact component={PostDetail} />
                    <Route path="/search" exact component={Search} />
                    <Route path="/noti" exact component={Notification} />
                </ConnectedRouter>
            </Grid>
            <Permit>
                <Button
                    is_float
                    text="+"
                    _onClick={() => history.push("/write")}
                ></Button>
            </Permit>
        </React.Fragment>
    );
}

export default App;
