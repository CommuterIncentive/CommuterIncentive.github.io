$(document).ready(function(){
  // console.log("hello world")
  addWinners()
})


function addWinners() {
  $.getJSON('/data/stats.json', function(data){
    // console.log(data)
    var peeps = data.people.sort(function(a, b){
      if (a.points < b.points){
        return 1
      }
      if (a.points > b.points){
        return -1
      }
      return 0
    })
    for (var i= 0; i < peeps.length; i++) {
      var person = peeps[i]
      var klass = i === 0 ? 'winner' : 'not'
      $('table tr:last').after(
        '<tr class=' + klass +'><td>'+ i + '</td><td><img src="'+person.avatar+'"></img></td><td>' + person.name + '</td><td>' + person.points + '</td></tr>'
        )
    }
  });
}
