import React from 'react'

export default props => (
	<div className='pt-2 pb-3' title={`${props.percent.toFixed(2)}%`}>
		<div className='w-100' style={{ backgroundColor: '#e2e2e2', borderRadius: 2, height: 5 }}>
			<div className={props.color} style={{ height: 5, borderRadius: 2, width: `${props.percent}%`, transition: 'width 0.5s cubic-bezier(0.8, -0.24, 0.49, 0.9) 0s' }} />
		</div>
	</div>
)