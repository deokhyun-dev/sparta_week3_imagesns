import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { history } from "../redux/configureStore";
import { actionCreators as userActions } from "../redux/modules/user";
import { apiKey } from "../shared/firebase";

import { Grid, Button } from "../elements/";

function Header() {
  const dispatch = useDispatch();
  const is_login = useSelector(state => state.user.is_login);

  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
  // const is_login = sessionStorage.getItem(_session_key);

  const is_session = sessionStorage.getItem(_session_key) ? true : false;

  if (is_login && is_session) {
    return (
      <>
        <React.Fragment>
          <Grid is_flex padding="5px 5px">
            <Grid>
              <Button
                _onClick={() => {
                  history.push("/");
                }}
                margin="0px 0px 0px 5px"
                size="10px"
                width="50px"
              >
                007
              </Button>
            </Grid>

            <Grid is_flex padding="5px 5px">
              <Button
                _onClick={() => {
                  history.push("/login");
                }}
                margin="0px 5px"
                size="10px"
                text="알림"
                _onClick={() => {
                  history.push("/noti");
                }}
                bold
              ></Button>
              <Button
                _onClick={() => {}}
                margin="0px 5px"
                size="10px"
                text="내정보"
                bold
              ></Button>
              <Button
                _onClick={() => {
                  dispatch(userActions.logoutFB());
                }}
                margin="0px 5px"
                size="10px"
                text="로그아웃"
                bold
              ></Button>
            </Grid>
          </Grid>
        </React.Fragment>
      </>
    );
  }

  return (
    <>
      <React.Fragment>
        <Grid is_flex padding="5px 5px">
          <Grid>
            <Button
              _onClick={() => {
                history.push("/");
              }}
              margin="0px"
              size="10px"
              width="50px"
            >
              007
            </Button>
          </Grid>

          <Grid is_flex padding="5px 5px">
            <Button
              _onClick={() => {
                history.push("/login");
              }}
              margin="0px 5px"
              size="10px"
              text="로그인"
              bold
            ></Button>
            <Button
              _onClick={() => {
                history.push("/signup");
              }}
              margin="0px"
              size="10px"
              text="회원가입"
              bold
            ></Button>
          </Grid>
        </Grid>
      </React.Fragment>
    </>
  );
}

Header.defaultProps = {};

export default Header;
