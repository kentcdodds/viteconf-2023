import {
	ActionFunctionArgs,
	Form,
	LoaderFunctionArgs,
	useFetcher,
	useLoaderData,
} from 'react-router-dom'
import { Contact, getContact, updateContact } from '../contacts'
import { DataReturn, invariant } from '../utils'

export async function loader({ params }: LoaderFunctionArgs) {
	invariant(params.contactId, 'Missing contactId')
	const contact = await getContact(params.contactId)
	if (!contact) {
		throw new Response('', {
			status: 404,
			statusText: 'Not Found',
		})
	}
	return { contact }
}

export async function action({ request, params }: ActionFunctionArgs) {
	invariant(params.contactId, 'Missing contactId')
	let formData = await request.formData()
	return updateContact(params.contactId, {
		favorite: formData.get('favorite') === 'true',
	})
}

export default function ContactRoute() {
	const { contact } = useLoaderData() as DataReturn<typeof loader>

	return (
		<div id="contact">
			<div>
				<img key={contact.avatar} src={contact.avatar} />
			</div>

			<div>
				<h1>
					{contact.first || contact.last ? (
						<>
							{contact.first} {contact.last}
						</>
					) : (
						<i>No Name</i>
					)}{' '}
					<Favorite contact={contact} />
				</h1>

				{contact.twitter && (
					<p>
						<a
							target="_blank"
							href={`https://twitter.com/${contact.twitter}`}
							rel="noreferrer"
						>
							{contact.twitter}
						</a>
					</p>
				)}

				{contact.notes && <p>{contact.notes}</p>}

				<div>
					<Form action="edit">
						<button type="submit">Edit</button>
					</Form>
					<Form
						method="post"
						action="destroy"
						onSubmit={event => {
							if (!confirm('Please confirm you want to delete this record.')) {
								event.preventDefault()
							}
						}}
					>
						<button type="submit">Delete</button>
					</Form>
				</div>
			</div>
		</div>
	)
}

function Favorite({ contact }: { contact: Contact }) {
	const fetcher = useFetcher()
	let favorite = contact.favorite
	if (fetcher.formData) {
		favorite = fetcher.formData.get('favorite') === 'true'
	}
	return (
		<fetcher.Form method="post">
			<button
				name="favorite"
				value={favorite ? 'false' : 'true'}
				aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
			>
				{favorite ? '★' : '☆'}
			</button>
		</fetcher.Form>
	)
}
