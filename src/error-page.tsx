import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

export default function ErrorPage() {
	const error = useRouteError()
	const responseError = isRouteErrorResponse(error) ? error : null
	console.error(error)

	return (
		<div id="error-page">
			<h1>Oops!</h1>
			<p>Sorry, an unexpected error has occurred.</p>
			<p>
				<i>{responseError ? responseError.statusText : 'Unknown error'}</i>
			</p>
		</div>
	)
}
