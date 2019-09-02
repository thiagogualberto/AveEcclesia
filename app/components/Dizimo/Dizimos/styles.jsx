import styled from 'styled-components'

export const IconRotate = styled.i`
	transition: .5s;
	height: 18px;
	transform: ${props => props.rotate && 'rotate(-180deg)'};
`