export function obj2array(object) {
	let array = []
	for (const key in object) {
		array.push({ value: key, label: object[key] })
	}
	return array
}