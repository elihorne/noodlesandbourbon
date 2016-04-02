function slider(activeSlider){
  activeSlider.find('.content:first-child').show();
  activeSlider.find('.slider-nav a:first-child').addClass('active');
  activeSlider.find('.slider-nav a').on('click', function(event){
    event.preventDefault();
    activeSlider.find('.slider-nav a').removeClass('active');
    var targetSliderSection = '.' + $(this).attr('class');
    console.log(targetSliderSection);
    $(this).addClass('active');

    activeSlider.find('.content').hide();
    activeSlider.find(targetSliderSection).fadeIn();
    window.location
  });
}

$('.slider').each(function(){
  var activeSlider = $(this);
  slider(activeSlider);
});

function stickyNav() {
  $('.content-section h2').each(function(){
    var text = $(this).text();
    var anchor = $(this).parent().attr('id');
    $('.main-nav').append('<a class="go" href="#'+anchor+'">'+text+'</a>')
  });

  $('.go').on('click', function(event){
    event.preventDefault();
    var target = $(this).attr('href');
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
    console.log(navOffset);
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
  $('.rsvp-form .step').hide();
  $('.rsvp-form .step-1').show();
  $('.rsvp-form .step-2').show();

  $('.rsvp-form .attendance').change(function(){
    var selectedAttendance = $('.rsvp-form .attendance').val();
    if(selectedAttendance === 'yes') {
      $('.rsvp-form .step-3').show();
      $('.rsvp-form .step-4').show();
    } else {
      $('.rsvp-form .step-3, .rsvp-form .step-4').hide();
    }
  });

  $('.rsvp-form .guests').change(function(){
    var selectedGuests = $('.rsvp-form .guests').val();
    if(selectedGuests === '0') {
      $('.rsvp-form .step-4').show();
      $('.rsvp-form .step-5').hide();
    };
    if(selectedGuests === '1') {
      $('.rsvp-form .step-5').show();
    }
  });

  $('.rsvp-form .submit').on('click', function(event){
    event.preventDefault();
    var invitedName = $('.rsvp-form .invited-name').val();
    var invitedNamePlaceholder = $('.rsvp-form .invited-name').attr('placeholder');
    if(invitedName === invitedNamePlaceholder || invitedName === '') {
      alert('invited name problem');
    }

    var guestCount = $('.rsvp-form .guests').val();
    if(guestCount === '1') {
      var guestName = $('.rsvp-form .guest-name').val();
      var guestNamePlaceholder = $('.rsvp-form .guest-name').attr('placeholder');
      if(guestName === guestNamePlaceholder || guestName === '') {
        alert('guest name problem');
      }
    }

  })

};

RSVP();
stickyNav();
FAQ();
