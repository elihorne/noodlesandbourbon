function slider(activeSlider){
  activeSlider.find('.content:first-child').show();
  activeSlider.find('.slider-nav a:first-child').addClass('active');
  activeSlider.find('.slider-nav a').on('click', function(event){
    event.preventDefault();
    activeSlider.find('.slider-nav a').removeClass('active');
    var targetSliderSection = '.' + $(this).attr('class');
    //console.log(targetSliderSection);
    $(this).addClass('active');

    activeSlider.find('.content').hide();
    activeSlider.find(targetSliderSection).show();
    window.location
  });
}

$('.slider').each(function(){
  var activeSlider = $(this);
  slider(activeSlider);
});

function stickyNav() {
  //$('.content-section h2').each(function(){
    //var text = $(this).text();
    //var anchor = $(this).parent().attr('id');
    //$('.main-nav').append('<a class="go" href="#'+anchor+'">'+text+'</a>')
  //});

  $('.go').on('click', function(event){
    event.preventDefault();
    var target = $(this).attr('href');
    var url = window.location.href
    history.pushState(null, null, target);
    var arbitraryVerticalOffset = 40; // so you can see just above the h2
    $('html, body').animate({
      scrollTop: $(target).offset().top - arbitraryVerticalOffset
    }, 1000);
  });

  $(window).scroll(function(){
    //console.log('scroll');
    var navOffset = $('.image-break:first').offset().top - $(window).scrollTop();
    var navHeight = $('.main-nav').outerHeight();
    //console.log('outerheight = ' + navHeight);
    //console.log(navOffset);
    if(navOffset <= navHeight) {
      $('.main-nav').addClass('fixed');
    } else {
      $('.main-nav').removeClass('fixed');
    }
  });
}

function FAQ() {
  $('.faq-list').addClass('collapsed');
  $('.faq-list li:gt(2)').hide();
  $('.more-faq').on('click', function(event){
    event.preventDefault();
    $('.more-faq').hide();
    $('.faq-list').removeClass('collapsed');
    $('.faq-list li').fadeIn();

  });
}

function RSVP() {

  /*
  step 1 - invited name
  step 2 - invited will/will not attend
  step 3 - guest yes/no
  step 4 - invited food choice
  step 5 - guest food choice
  step 6 - need transportation
  */

  // check cookie to see if they've already filled out the RSVP

  // if no RSVP
  $('.rsvp-success').hide();


  if(!$('.rsvp-form').hasClass('show-all')) {
    $('.rsvp-form .step').hide();
  }
  $('.rsvp-form .step-1').show();
  $('.rsvp-form .step-2').show();

  $('.rsvp-form .attendance').change(function(){
    var selectedAttendance = $('.rsvp-form .attendance').val();
    if(selectedAttendance === 'yes') {
      $('.rsvp-form .step-3').show();
      $('.rsvp-form .step-4').show();
      $('.rsvp-form .step-6').show();
      $('.rsvp-form .guests').val('0');
      $('.rsvp-form .guest-pluralization').text('guests');
    } else {
      $('.rsvp-form .step-3, .rsvp-form .step-4, .rsvp-form .step-5, .rsvp-form .step-6').hide();
    }
  });

  $('.rsvp-form .guests').change(function(){
    var selectedGuests = $('.rsvp-form .guests').val();
    if(selectedGuests === '0') {
      $('.rsvp-form .step-4').show();
      $('.rsvp-form .step-5').hide();
      $('.rsvp-form .guest-pluralization').text('guests');
    };
    if(selectedGuests === '1') {

      $('.rsvp-form .step-5').show();
      $('.rsvp-form .guest-pluralization').text('guest');
    }
  });

  $('.rsvp-form .submit').on('click', function(event){
    event.preventDefault();
    if($('body').hasClass('debug')) {
      // we are debugging, so just show the hotel info
      console.log('RSVP submission skipped');
      RSVPSuccess();
    } else {

      var invitedName = $('.rsvp-form .invited-name').val();
      var invitedNamePlaceholder = $('.rsvp-form .invited-name').attr('placeholder');
      if(invitedName === invitedNamePlaceholder || invitedName === '') {
        var invitedNameValidate = false;
        alert('Hey, please provide your name.');
      } else {
        var invitedNameValidate = true;
      }

      var guestCount = $('.rsvp-form .guests').val();
      if(guestCount === '1') {
        var guestName = $('.rsvp-form .guest-name').val();
        var guestNamePlaceholder = $('.rsvp-form .guest-name').attr('placeholder');
        if(guestName === guestNamePlaceholder || guestName === '') {
          var guestNameValidate = false;
          alert("We'll need a name for your guest");
        } else {
          var guestNameValidate = true;
        }
      } else {
        var guestNameValidate = true;
      }

      if(invitedNameValidate && guestNameValidate) {
        // check that invited name and guest name are real
        // submit the form
        postRSVP();
      }
    }
  });

  function RSVPSuccess() {
    // set the cookie
    // hide the form
    // show the hotel order form
    $('.rsvp-form').hide();
    $('.rsvp-success').show();

    $('#section-rsvp h2').text("Thanks for RSVP'ing");

  }

  function postRSVP(){
    var invitedName = $('.rsvp-form .invited-name').val();
    var invitedAttendance = $('.rsvp-form .attendance').val();
    var guestCount = $('.rsvp-form .guests').val();
    var guestName = $('.rsvp-form .guest-name').val();
    var invitedFoodChoice = $('.rsvp-form .invited-food').val();
    var guestFoodChoice = $('.rsvp-form .guest-food').val();
    var transportation = $('.rsvp-form .transport').val();

    console.log('invitedName = ' + invitedName);
    console.log('invitedAttendance = ' + invitedAttendance);
    console.log('guestCount = ' + guestCount);
    console.log('guestName = ' + guestName);
    console.log('invitedFoodChoice = ' + invitedFoodChoice);
    console.log('guestFoodChoice = ' + guestFoodChoice);
    console.log('transportation = ' + transportation);

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
          // success
          RSVPSuccess();
        }
      }
    });
  }

};

var coverPhotosList = [
  'photo-bg01.jpg',
  'photo-bg02.jpg',
  'photo-bg04.jpg',
  'photo-bg05.jpg',
  'photo-bg06.jpg',
  'photo-bg07.jpg',
  'photo-bg08.jpg',
  'photo-bg09.jpg',
  'photo-bg11.jpg',
  'photo-bg12.jpg',
  'photo-bg13.jpg',
  'photo-bg14.jpg',
  'photo-bg15.jpg',
  'photo-bg16.jpg',
  'photo-bg17.jpg',
  'photo-bg18.jpg',
  'photo-bg19.jpg',
  'photo-bg20.jpg',
  'photo-bg21.jpg',
  'photo-bg22.jpg',
  'photo-bg23.jpg',
  'photo-bg25.jpg',
  'photo-bg26.jpg',
  'photo-bg27.jpg',
  'photo-bg28.jpg',
  'photo-bg29.jpg',
  'photo-bg30.jpg',
  'photo-bg31.jpg',
  'photo-bg32.jpg',
  'photo-bg33.jpg',
  'photo-bg34.jpg',
  'photo-bg35.jpg',
  'photo-bg36.jpg',
  'photo-bg37.jpg',
  'photo-bg38.jpg'
]

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

function setup(){
  function addDebugLink(){
   $('.jack-stamp').prepend('<span class="debug-step-1"></span>');
   $('.main-footer').prepend('<span class="debug-step-2">Turn on Debug Mode</span>');
   $('.main-footer').prepend('<span class="debug-off">Turn off Debug Mode</span>');

   $('.debug-step-1').on('click', function(){
     $('.debug-step-2').show();
   });

   $('.debug-step-2').on('click', function(){
     turnDebugOn();
     window.location.reload();
   });

   $('.debug-off').on('click', function(){
     turnDebugOff();

   });
  }

  addDebugLink();

  function turnDebugOn() {
    $('.debug-step-2').hide();
    $('.debug-off').show();
    Cookies.set('debug', 'on');
    $('body').toggleClass('debug');
    console.log('debug is on');
  }

  function turnDebugOff() {
    Cookies.remove('debug');
    console.log('debug is off');
    window.location.reload();
  }

  if(Cookies.get('debug')){
    turnDebugOn();
  };

}

function coverPhotos(){
  shuffle(coverPhotosList);
  $('.image-break').each(function(index){
    $(this).data('image-src', '/img/cover/' + coverPhotosList[index]);
    if($('body').hasClass('debug')) {
      $(this).prepend('<span class="debug">'+coverPhotosList[index]+'</span>');
    }
  });
}

setup();

coverPhotos();
RSVP();
stickyNav();
FAQ();
