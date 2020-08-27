let quills = []

$('.editor').each(function(i) {
    quills.push(
        new Quill(this, {theme: 'snow'})
    )
    $(this).attr('id', i)
    });

    $('.comment-form').submit((e) => {
    e.preventDefault();
    let id = $(e.target).find('.editor').attr('id')
    let body = quills[id].root.innerHTML;
    let courseID = $(e.target).attr('course');

    $("<input />")
            .attr('type', 'hidden')
            .attr('name', 'body')
            .attr('value', body)
            .appendTo(e.target);

    $.post('/course/' + courseID + '/comment', {body: body}, function(res){
        if(res.msg){
            location.reload();
        } else {
            alert('Could not post comment')
        }
    });
});


let quill = new Quill('#comment-editor', {theme: 'snow'});

$('.edit-comment').click(function() {
    let commentID = $(this).attr('comment');
    let body = $('#' + commentID).html();
    let comment = $(this).parent().parent();
    quill.root.innerHTML = body

    $('#comment-btn-red').text('Update');
    $('#comment-btn-white').text('Delete!');

    $('#comment-btn-white').click(function() {
        $('#edit-comment').css('display', 'none');
    })

    $('#comment-btn-red').click(function() {
        let data = {
            body: quill.root.innerHTML
        }

        $.post('/comment/'+commentID+'?_method=PUT', data, function(res){
            if(res.msg === 'OK'){
                $('#' + commentID).html(data.body)
                $('#edit-comment').css('display', 'none');
            } else {
                alert('Could not post comment')
            }
        })
    })

    // Delete comment
    $('#comment-btn-white').click(function() {
        $.post('/comment/'+commentID+'?_method=DELETE', function(res){
            if(res.msg === 'OK'){
                comment.remove();
                $('#edit-comment').css('display', 'none');
            } else {
                alert('You are not allowed to delete this comment')
            }
        })
    })

    $('#edit-comment').css('display', 'flex');
})

$('.respond-comment').click(function () {
    let commentID = $(this).attr('comment');
    quill.root.innerHTML = '';

    $('#comment-btn-red').text('Publish');
    $('#comment-btn-white').text('Cancel');

    $('#comment-btn-white').click(function() {
        $('#edit-comment').css('display', 'none');
    })

    $('#comment-btn-red').click(function() {
        let data = {
            body: quill.root.innerHTML
        }

        $.post('comment/'+commentID, data, function(res){
            if(res.msg){
                location.reload()
            } else {
                alert('Failed to post subcomment')
            }
        })
    })

    $('#edit-comment').css('display', 'flex');
})