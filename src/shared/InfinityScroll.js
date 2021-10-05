import React, { useCallback, useEffect } from "react";
import _ from "lodash";

const InfinityScroll = props => {
    const { children, callNext, is_next, loading } = props;

    const _handleScroll = _.throttle(() => {
        // 이미 데이터를 불러오고 있을 때 다음꺼 부를 필요 없음 callNext() 실행하지 않아야
        if (loading) {
            return;
        }
        callNext();
    }, 300);

    const handleScroll = useCallback(_handleScroll, [loading]);

    useEffect(() => {
        if (loading) {
            return;
        }
        // 처음 로드가 되었을 때 이벤트 걸어주기
        if (is_next) {
            window.addEventListener("scroll", handleScroll);
        } else {
            window.removeEventListener("scroll", handleScroll);
        }
        return () => window.removeEventListener("scroll", handleScroll);
    }, [is_next, loading]);

    return <>{props.children}</>;
};

InfinityScroll.defaultProps = {
    chidlren: null,
    callNext: () => {},
    is_next: false,
    loading: false,
};

export default InfinityScroll;
