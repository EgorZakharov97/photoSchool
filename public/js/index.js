let buttons = document.getElementsByClassName("pay-button");

for (button of buttons){
	button.addEventListener('click', async () => {
		var stripe = Stripe('pk_test_51H7WJ1Fot84IA7k9e0bKXwoFwD8RDitmeJrf43cQmCFsza0L4bFfsVpZr0CfTuz2RYXrGJynkmPggSPtUaDy92Mx004LmvKyH1');
		var session_id = await getSessionId(button.id);
		stripe.redirectToCheckout({
			sessionId: session_id
		}).then(function (result) {
			console.log(result)
		});
	})
}

async function getSessionId(courseID) {
	return await fetch('/buy/course/'+courseID, {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(res => {
			return res.json()
		})
		.then(data => {
			return data.session
		})
		.catch(e => {
			console.log(e)
		})

}