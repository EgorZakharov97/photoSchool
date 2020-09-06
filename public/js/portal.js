
const username = $('#main-username');
let user = {};
$.get('/auth/user', res => {
	user = res;
	username.text(user.username)
});

$('#workshops-container').ready(() => {
	$.get('/portal/workshops', res => {
		console.log(res);
	})
});

$('#courses-container').ready(() => {
	$.get('/portal/courses', res => {
		console.log(res);
	})
});

$('#videos.container').ready(() => {
	$.get('/portal/videos', res => {
		console.log(res);
	})
});

$('#material-container').ready(() => {
	$.get('/portal/materials', res => {
		console.log(res);
	})
});

$('#preset-container').ready(() => {
	$.get('/portal/presets', res => {
		console.log(res);
	})
});