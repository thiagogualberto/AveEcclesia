import styled from 'styled-components'
import { CustomInput } from 'reactstrap'

export const CustomInputFile = styled(CustomInput)`
	& .custom-file-label::after {
		content: "Buscar"
	}
`