const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

const getDate = function (current, previous) {  
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;
  const elapsed = current - previous;
  if (elapsed < msPerMinute) {
       return Math.round(elapsed/1000) + ' seconds ago';   
  }
  else if (elapsed < msPerHour) {
       return Math.round(elapsed/msPerMinute) + ' minutes ago';   
  }
  else if (elapsed < msPerDay ) {
       return Math.round(elapsed/msPerHour ) + ' hours ago';   
  }
  else if (elapsed < msPerMonth) {
       return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';   
  }
  else if (elapsed < msPerYear) {
       return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';   
  }
  else {
       return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';   
  }
}


const createTweetElement = function(tweet) {
  // create variables for the current date and the date the tweet was posted
  const timestamp = tweet["created_at"];
  const dayNow = Date.now();
  // use the getDate function to determine how long ago our tweet was posted
  const daysAgoPosted = getDate(dayNow, timestamp);
  // pass in our tweet content to the template
  const tweethtml = $(`
    <section class="tweet">
      <article>
        <header class="tweet-header">
          <div class="nameImage">
            <img class="pic" src="/images/profile-hex.png"> 
            <p>${tweet["user"]["name"]}</p>
          </div>
          <p class="hide">${tweet["user"]["handle"]}</p>
        </header>
        <div class="middle">
          <p>${escape(tweet["content"]["text"])}</p>
        </div>
        <div class="border"></div>
        <footer>
          <p>${daysAgoPosted}</p>
          <div class="buttons">
            <button class="btn hide"><i class="fas fa-flag"></i></button>
            <button class="btn hide"><i class="fas fa-retweet"></i></button>
            <button class="btn hide"><i class="fas fa-heart"></i></button>
          </div>
        </footer>
      </article>
    </section>`);
  return tweethtml;
}

const renderTweets = function(tweets) {
  // loop through the array of tweets
  for (let i = 0; i < tweets.length; i++) {
    // call createTweetElement on each tweet object to pass it into our tweet template
    const $tweet = createTweetElement(tweets[i]);
    // post tweet at the top of the list of tweets
    $('#tweet-list').prepend($tweet); 
  }
};

$(document).ready(function() {
  // hide the error message until needed
  $('#error-message').hide();
  const loadTweets = function () {
    // make our ajax get request to load already existing tweets
    $.ajax('http://localhost:8080/tweets', { method: 'GET' })
    .then(function (response) {
      console.log('Success: ', response);
      // pass our response of tweet objects into our renderTweets function
      renderTweets(response);
    });
  }
  loadTweets();

  $('form').on('submit', function(event) {
    // stop navigation away from the current page
    event.preventDefault();
    const charCounter = $('textarea').val().length;
    if (charCounter > 140 || charCounter === 0) {
      // if tweet is empty or too long, display error message
      $('#error-message').slideDown();
    } else {
      // if tweet is valid, hide error message
      $('#error-message').slideUp();
      const tweetText = $(this).serialize();
      // make an ajax post request to create new tweet
      $.ajax({
        method: 'POST',
        url: '/tweets/', 
        data: tweetText,
        success: (tweet) => {
          renderTweets([tweet]);
        }
      })
      // clears the text area
      $('textarea').val("");
      // resets the counter back to 140
      $('.counter').val("140");
    }
  })
});

