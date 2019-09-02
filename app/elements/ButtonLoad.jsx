import React from 'react'
import { Button, Spinner } from 'reactstrap'

export default ({ loading, disabled, text, loadingText, ...props }) => (
	<Button {...props} disabled={disabled || loading}>
		{loading && <Spinner size='sm' />}
		{loading && loadingText !== undefined ? ' ' + loadingText : text}
	</Button>
)