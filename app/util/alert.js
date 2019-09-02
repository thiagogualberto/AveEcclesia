export const Confirm = string => {
	return confirm(string)
}

export const Alert = string => {
	alert(string)
}

export default {
	confirm: Confirm,
	show: Alert
}