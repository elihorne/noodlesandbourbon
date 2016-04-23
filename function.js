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

function sliderSetup() {
  $('.slider').each(function(){
    var activeSlider = $(this);
    slider(activeSlider);
  });
}


function stickyNav() {
  //$('.content-section h2').each(function(){
    //var text = $(this).text();
    //var anchor = $(this).parent().attr('id');
    //$('.main-nav').append('<a class="go" href="#'+anchor+'">'+text+'</a>')
  //});

  $('a').on('click', function(event){
    if($(this).hasClass('go')) {
      event.preventDefault();
      var target = $(this).attr('href');
      var url = window.location.href
      history.pushState(null, null, target);
      var arbitraryVerticalOffset = 40; // so you can see just above the h2
      $('html, body').animate({
        scrollTop: $(target).offset().top - arbitraryVerticalOffset
      }, 1000);
    } else {
      event.preventDefault();
      var noodlesHost = window.location.hostname;
      var parser = document.createElement('a');
      parser.href = $(this).attr('href');

      if(parser.hostname != noodlesHost) {
        // external url
        window.open(parser.href,'_blank');
      }
    }

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
    $(this).data('image-src', '/img/cover/' + coverPhotosList[index][0]);
    $(this).prepend('<span class="debug">'+coverPhotosList[index][1]+'</span>');
  });
}

setup();

coverPhotos();
RSVP();
stickyNav();
sliderSetup();
FAQ();
