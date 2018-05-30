

//==========INITIAL FORMATTING================================

//---------VARIABLES-----------------
var $timestamps = $('.timeStamp');
var profileId = $('.profileId').attr('id');
var userId = $('.userId').attr('id');



//---------FUNCTIONS-----------------

function time_ago(time) {

  var time_formats = [
    [60, 'seconds', 1], // 60
    [120, '1 minute ago', '1 minute from now'], // 60*2
    [3600, 'minutes', 60], // 60*60, 60
    [7200, '1 hour ago', '1 hour from now'], // 60*60*2
    [86400, 'hours', 3600], // 60*60*24, 60*60
    [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
    [604800, 'days', 86400], // 60*60*24*7, 60*60*24
    [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
    [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
    [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
    [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
    [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
    [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
    [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
    [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
  ];
  var seconds = (+new Date() - time) / 1000,
    token = 'ago',
    list_choice = 1;

  if (seconds == 0) {
    return 'Just now'
  }
  if (seconds < 0) {
    seconds = Math.abs(seconds);
    token = 'from now';
    list_choice = 2;
  }
  var i = 0,
    format;
  while (format = time_formats[i++])
    if (seconds < format[0]) {
      if (typeof format[2] == 'string')
        return format[list_choice];
      else
        return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
    }
  return time;
}

$timestamps.each((i) => {
  $timestamps[i].innerHTML = time_ago(Number($timestamps[i].innerHTML))
})

//=================NOTIFICATIONS===========================

var io = io();


io.emit('id', {userId: userId})

io.on('notification', function(notificationData) {
  $('#app-growl').append(formatGrowl(notificationData))
})

function formatGrowl(notificationData) {
  var notification = notificationData.notification;
  var html = '<div class="alert alert-dark alert-dismissible fade show" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><a href="../profile/' + notification.userId + '">' + notification.userName + '</a> ' + notification.action;
  if (notification.possessive) {
    html += ' ' + notification.possessive;
  } else {
    html += ' your';
  }
  html += ' <a href="../post/show/' + notification.targetId + '">'+ notification.targetType + '</a></div>';
  return html;
}


//=================POSTS====================================

//---------VARIABLES--------------------
var $newPost = $('#newPost');
var $postInput = $('#postInput');
var $posts = $('#posts');


//--------FUNCTIONS/FORMATTING-------------------

function formatPost(post) {
  var html = '<li id="' + post._id + '" class="card media list-group-item p-4 post"><img class="media-object d-flex align-self-start mr-3" src="' + post.author.img + '"><div class="media-body"><div class="media-body-text"><div class="media-heading"><small class="float-right text-muted">' + time_ago(post.date) + '</small><h6><a href="../profile/' + post.author.id + '">' + post.author.name + '</a>';
  html += '</h6></div><p>' + post.content + '</p></div><div class="d-flex postData"><div class="mr-auto pt-1"><a class="likes" href="#userModal" data-toggle="modal"><span class="icon icon-heart"></span><span class="likeCount">' + post.likes.length + '</span> Likes</a><span>&nbsp</span><a class="comments" href=#><span class="icon icon-message"></span><span class="commentCount">' + post.comments.length + '</span> Comments</a></div><div><button class="btn btn-sm btn-outline-secondary like"><span class="icon icon-heart" style="color: #3097D1"></span></button><button class="btn btn-sm btn-outline-secondary share"><span class="icon icon-retweet" style="color: #3097D1"></span></button></div></div><ul class="media-list comment-list hidden"><li class="media mb-3"><img class="media-object d-flex align-self-start mr-3" src="'+ post.author.img +'"><div class="media-body"><form class="com-form"><input class="com-in mt-2" type="text" placeholder="Write comment..."></form></div></li></ul></div></li>';
  return html;
}


//-------------AJAX---------------------
$newPost.submit(function(event) {
  $.ajax({
    url: "http://localhost:3000/post/new/" + profileId,
    data: {
      content: $postInput.val()
    },
    type: 'POST',
    dataType: 'json'
  })
  .done(function(post) {
    $(formatPost(post)).prependTo($posts).hide().slideDown();
    $postInput.val('');
    io.emit('post', {post: post})
  })
  event.preventDefault();
})

//-------------socket---------------------
io.on('post', function(postData) {
  if ((profileId !== userId && postData.post.author.id === profileId) || profileId === userId) {
    $(formatPost(postData.post)).prependTo($posts).hide().slideDown();
  } else {
    return false
  }
})

io.on('newComment', function(commentData) {
  var comment = commentData.comment;
  var postId = '#' + comment.post;
  var post = $(postId);
  if (post.find('.comments').hasClass('populated')) {
    post.find(".comment-list li:last-child").before(formatComment(comment))
  }
  post.find(".commentCount").html(Number(post.find(".commentCount").html()) + 1)
})

io.on('newLike', function(postData) {
  var post = postData.post;
  var postId = '#' + post._id;
  var post = $(postId);
  post.find('.likeCount').html(Number(post.find('.likeCount').html()) + 1)
})


//==============NAVIGATION====================

//------VARIABLES------------
var $collection = $('.collection');
var albums;

//------FUNCTIONS-------------------
function formatAlbums (albums) {
  var html = "<h1>Albums</h1><div class='row'>";
  albums.forEach((album) => {
    html += "<div class='col-md-3 col-sm-6' style='text-align: center'><a class='album' href='../profile/" + profileId + "/album/" + album._id + "'><img class='img-thumbnail' src='" + album.photos[album.photos.length - 1] + "'><h4>" + album.name + "</h4></a></div>"
  })
  $('.col-md-9').html(html)
}

//------AJAX------------------

$collection.on('click', function(event) {
  var $this = $(this);
  var collection = $this.html();
  $.ajax({
    url: "http://localhost:3000" + window.location.pathname + '/' + collection,
    data: {},
    type: 'GET',
    dataType: 'json'
  })
  .done((response) => {
    if (response.albums) {
      albums = response.albums.reverse()
      formatAlbums(albums)
    } else {
      if (userId === profileId) {
        var html = "<div><ul class='list-group media-list media-list-stream mb-4'><li id='postCard' class='card media list-group-item p-4'><form id='newPost' method='post'><textarea id='postInput' method='post' form='newPost' type='text' name='postInput' placeholder='What are you working on?'></textarea><div id='postButtons'><button class='btn btn-md btn-secondary'><span class='icon icon-camera'></span></button><button class='btn btn-md btn-primary'><span class='icon icon-paper-plane'></span></button></div></form></li><div id='posts'></div></ul></div>"
        $(".col-md-9").html(html)
      } else {
        $(".col-md-9").html("<div><ul class='list-group media-list media-list-stream mb-4'><div id='posts'></div></ul></div>")
      }
      $posts = $('#posts')
      $posts.html('');
      response.posts.forEach((post) => {
        $posts.prepend(formatPost(post));
      })
    }
    $collection.each((i, v) => {
      $(v).parent().removeClass('active');
    })
    $this.parent().addClass('active');
  })
  event.preventDefault();
})

$(document).on('click', '.album', function(event) {
  $('.col-md-9').html('<div class="spinner"><div class="dot1"></div><div class="dot2"></div></div>')
  $.ajax({
    url: $(this).attr('href'),
    data: {},
    type: 'GET',
    dataType: 'json'
  })
  .done((response) => {
    var html = "<button class='btn btn-secondary al-nav'><span class='icon icon-chevron-thin-left'></span>Albums</button><h1>" + response.album.name + "</h1><div class='row'>";
    response.album.photos.reverse().forEach((photo) => {
      html += "<div class='col-md-3 col-sm-6' style='text-align: center'><a class='photo' data-lightbox='" + response.album.name + "' href='" + photo + "'><img class='img-thumbnail' src='" + photo + "'></a></div>"
    })
    $('.col-md-9').html(html)
  })
  event.preventDefault()
})

$(document).on('click', '.al-nav', function(event) {
  formatAlbums(albums)
})



//=============!!!!!! LIKE/COMMENT/SHARE !!!!!!!!!!!=====================

//============COMMENT================================

//-----------FUNCTIONS/FORMATTING-----------

function formatComment(comment) {
  var html = '<li class="media mb-3"><img class="media-object d-flex align-self-start mr-3" src="' + comment.author.img + '"><div class="media-body"><div class="media-body-text"><div class="media-heading"><small class="float-right text-muted"><span class="timeStamp">' + time_ago(comment.date) + '</span></small><h6><a href="../profile/' + comment.author.id + '"><strong>' + comment.author.name + ': </strong></a></h6></div>' + comment.content + '</div</div></li>';
  return html
}

//-----------AJAX--------------------------

$(document).on("click", ".comments", function(event) {
  var $this  = $(this);
  $this.parent().toggleClass("mb-3");
  $this.parent().parent().parent().children(".comment-list").toggleClass("hidden");
  if (!($this.hasClass("populated"))){
    var postId = $this.parent().parent().parent().parent().attr("id");
    $.ajax({
      url: "http://localhost:3000/post/comments/"  + postId,
      data: {},
      type: 'GET',
      dataType: 'json'
    })
    .done((response) => {
      response.reverse().forEach((comment) => {
        $this.parent().parent().parent().children(".comment-list").prepend(formatComment(comment))
      })
      $this.addClass("populated");
    })
  }
  event.preventDefault();
})



$(document).on("submit", ".com-form", function(event) {
  var $this = $($(this).children()[0]);
  if($this.val() !== '') {
    var postId = $this.parent().parent().parent().parent().parent().parent().attr("id");
      $.ajax({
        url: "http://localhost:3000/post/comment/" + profileId + '/' +postId,
        data: {
          content: $this.val()
        },
        type: 'POST',
        dataType: 'json'
      })
      .done((comment) => {
        $this.parent().parent().parent().before(formatComment(comment))
        $this.val('')
        var commentCount = $this.parents(".media-body").children(".postData").children(".pt-1").children(".comments").children(".commentCount");
        commentCount.html(Number(commentCount.html()) + 1);
        io.emit('comment', {comment: comment})
      })
  }
  event.preventDefault()
})

//================LIKE==============================

//------------FORMATTIING/FUNCTIONS-----------------

function formatUserModal(response, title) {
  var html = '<div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">' + title + '</h4><button id="close" type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button></div><div class="modal-body p-0"><div class="modal-body-scroller"><ul class="media-list media-list-users list-group">'
  response.forEach(function(like) {
    html += '<li class="list-group-item"><div class="media w-100"><div class="media-object d-flex align-self-start mr-3" style="background-image: url(' + like.img + '); background-size: cover; background-position: center; height: 42px;"></div><div class="media-body"><button class="btn btn-primary btn-sm float-right"><span class="icon icon-add-user"></span> Follow</button><a href="../profile/' + like.id + '"><strong>' + like.name  + '</strong></a></div></div></li>'
  });
  html += '</ul></div></div></div></div>';
  return html;
}

$(document).on("click", ".like", function(event) {
  var $this = $(this);
  var $post = $this.parent().parent().parent().parent();
  var postId = $post.attr('id');
  $.ajax({
    url: "http://localhost:3000/post/like/" + profileId + '/' + postId,
    data: {},
    type: 'POST',
    dataType: 'json'
  })
  .done((response) => {
    $this.addClass('hidden');
    var likeCount = $this.parent().parent().children(".pt-1").children(".likes").children('.likeCount');
    likeCount.html(Number(likeCount.html()) + 1);
    io.emit('like', {userId: userId, postId: postId})
  })
})

var serverReturnedLikes = false;

$(document).on("click", ".likes", function(event) {
  if (serverReturnedLikes) {
    return true
  } else {
    var $this = $(this);
    var postId = $this.parent().parent().parent().parent().attr('id');
    $.ajax ({
      url: "http://localhost:3000/post/likes/" + postId,
      data: {},
      type: 'GET',
      dataType: 'json'
    })
    .done((response) => {
      serverReturnedLikes = true;
      var title = 'Likes';
      $('#userModal').html(formatUserModal(response, title));
      serverReturnedLikes = false;
    })
    event.preventDefault();
  }
})

//============FOLLOWS/FOLLOWING==============

var serverReturnedFollowing = false;

$('#following').on("click", function(event) {
  if (serverReturnedFollowing) {
    return true;
  } else {
      var url = "http://localhost:3000/user/following";
      if (profileId) {
        url += "/" + profileId;
      }
      $.ajax({
        url: url,
        data: {},
        type: 'GET',
        dataType: 'json'
      })
      .done((response) => {
        serverReturnedLikes = true;
        var title = "Following"
        $('#userModal').html(formatUserModal(response, title));
        serverReturnedLikes = false;
      })
    event.preventDefault();
  }
})

$('#followers').on("click", function(event) {
  if (serverReturnedFollowing) {
    return true;
  } else {
      var url = "http://localhost:3000/user/followers";
      if (profileId) {
        url += "/" + profileId;
      }
      $.ajax({
        url: url,
        data: {},
        type: 'GET',
        dataType: 'json'
      })
      .done((response) => {
        serverReturnedLikes = true;
        var title = "Followers"
        $('#userModal').html(formatUserModal(response, title));
        serverReturnedLikes = false;
      })
    event.preventDefault();
  }
})

$('#newFollow').on('click', function(event) {
  $this = $(this);
  $.ajax({
    url: "http://localhost:3000/user/addFollowing/" + profileId,
    data: {},
    type: 'POST',
    dataType: 'json'
  })
  .done(function(response) {
    $this.remove()
  })
})


//==========USER MANAGEMENT=================
$('#av-in').change(() => {
  $('#userModal').find('.modal-title').html('Choose Profile Picture')
  $('#modal').click()
  $('#userModal').find('.modal-body').html('<div class="spinner"><div class="dot1"></div><div class="dot2"></div></div>')

  if ( ! window.FileReader ) {
			return alert( 'FileReader API is not supported by your browser.' );
		}
		var $i = $( '#av-in' ),
			input = $i[0];
		if ( input.files && input.files[0] ) {
			file = input.files[0];
			fr = new FileReader();
			fr.onload = function (event) {
        $('#userModal').find('.modal-body').html("<img class='av-selected mt-2' src='"+ event.target.result + "'><div class='mb-2 av-btns'><button class='btn btn-secondary mr-2' id='av-cancel'>Cancel</button><button id='av-post' class='btn btn-primary'>Post</button>")
			};
			fr.readAsDataURL( file );
		} else {
			alert( "File not selected or browser incompatible." )
		}
})

$(document).on('click', '#av-post', function(event) {
  $('#av-form').submit()
  $('#userModal').find('.modal-body').html('<div class="spinner"><div class="dot1"></div><div class="dot2"></div></div>')
})

$(document).on('click', '#av-cancel', function(event) {
  $('#userModal').find('.close').click()
})
