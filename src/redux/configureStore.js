import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { connectRouter } from "connected-react-router";

import User from "./modules/user";
import Post from "./modules/post";
import Image from "./modules/image";
import Comment from "./modules/comment";
import Like from "./modules/like";

// combineReducers()를 사용해서 export한 reducer를 모아 root reducer 만들고
// 미들웨어 적용해주고
// createStore() 사용해서 root reducer와 미들웨어를 엮어 스토어를 만든다

export const history = createBrowserHistory();

// 스토어에 브라우저 히스토리 들어감
const rootReducer = combineReducers({
    user: User,
    post: Post,
    image: Image,
    comment: Comment,
    like: Like,
    router: connectRouter(history),
});

// 미들웨어는 액션 실행과 리듀서 사이에 api요청같은 것을 수행함
// history를 쓰는 것도 같음
// 비동기 요청 후 .then해서 history 사용할 수 있음
const middlewares = [thunk.withExtraArgument({ history: history })];

// 지금이 어느 환경인 지 알려줘요. (개발환경, 프로덕션(배포)환경 ...)
const env = process.env.NODE_ENV;

// 개발환경에서는 로거라
// if문을 쓴 이유는 개발환경일때만 쓰려고
// 개발환경이 아니라 production 환경일 때 사용하면 굳이 필요없는 상황인데 프로젝트 크기만 커지는 것을 초래
if (env === "development") {
    const { logger } = require("redux-logger");
    middlewares.push(logger);
}

// 돌아가는 환경이 브라우저가 아닐때도 있음
// 브라우저 아닐때는 window객체가 없음
// 환경이 브라우저일때만 실행하려고 만들어놓은 코드
const composeEnhancers =
    typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
              // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
          })
        : compose;

// 미들웨어 묶기
const enhancer = composeEnhancers(applyMiddleware(...middlewares));

// 스토어 만들기
let store = initialStore => createStore(rootReducer, enhancer);

// store() 이렇게 실행하면 만들어진 스토어가 들어가겠지!
export default store();
