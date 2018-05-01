var $newPost = $('#newPost');
var $postInput = $('#postInput');
var $posts = $('#posts');
var $timestamps = $('.timeStamp');
var $collection = $('.collection');

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

function formatPost(post) {
  var html = '<li class="card media list-group-item p-4 post"><img class="media-object d-flex align-self-start mr-3" src="' + post.author.img + '"><div class="media-body"><div class="media-body-text"><div class="media-heading"><small class="float-right text-muted">' + time_ago(post.date) + '</small><h6><a href="' + post.author.id + '">' + post.author.name + '</a>';
  if (!(post.author.id === post.user.id)) {
    html +='<span class="icon icon-triangle-right"></span><a href="' + post.user.id + '">' + post.user.name + '</a>';
  };
  html += '</h6></div><p>' + post.content + '</p></div></div></li>';
  return html;
}

$newPost.submit(function(event) {
  $.ajax({
    url: "http://localhost:3000" + window.location.pathname + "/newPost",
    data: {
      content: $postInput.val()
    },
    type: 'POST',
    dataType: 'json'
  })
  .done(function(post) {
    $(formatPost(post)).prependTo($posts).hide().slideDown();
    $postInput.val('');
  })
  event.preventDefault();
})


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
    if (response.html) {
      $posts.html(response.html)
    } else {
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

$(".comments").on("click", function(event) {
  var $this  = $(this);
  $this.parent().toggleClass("mb-3");
  $this.parent().parent().parent().children(".comment-list").toggleClass("hidden");
  if (!($this.hasClass("populated"))){
    var postId = $this.parent().parent().parent().parent().attr("id");
    $.ajax({
      url: "http://localhost:3000" + window.location.pathname + '/Feed/' + postId,
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

function formatComment(comment) {
  var html = '<li class="media mb-3"><img class="media-object d-flex align-self-start mr-3" src="' + comment.author.img + '"><div class="media-body"><div class="media-body-text"><div class="media-heading"><small class="float-right text-muted"><span class="timeStamp">' + time_ago(comment.date) + '</span></small><h6><a href=' + comment.author.id + '><strong>' + comment.author.name + ': </strong></a></h6></div>' + comment.content + '</div</div></li>';
  return html
}

$(".com-in").keydown(function(event) {
  var $this = $(this);
  var postId = $this.parent().parent().parent().parent().parent().attr("id");
  if (event.which == 13) {
    $.ajax({
      url: "http://localhost:3000" + window.location.pathname + '/comment/' + postId,
      data: {
        content: $this.val()
      },
      type: 'POST',
      dataType: 'json'
    })
    .done((comment) => {
      $this.parent().parent().before(formatComment(comment))
      $this.val('')
    })
  }
})
