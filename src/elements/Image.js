import React from "react";
import styled from "styled-components";

const Image = () => {
    const { shape, src, size } = props;
    return <ImageCircle></ImageCircle>;
};

Image.defaultProps = {
    shape: "circle",
    src: "https://ww.namu.la/s/389112384038ef47074671145a3137bc8b1e3a1bc954e269479d6e3bd06715f3df1c6aac8890dfbbac082e7b31313c9f7ef4703bafaf3165c10f306d98835f7011489c59011c8a448cc9e575bdbcabdc7a2fe206ec89698e290b8def736e65ea",
    size: 36,
};

//background-cover: 공간에 맞게 사이즈 조절

const ImageCircle = styled.div`
    --size: ${props => props.size}px;
    width: var(--size);
    height: var(--size);
    border-radius: var(--size);
    background-image: url("${props => props.src}");
    background-size: cover;
`;

export default Image;
