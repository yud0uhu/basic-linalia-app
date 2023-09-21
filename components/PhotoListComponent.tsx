import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import React from "react";

const Container = styled.div`
  margin: 0 auto;
  padding: 15px;
  max-width: 585px;
`;

const Text = styled.h1`
  color: var(--hiContrast);
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const Image = styled.img`
  width: 100px;
  height: auto;
  border-radius: var(--1);
`;

const PhotoListComponent = ({ text, photoList }) => {
  return (
    <Container>
      <Text>PhotoListComponent from Linalia CSS.</Text>
      <p style={{ margin: 0 }}>text: {text}</p>

      <ul
        className={css`
          padding: 0;
          margin: 0;
          list-style: none;
        `}
      >
        {photoList.map((photo) => (
          <li
            className={css`
              list-style: none;
            `}
            key={photo.id}
          >
            <ImageContainer>
              <Image src={photo.thumbnailUrl} alt={photo.title} />
              <p>{photo.title}</p>
            </ImageContainer>
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default PhotoListComponent;
