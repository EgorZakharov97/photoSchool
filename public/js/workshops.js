import CourseContainer from './components/CourseContainer.js';

// $.post('/workshops').then(res => {
//     let workshops = res.courses;
//     let pastWorkshops = res.pastCourses
//     let discount = res.discount

//     let currentCoutses = new CourseContainer(workshops, discount)
// })

$('#courses-container').append($('#course-home').clone())