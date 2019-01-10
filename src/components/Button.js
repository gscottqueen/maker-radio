import styled, { css } from 'styled-components'

export default styled.button`
  background: ${ props => 
    props.primary ? "transparent" : 
    "black"
    };
  color: ${ props => 
    props.primary ? "black" : 
    "white"
    };
  border: 1px solid black;
  margin: 1em 0 0;
  padding: 0.25em 1em;
`