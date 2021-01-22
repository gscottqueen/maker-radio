import React from 'react';
import styled from 'styled-components'
import Album from './Album'

const PodcastListWrapper = styled.ul`
  display: flex;
  margin: 0;
  padding: 0;
  height: 100vh;
  list-style: none;
`;

const PodcastList = (props) => {

  let podcasts = null;

  if (props.podcastResponse) {
   podcasts = (
        <PodcastListWrapper>
          {props.podcastResponse.map((item) => {
            return  <Album
              key={item.id}
              image={item.images[0].url}
              imageWidth={item.images[0].width}
              imageHeight={item.images[0].height}
              albumName={item.name}
              // artistName={item.track.album.name}
              />
          })}
        </PodcastListWrapper>
    );
  }

  return ( podcasts );
};

export default PodcastList;
