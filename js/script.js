$(document).ready(function(){
  $(".navbar a, #my-home a[href='#about-me'], footer a[href='#my-home']").on('click', function(event) {
  if (this.hash !== "") {
    event.preventDefault();

    let hash = this.hash;

    $('html, body').animate({
      scrollTop: $(hash).offset().top
    }, 1000, () => {
      window.location.hash = hash;
      });
    }
  });
})
