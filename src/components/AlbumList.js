import React from 'react';
import styled from 'styled-components'
import Album from './Album'

const AlbumListWrapper = styled.li`
  display: flex; 
  margin: 0;
  padding: 0; 
  list-style: none; 
  overflow: none;
`;

const AlbumList = (props) => {

  let albums = null;

  console.log(props.albumsResponse)

  if (props.albumsResponse) {
    albums = (
      <AlbumListWrapper>
        {props.albumsResponse.map((item) => {
          return  <Album
            image={item.track.album.images[0].url}
            imageWidth={item.track.album.images[0].width}
            imageHeight={item.track.album.images[0].height}
            albumName={item.track.name}
            artistName={item.track.album.name}/>
        })}
      </AlbumListWrapper>
    );
  }
  
  return ( albums );
};

export default AlbumList;