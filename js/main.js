/**
 * Created by ansarimofid on 17/08/17.
 */
function initMap() {

  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 23.156006, lng: 72.666237},
    zoom: 13
  });

  // initialising bound
  var bounds = new google.maps.LatLngBounds();

  // Initalizing info window
  var largeInfoWindow = new google.maps.InfoWindow();


  var markerList = [
    {title: 'NID Collage', location: {lat: 23.187147, lng: 72.6330879}, index:0},
    {title: 'Pandit Deendayal Petroleum University', location: {lat: 23.156006, lng: 72.666237},  index:1},
    {title: 'Gujarat National Law University', location: {lat: 23.155102, lng: 72.662572}, index:2},
    {
      title: 'Dhirubhai Ambani Institute of Information and Communication Technology',
      location: {lat: 23.189248, lng: 72.629019}, index:3
    }];

// Initialiszng markers
  var markers = [];

  function initMarkers() {
    // creating marker from places
    for (var i = 0; i < markerList.length; i++) {
      var marker = new google.maps.Marker({
        position: markerList[i].location,
        map: map,
        title: markerList[i].title,
        animation: google.maps.Animation.DROP,
        id: i
      });

      markers.push(marker);

      bounds.extend(marker.position);

      // adding info window to marker
      marker.addListener('click', function () {
        $this = this;
        populateInfoWindow(this, largeInfoWindow)
      });
    }
  }

  //refresh Marker based on Filter
  function refreshMarkers(markerList) {
    hideListing(markers);
    console.log(markerList());

    markerList().forEach(function (data) {
      markers[data.index].setMap(map);
    });
  }

  //Show single marker
  function showOnly(markerIndex) {
    populateInfoWindow(markers[markerIndex], largeInfoWindow);
    bounds.extend(markers[markerIndex].position);
    map.fitBounds(bounds)
  }

  // function to hide all the marker
  function hideListing(markers_l) {
    for (var i = 0; i < markers_l.length; i++) {
      markers_l[i].setMap(null);
    }
  }

// Info widow function
  function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick',function(){
        infowindow.setMarker = null;
      });

      if (marker.getAnimation() != null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ marker.setAnimation(null); }, 750);
      }
    }
  }


  function Marker(data) {
    this.title = data.title;
    this.location = data.location;
  }

  function MarkerListViewModel() {
    var self = this;

    console.log("From marker");

    self.listFilter = ko.observable('');

    self.markerList = markerList;

    self.markers = ko.computed(function () {
      var filter = self.listFilter();


      if (filter === '') {
        return self.markerList
      } else {
        var tempList = self.markerList.slice();
        return tempList.filter(function (marker) {
          return marker.title.toLowerCase().indexOf(filter.toLowerCase()) > -1
        })
      }
    });

    self.filterList = function () {

    };

    self.refreshMarkers = function () {
      refreshMarkers(self.markers)
    };

    self.itemClicked = function (markerIndex) {
      showOnly(markerIndex);
      // console.log("I'm"+index);
    }
  }

  initMarkers();
  var MLVM = new MarkerListViewModel()
  ko.applyBindings(MLVM);

  MLVM.listFilter.subscribe(function () {
    MLVM.refreshMarkers();
  })
}