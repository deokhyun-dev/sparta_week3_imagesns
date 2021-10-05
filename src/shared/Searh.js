import React, { useCallback } from "react";
import _ from "lodash";

const Search = () => {
    //디바운스
    // const debounce = _.debounce(k => console.log("디바운스 :::", k), 1000);
    // const keyPress = useCallback(debounce, []);

    // 쓰로틀링
    const throttle = _.throttle(k => console.log("쓰로틀! :::, k"), 1000);
    const keyPress = useCallback(throttle, []);

    //useCallback 쓰는 이유
    // 함수형 컴포넌트는 state가 변화될 때마다 리렌더링되는 데
    // 리렌더링 되면서 함수값들은 모두 초기화된다.
    // 함수를 어딘가 Memoizationg하는, 기억하는 Hook

    const onChange = e => {
        keyPress(e.target.value);
    };
    return (
        <div>
            <label>Search:</label>
            <input onChange={onChange} />
        </div>
    );
};

export default Search;
