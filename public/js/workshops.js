import CourseContainer from './components/CourseContainer.js'
import CourseContainerPast from './components/CourseContainerPast.js'
import BuyForm from './components/BuyForm.js';

const buyForm = new BuyForm();

jQuery.loadScript = function (url, callback) {
    jQuery.ajax({
        url: url,
        dataType: 'script',
        success: callback,
        async: true
    });
}

$.post('/workshops', (res) => {
    console.log(res)
    let courses = res.courses;
    let pastCourses = res.pastCourses;
    let discount = res.discount;
    const courseContainer = new CourseContainer(courses, discount, handleRegister.bind(this));
    const courseContainerPast = new CourseContainerPast(pastCourses);
}).then(() => {
    $.loadScript('/public/js/Webflow.js')
});

function handleRegister(data) {
    buyForm.setData(data);
    buyForm.setContent();
    buyForm.show();
}