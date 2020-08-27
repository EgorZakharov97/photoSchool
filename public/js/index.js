$("#email-form").submit(e => {
	e.preventDefault();
	let form = e.target;
	let email = $(form).find("input[name='email']").val();
	$(form).find("div[af-sock='success']").show();

	$.post('/leave-email', {email}, (res) => {
		if(res.msg){
			$('#email-error').hide()
			$('#email-success').show();
		} else {
			$('#email-success').hide();
			$('#email-error').show()
		}
	})
})



// const section = $('#section-by');
// let currCourseDiscount;
// let currCoursePrice;
// let couponApplied = false;

// $('.course-buy-button').click((e) => {
// 	$('#user-message').text('');

// 	let currCourseName = $(e.target).attr('cName');
// 	let currCourseStarts = $(e.target).attr('cStart');
// 	currCoursePrice = $(e.target).attr('cPrice');
// 	currCourseDiscount = $(e.target).attr('cDisc');
// 	let currCourseID = $(e.target).attr('cID');
// 	let currCourseImg = $(e.target).attr('cPic');
// 	let email = $(e.target).attr('uEmail');

// 	if(currCourseDiscount === '100'){
// 		currCoursePrice = 0.50;
// 	} else if(currCourseDiscount !== 'NONE') {
// 		currCourseDiscount = 1 - (Number(currCourseDiscount) / 100);
// 		currCoursePrice *= currCourseDiscount;
// 	}

// 	$('#courseName').text(currCourseName);
// 	$('#courseStarts').text(currCourseStarts);
// 	$('#finPrice').text('$' + currCoursePrice + ' CAD');
// 	$('#coursePic').css('background-image', 'linear-gradient(180deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(\'' + currCourseImg + '\')');

// 	if(email === ''){
// 		$('#blockLoggedIn').css('display', 'none');
// 		$('#logCheckout').css('display', 'none');
// 		$('#email-form').css('display', 'block');
// 		$('#courseID').attr('value', currCourseID);
// 		$('#couponForm').css('display', 'none');
// 	} else {
// 		$('#usrEmail').text(email);
// 		$('#blockLoggedIn').css('display', 'block');
// 		$('#logCheckout').css('display', 'block');
// 		$('#email-form').css('display', 'none');
// 		$('#logCheckout').attr('href', '/buy/course/' + currCourseID);
// 		$('#couponForm').css('display', 'block');
// 	}

// 	section.css('display', 'flex');
// });

// $('#buy-close').click(() => {
// 	section.css('display', 'none');
// 	couponApplied = false;
// });

// function checkCouponAndApply(data) {
// 	$.post('/buy/checkCoupon', data, (res) => {
// 		if(res.found){
// 			if(res.valid){
// 				if(res.code !== couponApplied){
// 					let newDiscount = res.discount;
// 					let priceWithDiscount = Math.round(currCoursePrice * (100-newDiscount))/100;
// 					$('#finPrice').text('$' + priceWithDiscount + ' CAD');
// 					couponApplied = res.code;
// 					console.log('Coupon was applied!');
// 					$('#user-message').text('Coupon was applied').css('color', 'green');
// 				} else {
// 					console.log('Coupon was already applied');
// 					$('#user-message').text('This coupon was already applied').css('color', 'red');
// 				}
// 			} else {
// 				console.log('Coupon is not valid');
// 				$('#user-message').text('This coupon is no longer valid').css('color', 'red');
// 			}

// 		} else {
// 			console.log('Coupon was not found');
// 			$('#user-message').text('Sorry, we dont know this coupon').css('color', 'red');
// 		}
// 	})
// }

// $('#cpnSubmit').click(event => {
// 	event.preventDefault();
// 	let data = $('#couponForm').serialize();
// 	checkCouponAndApply(data);
// 	let href = $('#logCheckout').attr('href');
// 	href += ('&' + data.split('=')[1]);
// 	$('#logCheckout').attr('href', href);
// });

// $('#cpnSubmitForm').click(event => {
// 	event.preventDefault();
// 	let data = $('#cpnInput').val();
// 	checkCouponAndApply({coupon: data});
// });