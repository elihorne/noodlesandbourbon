//
// Welcome and apologies in advance for anything you see here.
// @elihorne


function sliderSetup() {
  $('.slider').each(function(){
    var activeSlider = $(this);
    slider(activeSlider);
  });

  function slider(activeSlider){
    // Sets up the #section-details area of the site
    // Expects a div.slider-nav
    // And div.slider-content

    function sliderContentSwitcher(activeSlider, targetClass) {
      activeSlider.find('.slider-nav a').removeClass('active');
      activeSlider.find('.slider-nav ' + targetClass).addClass('active');
      activeSlider.find('.content').hide();
      activeSlider.find(targetClass).show();
    }

    // Make the first link item active and show corresponding content pane
    var firstSliderItem = activeSlider.find('.slider-nav a:first-child');
    var targetClass = '.' + firstSliderItem.attr('class');
    sliderContentSwitcher(activeSlider, targetClass);

    // a little hacky - need to set min-height for the first item
    $('#section-the-location').css({
      'min-height' : $('#section-the-location').outerHeight()
    });

    // Handle slider nav clicks
    activeSlider.find('.slider-nav a').on('click', function(event){
      event.preventDefault();
      var targetClass = '.' + $(this).attr('class');
      sliderContentSwitcher(activeSlider, targetClass);
    });
  };
} // end sliderSetup();


function pageShuttle(target) {
  var arbitraryVerticalOffset = 40; // so you can see just above the h2

  // manipulate the URL for refreshes
  history.pushState(null, null, target);

  // animate to the content section
  $('html, body').animate({
    scrollTop: $(target).offset().top - arbitraryVerticalOffset
  }, 1000);
}


function linkHandler() {
  // Intercept all links
  $('a').on('click', function(event){

    // Check if this is a 'go' link that will shuttle the page
    if($(this).hasClass('go')) {
      event.preventDefault();

      var target = $(this).attr('href');
      var url = window.location.href;

      pageShuttle(target);

    // otherwise, check if it should be opened in a new window
    } else {
      event.preventDefault();

      // compare URL patterns
      var noodlesHost = window.location.hostname;
      var parser = document.createElement('a');
      parser.href = $(this).attr('href');

      if(parser.hostname != noodlesHost) {
        // external url
        window.open(parser.href,'_blank');
      }
    }
  });
}  // end linkHandler();




function navSetup() {

  // Watch the window scroll event
  $(window).scroll(function(){
    var navOffset = $('.image-break:first').offset().top - $(window).scrollTop();
    var navHeight = $('.main-nav').outerHeight();
    if(navOffset <= navHeight) {
      $('.main-nav').addClass('fixed');
    } else {
      $('.main-nav').removeClass('fixed');
    }
  });
} // end navSetup();




function RSVPSetup() {

  /*
  step 1 - invited name
  step 2 - invited will/will not attend
  step 3 - guest yes/no
  step 4 - invited food choice
  step 5 - guest food choice
  step 6 - need transportation
  */

  var RSVPForm = $('.rsvp-form');

  // check cookie to see if they've already filled out the RSVP
  if(Cookies.get('hasRSVP')){
    // Straight to success.
    RSVPSuccess();
  } else {
    // hide all steps
    RSVPForm.find('.step').hide();

    // show first two steps (name and attendance status)
    RSVPForm.find('.step-1, .step-2').show();
  }

  // watch for attendance change
  RSVPForm.find('.attendance').change(function(){
    var selectedAttendance = RSVPForm.find('.attendance').val();

    // if they are attending, show guest count and food choice
    if(selectedAttendance === 'yes') {
      RSVPForm.find('.step-3, .step-4, .step-6').show();
      RSVPForm.find('.guests').val('0');
      RSVPForm.find('.guest-pluralization').text('guests');

    // if they are not attending, hide everything but name and attendance
    } else {
      RSVPForm.find('.step-3, .step-4, .step-5, .step-6').hide();
    }
  });

  // watch for guest number change
  RSVPForm.find('.guests').change(function(){
    var selectedGuests = RSVPForm.find('.guests').val();

    // if they aren't bringing guests
    if(selectedGuests === '0') {

      // show invited food choice
      RSVPForm.find('.step-4').show();

      // hide guest food choice
      RSVPForm.find('.step-5').hide();

      // text niceity - pluralize
      RSVPForm.find('.guest-pluralization').text('guests');
    };

    // if they are bringing a guest
    if(selectedGuests === '1') {

      // show guest food choice
      RSVPForm.find('.step-5').show();

      // text niceity - pluralize
      RSVPForm.find('.guest-pluralization').text('guest');
    }
  });

  RSVPForm.find('.submit').on('click', function(event){
    event.preventDefault();

    if(Cookies.get('debug')) {
      // we are debugging, so just go to success
      console.log('RSVP submission skipped');
      RSVPSuccess();
    } else {

      // do some basic validation on the invited name
      var invitedName = RSVPForm.find('.invited-name').val();
      var invitedNamePlaceholder = RSVPForm.find('.invited-name').attr('placeholder');
      if(invitedName === invitedNamePlaceholder || invitedName === '') {
        var invitedNameValidate = false;
        alert('Hey, please provide your name.');
      } else {
        var invitedNameValidate = true;
      }

      // do some basic validation on the guest name
      var guestCount = RSVPForm.find('.guests').val();
      if(guestCount === '1') {
        var guestName = RSVPForm.find('.guest-name').val();
        var guestNamePlaceholder = RSVPForm.find('.guest-name').attr('placeholder');
        if(guestName === guestNamePlaceholder || guestName === '') {
          var guestNameValidate = false;
          alert("We'll need a name for your guest");
        } else {
          var guestNameValidate = true;
        }
      } else {
        // guest count is 0, so no validation required
        var guestNameValidate = true;
      }

      // check that invited name and guest name are real
      if(invitedNameValidate && guestNameValidate) {
        // submit the form
        postRSVP();
      }
    }
  });

  function RSVPSuccess() {
    // set the cookie
    Cookies.set('hasRSVP', 'yes');

    // hide the form
    RSVPForm.hide();

    // show the hotel order form
    $('.rsvp-success').show();

    if(Cookies.get('notAttending')) {
      $('#section-rsvp h2').text("Bummer");
      $('.rooms').hide();
      $('.rsvp-success').append('<p class="big-coming-soon center">We will miss you! Hope to see you soon.</p>');
    } else {
      $('#section-rsvp h2').text("Thanks for RSVP'ing");
    }

    // debug to get rid of the hasRSVPd and notAttending cookies
    if(Cookies.get('debug')) {
      $('.stamp-champagne').on('click', function(){
        Cookies.remove('hasRSVP');
        Cookies.remove('notAttending');
        window.location.reload();
      })
    }
  }

  function postRSVP(){
    var invitedName = RSVPForm.find('.invited-name').val();
    var invitedAttendance = RSVPForm.find('.attendance').val();
    var guestCount = RSVPForm.find('.guests').val();
    var guestName = RSVPForm.find('.guest-name').val();
    var invitedFoodChoice = RSVPForm.find('.invited-food').val();
    var guestFoodChoice = RSVPForm.find('.guest-food').val();
    var transportation = RSVPForm.find('.transport').val();

    if(invitedAttendance === 'no') {
      Cookies.set('notAttending', true);
    }

    // post to Google Forms
    $.ajax({
      url: "https://docs.google.com/forms/d/1c6zUDJhTuU1jROzhVULY0rE38aYm1TPXAGeHcCF25g8/formResponse",
      data: {
        'entry.835142579': invitedName,
        'entry.1800779811': invitedAttendance,
        'entry.1707877282': guestCount,
        'entry.1171757403': guestName,
        'entry.1749714160': invitedFoodChoice,
        'entry.1687823027': guestFoodChoice,
        'entry.779611491': transportation
      },
      type: "POST",
      dataType: "xml",
      statusCode: {
        0: function() {
          // success
          RSVPSuccess();
        },
        200: function() {
          // also success. WTF.
          RSVPSuccess();
        }
      }
    });
  }
};




function debugSetup(){


  // instrument the debug links in the UI
  function addDebugLink(){
   $('.jack-stamp').prepend('<span class="debug-step-1"></span>');
   $('.main-footer').prepend('<span class="debug-step-2">Turn on Debug Mode</span>');
   $('.main-footer').prepend('<span class="debug-off">Turn off Debug Mode</span>');

   // handle the initial click
   $('.debug-step-1').on('click', function(){
     $('.debug-step-2').show();
   });

   // handle the secondary click
   $('.debug-step-2').on('click', function(){
     turnDebugOn();
     window.location.reload();
   });

   // support turning off debug mode
   $('.debug-off').on('click', function(){
     turnDebugOff();
   });
  }

  // init
  addDebugLink();

  function turnDebugOn() {
    $('.debug-step-2').hide();
    $('.debug-off').show();
    Cookies.set('debug', 'on');
    console.log('debug is on');
  }

  function turnDebugOff() {
    Cookies.remove('debug');
    window.location.reload();
  }

  // check if debug mode should already be on
  if(Cookies.get('debug')){
    turnDebugOn();
  };

}

function urlIntercept(){
  // check the hash and see if anything fancy needs to be done
  var urlHash = window.location.hash;

  if(urlHash === '#book-rooms') {
    // proceed directly to room booking, but don't set the cookie
    console.log('urlHash matched book rooms');
    $('.rsvp-form').hide();
    $('.rsvp-success').show();
    pageShuttle('#section-rsvp');
  } else {
    pageShuttle(urlHash);
  }
}



function photoSetup(){

  // photo Data
  var photoList = [
    [
      'photo-bg01.jpg',
      'Paris, France - 2014'
    ],
    [
      'photo-bg02.jpg',
      'Reykjavik, Iceland - 2011'
    ],
    [
      'photo-bg04.jpg',
      'Ko Phi Phi, Thailand - 2012'
    ],
    [
      'photo-bg05.jpg',
      'Vieques, Puerto Rico - 2013'
    ],
    [
      'photo-bg06.jpg',
      'Kyoto, Japan - 2013'
    ],
    [
      'photo-bg07.jpg',
      'Petra, Jordan - 2013'
    ],
    [
      'photo-bg08.jpg',
      'Amman, Jordan - 2013'
    ],
    [
      'photo-bg09.jpg',
      'Cliffs of Moher, Ireland - 2013'
    ],
    [
      'photo-bg11.jpg',
      'Punta Cana, Dominican Republic - 2014'
    ],
    [
      'photo-bg12.jpg',
      'Punta Cana, Dominican Republic - 2014'
    ],
    [
      'photo-bg13.jpg',
      'Penang, Malaysia - 2015'
    ],
    [
      'photo-bg14.jpg',
      'Ankor Wat, Cambodia - 2015'
    ],
    [
      'photo-bg15.jpg',
      'Mui Ne, Vietnam - 2015'
    ],
    [
      'photo-bg16.jpg',
      'Da Lat, Vietnam - 2015'
    ],
    [
      'photo-bg17.jpg',
      'Luang Prabang, Laos - 2015'
    ],
    [
      'photo-bg18.jpg',
      'Ha Long Bay, Vietnam - 2015'
    ],
    [
      'photo-bg19.jpg',
      'Chiang Mai, Thailand - 2015'
    ],
    [
      'photo-bg20.jpg',
      'Mandalay, Myanmar - 2015'
    ],
    [
      'photo-bg21.jpg',
      'Bagan, Myanmar - 2015'
    ],
    [
      'photo-bg22.jpg',
      'Bagan, Myanmar - 2015'
    ],
    [
      'photo-bg23.jpg',
      'Bagan, Myanmar - 2015'
    ],
    [
      'photo-bg25.jpg',
      'Inle Lake, Myanmar - 2015'
    ],
    [
      'photo-bg26.jpg',
      'Ko Tao, Thailand - 2015'
    ],
    [
      'photo-bg27.jpg',
      'Boracay, Philippines - 2015'
    ],
    [
      'photo-bg28.jpg',
      'Brooklyn, New York - 2015'
    ],
    [
      'photo-bg29.jpg',
      'Big Sur, California - 2015'
    ],
    [
      'photo-bg30.jpg',
      'Brooklyn, New York - 2015'
    ],
    [
      'photo-bg31.jpg',
      'Arenal, Costa Rica - 2015'
    ],
    [
      'photo-bg32.jpg',
      'Cappadocia, Turkey - 2015'
    ],
    [
      'photo-bg33.jpg',
      'Cappadocia, Turkey - 2015'
    ],
    [
      'photo-bg34.jpg',
      'Cappadocia, Turkey - 2015'
    ],
    [
      'photo-bg35.jpg',
      'Cappadocia, Turkey - 2015'
    ],
    [
      'photo-bg36.jpg',
      'Cappadocia, Turkey - 2015'
    ],
    [
      'photo-bg37.jpg',
      'Maui, Hawaii - 2016'
    ],
    [
      'photo-bg38.jpg',
      'Maui, Hawaii - 2016'
    ]
  ]

  // shuffle utility to randomize photos on load
  function shuffle(a) {
      var j, x, i;
      for (i = a.length; i; i -= 1) {
          j = Math.floor(Math.random() * i);
          x = a[i - 1];
          a[i - 1] = a[j];
          a[j] = x;
      }
  }

  shuffle(photoList);

  // add the images to the page
  $('.content-section').each(function(index){
    var contentSection = $(this);
    var imageBreak = '<section class="image-break" data-parallax="scroll" data-image-src="/img/cover/' + photoList[index][0] + '"><span class="info">'+photoList[index][1]+'</span></section>';
    $(imageBreak).insertAfter(contentSection);
  });
}

function init() {

  linkHandler();
  photoSetup();
  navSetup();
  sliderSetup();
  RSVPSetup();
  urlIntercept();
  debugSetup();
}

// start your engines
init();
