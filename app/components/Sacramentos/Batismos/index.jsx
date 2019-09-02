import React from "react";

import FormBatismo from "./FormBatismo";
import TableBatismo from "./TableBatismo";
import Container from "../../../elements/Container";
import { withFormEvents } from "../../../util/form-events";

const Batismos = props => (
	<Container title="Batismo">
		<FormBatismo onSubmitSuccess={props.handleSuccess`batismos`} />
		<TableBatismo
			ref={props.tableRef}
			editBatismo={props.handleEdit`batismos`}
			onAddData={props.handleAdd`batismos`}
		/>
	</Container>
);

export default withFormEvents(Batismos);
