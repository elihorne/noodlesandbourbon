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
    $('html, body').animate({
      scrollTop: $(target).offset().top
    }, 1000);
  });

  $(window).scroll(function(){
    //console.log('scroll');
    var navOffset = $('.main-nav-wrap').offset().top - $(window).scrollTop();
    if(navOffset <= 0) {
      $('.main-nav').addClass('fixed');
    } else {
      $('.main-nav').removeClass('fixed');
    }
  });
}

function FAQ() {
  $('.faq-list li:gt(2)').hide();
  $('.more-faq').on('click', function(event){
    event.preventDefault();
    $('.more-faq').hide();
    $('.faq-list li').fadeIn();

  });
}

stickyNav();
FAQ();
