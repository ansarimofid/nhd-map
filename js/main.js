/**
 * Created by ansarimofid on 17/08/17.
 */
function initMap() {

  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 23.156006, lng: 72.666237},
    zoom: 13
  });
}


var markerList = [
  {title: 'NID Collage', location: {lat: 23.187147, lng: 72.6330879}},
  {title: 'Pandit Deendayal Petroleum University', location: {lat: 23.156006, lng: 72.666237}},
  {title: 'Gujarat National Law University', location: {lat: 23.155102, lng: 72.662572}},
  {
    title: 'Dhirubhai Ambani Institute of Information and Communication Technology',
    location: {lat: 23.189248, lng: 72.629019}
  }];

function Marker(data) {
  this.title = data.title;
  this.location = data.location;
}

function MarkerListViewModel() {
  var self = this;

  console.log("From marker");

  self.listFilter = ko.observable('');

  // console.log(self.listFilter());

  self.markerList = markerList;

  // self.markers = ko.observableArray(markerList);
  self.markers = ko.computed(function () {
    var filter = self.listFilter();


    if (filter === '') {
      console.log(filter);
      return self.markerList
    } else {
      var tempList = self.markerList.slice();

      console.log("New List");
      console.log("Filter "+filter);
      return tempList.filter(function (marker) {
        console.log(marker);
        console.log(" Res "+marker.title.indexOf(filter))
        return marker.title.toLowerCase().indexOf(filter.toLowerCase()) > -1
      })
    }
  });

  self.filterList = function () {

  }
}

ko.applyBindings(new MarkerListViewModel());