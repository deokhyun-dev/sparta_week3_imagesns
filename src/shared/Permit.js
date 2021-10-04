import React from "react";
import { useSelector } from "react-redux";
import { apiKey } from "./firebase";

const Permit = props => {
    const is_login = useSelector(state => state.user.is_login);
    console.log(is_login, "퍼밋컴포넌트");
    const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
    const is_session = sessionStorage.getItem(_session_key) ? true : false;
    console.log(is_login, is_session);

    if (is_session && is_login) {
        return <React.Fragment>{props.children}</React.Fragment>;
    }
    return null;
};

export default Permit;
