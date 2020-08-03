const section = $('#section-by');
let courseName = $('#courseName');
let courseStarts = $('#courseStarts');
let blockLoggedIn = $('#blockLoggedIn');
let usrEmail = $('#usrEmail');
let finalPrice = $('#finPrice');
let unLogCheckout = $('#unLogCheckout');
let emailForm = $('#email-form');

$('.course-buy-button').click((e) => {
	let currCourseName = $(e.target).attr('cName');
	let currCourseStarts = $(e.target).attr('cStart');
	let currCoursePrice = $(e.target).attr('cPrice');
	let currCourseID = $(e.target).attr('cID');
	let currCourseImg = $(e.target).attr('cPic');
	let email = $(e.target).attr('uEmail');

	$('#courseName').text(currCourseName);
	$('#courseStarts').text(currCourseStarts);
	$('#finPrice').text('$' + currCoursePrice + ' CAD');
	$('#coursePic').css('background-image', currCourseID);

	if(email === ''){
		$('#blockLoggedIn').css('display', 'none');
		$('#logCheckout').css('display', 'none');
		$('#email-form').css('display', 'block');
		$('#courseID').attr('value', currCourseID);
	} else {
		$('#usrEmail').text(email);
		$('#blockLoggedIn').css('display', 'block');
		$('#logCheckout').css('display', 'block');
		$('#email-form').css('display', 'none');
		$('#logCheckout').attr('href', '/buy/course/' + currCourseID);
	}

	section.css('display', 'flex');
});

$('#buy-close').click(() => {
	section.css('display', 'none')
});