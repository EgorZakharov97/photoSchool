const User = require('../models/User'),
	logger = require('../service/logger/logger'),
	Course = require('../models/Course'),
	Material = require('../models/Material'),
    Preset = require('../models/Preset'),
    Comment = require('../models/Comment'),
    Video = require('../models/Video');
    
module.exports.postComment = (req, res, next) => {
    User.findById(req.user._id, (err, user) => {
        if(err){
            logger.error('Could not reach database while posting a comment');
            res.status(500);
            res.json({msg: false})
        } else if(user) {
            if(user.admin || user.courses.includes(req.params.id)){
                Course.findById(req.params.id, (noCors, course) => {
                    if(noCors){
                        logger.error(`Could not search for course while posting a comment`);
                        res.status(500);
                        res.json({msg: false});
                    } else {
                        if(!course.comments) course.comments = []
                        Comment.create({
                            author: {
                                id: user._id,
                                name: user.username,
                                img: user.picture
                            },
                            course: req.params.id,
                            datePosted: Date.now(),
                            body: req.body.body
                        }, (err2, comment) => {
                            if(err2){
                                logger.error('Could not create new comment for user ' + user.email);
                                console.log(err2)
                                res.status(500);
                                res.json({msg: false})
                            } else {
                                course.comments.push(comment);
                                course.save();
                                logger.info(`${user.email} posted a comment on ${course.name}`);
                                res.json({msg: "OK"});
                            }
                        })
                    }
                })
            } else {
                logger.error(`${user.email} is trying to post a comment but he/she does not have workshop ${req.params.id}`);
                res.status(500);
                res.json({msg: false})
            }
        } else {
            logger.error('Could not find user while posting a comment');
            res.status(500);
            res.json({msg: false})
        }
    })
}

module.exports.updateComment = (req, res, next) => {
    Comment.findById(req.params.comment, (err, comment) => {
        if(err || !comment){
            logger.error(err);
            res.json({msg: false})
        } else {
            if(req.user.admin || (req.user.courses && req.user.courses.includes(String(comment.course._id)))){
                comment.body = req.body.body;
                comment.save();
                logger.info(`${req.user.username} modified a comment with ID ${comment._id}`);
                res.json({msg: 'OK'})
            } else {
                logger.error(`${req.user.email} is not allowed to modify comment ${comment._id}`)
                res.json({msg: false});
            }
        }
    })
}

module.exports.deleteComment = (req, res, next) => {
    Comment.findById(req.params.comment, (err, comment) => {
        if(err || !comment){
            logger.error(err);
            res.json({msg: false})
        } else {
            if(req.user.admin || (req.user.courses && req.user.courses.includes(String(comment.course._id)))){
                comment.remove();
                logger.info(`${req.user.username} deleted a comment with ID ${comment._id}`);
                res.json({msg: 'OK'})
            } else {
                logger.error(`${req.user.email} is not allowed to modify comment ${comment._id}`)
                res.json({msg: false});
            }
        }
    })
}

module.exports.postSubcomment = (req, res, next) => {
    Comment.findById(req.params.comment, (err, comment) => {
        if(err || !comment){
            logger.error(err);
            res.json({msg: false})
        } else {
            if(req.user.admin || (req.user.courses && req.user.courses.includes(comment.course))){
                Comment.create({
                    author: {
                        id: req.user._id,
                        name: req.user.username,
                        img: req.user.picture,
                    },
                    course: comment.course,
                    subcomments: [],
                    body: req.body.body,
                    datePosted: Date.now()
                }, (err, subcomment) => {
                    if(err){
                        logger.error(err);
                        res.json({msg: false});
                    } else {
                        comment.subcomments.push(subcomment);
                        comment.markModified('subcomments');
                        comment.save();
                        logger.info(`${req.user.username} posted a subcomment on course id ${comment.course}`)
                        res.json({msg: 'OK'})
                    }
                })
            } else {
                logger.error(`${req.user.email} is not allowed to modify comment ${comment._id}`)
                res.json({msg: false});
            }
        }
    })
}