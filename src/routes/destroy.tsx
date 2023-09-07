import { ActionFunctionArgs, redirect } from 'react-router-dom'
import { deleteContact } from '../contacts'
import { invariant } from '../utils'

export async function action({ params }: ActionFunctionArgs) {
	invariant(params.contactId, 'Missing contactId')
	await deleteContact(params.contactId)
	return redirect('/')
}
