import React from "react";

function Post() {
  return (
    <>
      <div>user profile / user name / insert-dt /is_me (edit)</div>
      <div>contents</div>
      <div>image</div>
      <div>comment cnt</div>
    </>
  );
}

// props를 잘못가져왔을 때 기본값으로 정해놓음
Post.defaultProps = {
  user_info: {
    user_name: "duck",
    user_profile:
      "https://ww.namu.la/s/389112384038ef47074671145a3137bc8b1e3a1bc954e269479d6e3bd06715f3df1c6aac8890dfbbac082e7b31313c9f7ef4703bafaf3165c10f306d98835f7011489c59011c8a448cc9e575bdbcabdc7a2fe206ec89698e290b8def736e65ea",
  },
  image_url:
    "https://ww.namu.la/s/389112384038ef47074671145a3137bc8b1e3a1bc954e269479d6e3bd06715f3df1c6aac8890dfbbac082e7b31313c9f7ef4703bafaf3165c10f306d98835f7011489c59011c8a448cc9e575bdbcabdc7a2fe206ec89698e290b8def736e65ea",
  content: "레서판다네요",
  comment_cnt: 10,
  insert_dt: "2021-09_30 00:00:00",
};

export default Post;
