$(document).ready(function(){

  $('button#stats').click(slide)
  $('button#addMore').click(addtoStephanie)

})

function slide() {
  // $('img').addClass('slider')
  setTimeout($('img').addClass('slider'), 5000)
  $('img').addClass('closed')
}
function addtoStephanie() {
  console.log('hello')
  $.ajax({
    method: "POST",
    url: "/data/stats.json",
    data: {'hello': 'world'}
  })
  .success(function(data){
    console.log(data)

  })
  .fail(function(error){
    console.log(error)
  });
  // $("#addHere").append('HELLO')
}
