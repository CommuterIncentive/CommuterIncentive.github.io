$(document).ready(function(){

  $('button#stats').click(slide)
})

function slide() {
  // $('img').addClass('slider')
  setTimeout($('img').addClass('slider'), 5000)
  $('img').addClass('closed')
}
