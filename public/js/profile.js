

class Post {
  constructor(json) {
    this.content = json.content;
    this.author = json.author;
    this.tags = json.tags;
    this.comments = json.comments;
    this.subs = json.subs;
    this.likes = json.likes;
    this.date = json.date;
    this.type = json.type;
  }
  format() {
    var liked = false;

    this.likes.forEach(function(like) {
      if (like.id === (user._id)) {
      liked = true;
      }
    })

    var html = '<li id="' + this._id + '" class="card media list-group-item p-4 post"><img class="media-object d-flex align-self-start mr-3" src="' + this.author.img + '"><div class="media-body"><div class="media-body-text"><div class="media-heading"><small class="float-right text-muted timeStamp">' + format.time(this.date) + '</small><h6><a href="../profile/' + this.author.id + '">' + this.author.name + '</a>';
    html += '</h6></div><p>' + this.content + '</p></div><div class="d-flex postData"><div class="mr-auto pt-1"><a class="likes" href="#userModal" data-toggle="modal"><span class="icon icon-heart"></span><span class="likeCount">' +this.likes.length + '</span> Likes</a><span>&nbsp</span><a class="comments" href=#><span class="icon icon-message"></span><span class="commentCount">' + this.comments.length + '</span> Comments</a></div><div>';

    if (!liked) {
      html += '<button class="btn btn-sm btn-outline-secondary like"><span class="icon icon-heart" style="color: #3097D1"></span></button>';
    }

    html += '<button class="btn btn-sm btn-outline-secondary share"><span class="icon icon-retweet" style="color: #3097D1"></span></button></div></div><ul class="media-list comment-list hidden"><li class="media mb-3"><img class="media-object d-flex align-self-start mr-3" src="'+ this.author.img +'"><div class="media-body"><form class="com-form"><input class="com-in mt-2" type="text" placeholder="Write comment..."></form></div></li></ul></div></li>';

    return html;
  }
}

const state = {
  posts: profile.posts.map(post => {
    return new Post(post)
  });
  
}

console.log(state.posts)

const format = {
  time: function (time) {

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
          },

  allTime: function() {
    components.timestamps.each((i) => {
      components.timestamps[i].innerHTML = format.time(Number(components.timestamps[i].innerHTML))
    })
  },


  post: function(post) {

    var liked = false;

    post.likes.forEach(function(like) {
      if (like.id === (userId)) {
      liked = true;
      }
    })

    var html = '<li id="' + post._id + '" class="card media list-group-item p-4 post"><img class="media-object d-flex align-self-start mr-3" src="' + post.author.img + '"><div class="media-body"><div class="media-body-text"><div class="media-heading"><small class="float-right text-muted timeStamp">' + format.time(post.date) + '</small><h6><a href="../profile/' + post.author.id + '">' + post.author.name + '</a>';
    html += '</h6></div><p>' + post.content + '</p></div><div class="d-flex postData"><div class="mr-auto pt-1"><a class="likes" href="#userModal" data-toggle="modal"><span class="icon icon-heart"></span><span class="likeCount">' + post.likes.length + '</span> Likes</a><span>&nbsp</span><a class="comments" href=#><span class="icon icon-message"></span><span class="commentCount">' + post.comments.length + '</span> Comments</a></div><div>';

    if (!liked) {
      html += '<button class="btn btn-sm btn-outline-secondary like"><span class="icon icon-heart" style="color: #3097D1"></span></button>';
    }

    html += '<button class="btn btn-sm btn-outline-secondary share"><span class="icon icon-retweet" style="color: #3097D1"></span></button></div></div><ul class="media-list comment-list hidden"><li class="media mb-3"><img class="media-object d-flex align-self-start mr-3" src="'+ post.author.img +'"><div class="media-body"><form class="com-form"><input class="com-in mt-2" type="text" placeholder="Write comment..."></form></div></li></ul></div></li>';

    return html;
  },

  modal: {

    user: function(response, title) {

      var html = '<div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">' + title + '</h4><button id="close" type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button></div><div class="modal-body p-0"><div class="modal-body-scroller"><ul class="media-list media-list-users list-group">'

      response.users.forEach(function(user) {
        html += '<li class="list-group-item"><div class="media w-100"><div class="media-object d-flex align-self-start mr-3" style="background-image: url(' + user.img + '); background-size: cover; background-position: center; height: 42px;"></div><div class="media-body">';
        if (response.following.includes(user.id)) {
          html += '<button class="btn btn-secondary btn-sm float-right disabled">Following <span class="icon icon-check"></span></button>';
        } else {
          html += '<button class="btn btn-primary btn-sm float-right follow" id="' + user.id + '"><span class="icon icon-add-user"></span> Follow</button>';
        }
        html += '<a href="../profile/' + user.id + '"><strong>' + user.name  + '</strong></a></div></div></li>';
      });

      html += '</ul></div></div></div></div>';

      components.userModal.html(html)
    },

    avatar: {

      load: function() {

        var $userModal = $('#userModal')

        $userModal.find('.modal-title').html('Choose Profile Picture');
        $userModal.find('.modal-body').html(components.animations.load);

      },

      ready: function(event) {

        $('#userModal').find('.modal-body').html("<img class='av-selected mt-2' src='"+ event.target.result + "'><div class='mb-2 av-btns'><button class='btn btn-secondary mr-2' id='av-cancel'>Cancel</button><button id='av-post' class='btn btn-primary'>Post</button>")

      },

      preview: function() {
        if ( ! window.FileReader ) {
      			return alert( 'FileReader API is not supported by your browser.' );
      		}
      		var $i = $(forms.avatar.input),
      			input = $i[0];
      		if ( input.files && input.files[0] ) {
      			file = input.files[0];
      			fr = new FileReader();
      			fr.onload = function (event) {
              format.modal.avatar.ready(event)
      			};
      			fr.readAsDataURL( file );
      		} else {
      			alert( "File not selected or browser incompatible." )
      		}
      },

    },

  },

  growl: function(data) {
    var notification = data.notification;
    var html = '<div class="alert alert-dark alert-dismissible fade show" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><a href="../profile/' + notification.userId + '">' + notification.userName + '</a> ' + notification.action;
    if (notification.possessive) {
      html += ' ' + notification.possessive;
    } else {
      html += ' your';
    }
    html += ' <a href="../post/show/' + notification.targetId + '">'+ notification.targetType + '</a></div>';
    return html;
  },

}

const components = {
  sections: {
    main: '.col-md-9',
    posts: '#posts'
  },
  animations: {
    load: '<div class="spinner"><div class="dot1"></div><div class="dot2"></div></div>',
  },
  timestamps: $('.timeStamp'),
  userModal: $('#userModal')
}

const ajax = {
   request: function(obj) {
     $.ajax()
   },
   //function(options) {
  //   $.ajax({
  //   //   url: options.url,
  //   //   data: options.data,
  //   //   type: options.type,
  //   // })
  //   // .done(function(response) {
  //   //   if (cb) {
  //   //     cb(response, element)
  //   //   }
  //   // })
  //   // .fail()
  // },
  callbacks: {
    displayPost: function(response, element) {
      var post = response.post
      $(format.post(post)).prependTo($(components.sections.posts)).hide().slideDown();
      element.val('');
      socket.emitter.post(post)
    },
    newLike: function(response, element) {
        console.log(element)
        element.remove();
        console.log(element.parents('.post'))
        // var likeCount = element.closest('.postData').children('.likeCount');
        // likeCount.html(Number(likeCount.html()) + 1);
        // console.log(element.closest('.post').html())
        //io.emit('like', {userId: userId, postId: element.closest('.post').attr('id')})
    }
  }
}


const forms = {
  post: {
    form: '#postForm',
    input: '#postInput'
  },
  avatar: {
    form: '#av-form',
    input: '#av-in'
  }
}

const socket = {
  emitter: {
    id: function(userId) {
      io.emit('id', {userId: userId})
    },
    post: function(post) {
      io.emit('post', {post: post})
    }
  },
  reciever: function(name, data) {
    switch (name) {
      case 'notification':
        socket.callbacks.notification(data);
        break;
      case 'post':
        socket.callbacks.post(data);
        break;
      case 'comment':
        socket.callbacks.comment(data);
        break;
      case 'like':
        socket.callbacks.like(data);
    }
  },
  callbacks: {
    notification: function(data) {
      $('#app-growl').append(format.growl(data))
    },
    post: function(data){
      $(format.post(data.post)).prependTo($(components.sections.posts)).hide().slideDown();
    },
    comment: function(data) {
      var comment = data.comment;
      var postId = '#' + comment.post;
      var post = $(postId);
      if (post.find('.comments').hasClass('populated')) {
        post.find(".comment-list li:last-child").before(format.comment(comment))
      }
      post.find(".commentCount").html(Number(post.find(".commentCount").html()) + 1)
    },
    like: function(data) {
      var post = data.post;
      var postId = '#' + post._id;
      var post = $(postId);
      post.find('.likeCount').html(Number(post.find('.likeCount').html()) + 1)
    }
  }
}

var io = io();

io.on('notification', function(data) {
  socket.reciever('notification', data)
})

io.on('post', function(data) {
  socket.reciever('post', data)
})

io.on('comment', function(data) {
  socket.reciever('comment', data)
})

io.on('like', function(data) {
  socket.reciever('like', data)
})

$(document).ready(function() {
  // format.allTime();
  // var posts = profile.posts
  // profile.posts.forEach((post) => {
  //   posts.push(new Post(post))
  // })
  // posts.sort((a, b) => {
  //   return a.date - b.date
  // })
  // posts.forEach((post) => {
  //   $(components.sections.posts).prepend(post.format())
  // })
  //socket.emitter.id(userId);
})




//==========INITIAL FORMATTING================================

//---------VARIABLES-----------------

var profileId = $('.profileId').attr('id');
var userId = $('.userId').attr('id');



//---------FUNCTIONS-----------------


//=================NOTIFICATIONS===========================









//=================POSTS====================================

//---------VARIABLES--------------------



//--------FUNCTIONS/FORMATTING-------------------



//-------------Projects---------------
$(document).on('click', '#project', function(event) {
  event.preventDefault()
})


//-------------AJAX---------------------
$(document).on('submit', forms.post.form, function(event) {
  $this = $(forms.post.input)
  ajax.request("http://localhost:3000/post/new/" + profileId, {content: $this.val()}, 'POST', $this, ajax.callbacks.displayPost)
  event.preventDefault()
})

//-------------socket---------------------





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
        var html = "<div><ul class='list-group media-list media-list-stream mb-4'><li id='postCard' class='card media list-group-item p-4'><form id='postForm' method='post'><textarea id='postInput' method='post' form='newPost' type='text' name='postInput' placeholder='What are you working on?'></textarea><div id='projectButton'><button class='btn btn-md btn-secondary'>Project <span class='icon icon-edit'></span></button></div><div id='postButtons'><button class='btn btn-md btn-secondary'><span class='icon icon-camera'></span></button><button class='btn btn-md btn-primary'><span class='icon icon-paper-plane'></span></button></div></form></li><div id='posts'></div></ul></div>"
        $(".col-md-9").html(html)
      } else {
        $(".col-md-9").html("<div><ul class='list-group media-list media-list-stream mb-4'><div id='posts'></div></ul></div>")
      }
      $posts = $('#posts')
      $posts.html('');
      response.posts.forEach((post) => {
        $posts.prepend(format.post(post));
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
    var html = "<a class='al-nav'><span class='icon icon-chevron-thin-left'></span>Albums</a><h1>" + response.album.name + "</h1><div class='row'>";
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
  var html = '<li class="media mb-3"><img class="media-object d-flex align-self-start mr-3" src="' + comment.author.img + '"><div class="media-body"><div class="media-body-text"><div class="media-heading"><small class="float-right text-muted"><span class="timeStamp">' + format.time(comment.date) + '</span></small><h6><a href="../profile/' + comment.author.id + '"><strong>' + comment.author.name + ': </strong></a></h6></div>' + comment.content + '</div</div></li>';
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



$(document).on("click", ".like", function(event) {
  var $this = $(this);
  var url = "http://localhost:3000/post/like/" + profileId + '/' + $this.closest('.post').attr('id')
  ajax.request(url, {}, 'POST', $this, ajax.callbacks.newLike)
})


$(document).on("click", ".likes", function(event) {
    var url = "http://localhost:3000/post/likes/" + $(this).closest('.post').attr('id');
    ajax.request(url, {}, 'GET', null, function(response) {
      format.modal.user(response, 'Likes')
    })
    event.preventDefault();
})


$('#Followers, #Following').on("click", function(event) {
  var collection = $(this).attr('id')
  var url = "http://localhost:3000/user/" + collection + '/' + profileId;
  ajax.request(url, {}, 'GET', null, function(response) {
    format.modal.user(response, collection)
  })
  event.preventDefault();
})

$(document).on('click', '.follow', function(event) {
  $this = $(this);
  ajax.request("http://localhost:3000/user/addFollowing/" + $this.attr('id'), {}, 'POST')
  $this.html('Following <span class="icon icon-check"></span>').addClass('disabled')
})


//==========USER MANAGEMENT=================
$(forms.avatar.input).change(() => {
  format.modal.avatar.load()
  $('#modal').click()
  format.modal.avatar.preview()
})

$(document).on('click', '#av-post', function(event) {
  $('#av-form').submit()
  format.modal.avatar.load()
})

$(document).on('click', '#av-cancel', function(event) {
  $('#userModal').find('.close').click()
})
