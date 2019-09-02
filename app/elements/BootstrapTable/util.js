export const newEvent = (name, callback) => {
	if (callback !== undefined) {
		window.events[`click .${name}`] = async (e, value, row, index) => {

			// Previne  continuação do evento
			e.preventDefault()
			e.stopPropagation()

			// Chama o callback e vai no then dele
			const req = callback(e, value, row, index)
			
			// Se for uma promisse, continua
            if (req !== undefined && typeof req.then === 'function')
            {
                const { data } = await req

                if (data.success) {
                    this.refresh({ silent: true })
                    add_notification('success', data.message)
                } else {
                    add_notification('danger', data.message)
                }
			}
		}
	}
}