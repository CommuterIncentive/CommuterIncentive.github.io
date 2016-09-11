$(document).ready(function(){
  // console.log("hello world")
  addWinners()
  $('#refresh').click(updateResults)
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
      var rank = i + 1
      $('table tr:last').after(
        '<tr class=' + klass +'><td>'+ rank + '</td><td><img src="'+person.avatar+'"></img></td><td>' + person.name + '</td><td>' + person.points + '</td></tr>'
        )
    }
  });
}

function updateResults(){
  $.getJSON('/data/change_stats.json', function(data){
    var peeps = data.people.sort(function(a, b){
      if (a.points < b.points){
        return 1
      }
      if (a.points > b.points){
        return -1
      }
      return 0
    })
    $("table").find("tr:gt(0)").remove();
    for (var i= 0; i < peeps.length; i++) {
      var person = peeps[i]
      var klass = i === 0 ? 'winner' : 'not'
      var rank = i + 1
      $('table tr:last').after(
        '<tr class=' + klass +'><td>'+ rank + '</td><td><img src="'+person.avatar+'"></img></td><td>' + person.name + '</td><td>' + person.points + '</td></tr>'
        )
    }
})
}
