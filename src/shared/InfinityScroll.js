import React, { useCallback, useEffect } from "react";
import _ from "lodash";

import { Spinner } from "../elements";

const InfinityScroll = props => {
    const { children, callNext, is_next, loading } = props;

    const _handleScroll = _.throttle(() => {
        // 이미 데이터를 불러오고 있을 때 다음꺼 부를 필요 없음 callNext() 실행하지 않아야
        if (loading) {
            return;
        }

        const { innerHeight } = window;
        const { scrollHeight } = document.body;
        const scrollTop =
            // 브라우저마다 document에 접근해서 스크롤높이를 가져오는 방식이 조금 다름
            (document.documentElement && document.documentElement.scrollTop) ||
            document.body.scrollTop;

        if (scrollHeight - innerHeight - scrollTop < 200) {
            callNext();
        }
    }, 300);

    // 로딩에 바뀔때마다 메모이제이션 함수를 불러오려면
    const handleScroll = useCallback(_handleScroll, [loading]);

    useEffect(() => {
        // 로딩이 되는 중에는 스크롤 이벤트 막기
        if (loading) {
            return;
        }
        // 처음 로드가 되었을 때 이벤트 걸어주기
        if (is_next) {
            window.addEventListener("scroll", handleScroll);
            // ㄴ is_next가 있으면 구독, 없으면 구독해제 -> 리소스 줄기
        } else {
            window.removeEventListener("scroll", handleScroll);
        }
        return () => window.removeEventListener("scroll", handleScroll);
    }, [is_next, loading]);

    return (
        <>
            {children} {is_next && <Spinner />}{" "}
        </>
    );
};

InfinityScroll.defaultProps = {
    chidlren: null,
    callNext: () => {},
    is_next: false,
    loading: false,
};

export default InfinityScroll;
