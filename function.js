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
  $('body').append('<nav class="sticky-nav"></nav>');
  $('.main-nav a').each(function(){
    var clonedItem = $(this).clone();
    $('.sticky-nav').append(clonedItem);
  });
}

//stickyNav();
