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

  // Markers list array
  var markerList = [
    {title: 'Adalaj', location: {lat: 23.168367, lng: 72.578154}, index: 0},
    {title: 'Indroda Nature Park', location: {lat: 23.192648, lng: 72.646181}, index: 1},
    {title: 'Akshardham', location: {lat: 23.233017, lng: 72.674728}, index: 2},
    {
      title: 'Mahatma Mandir', location: {lat: 23.231685, lng: 72.633469}, index: 3
    },
    {
      title: 'Sardar Patel Statue', location: {lat: 23.224083, lng: 72.647523}, index: 4
    }];

// Initialisng markers
  var markers = [];

  // initialises markers from list
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
      marker.addListener('click', markerClickHandler);
    }

    // Filts bound as per markers
    map.fitBounds(bounds);
  }

  // Handles click event of marker
  var markerClickHandler = function ($this) {
    $this = this;
    populateInfoWindow(this, largeInfoWindow);
  };

  //refresh Marker based on Filter
  function refreshMarkers(markerList) {
    // hides all markers
    hideListing(markers);
    markerList().forEach(function (data) {
      markers[data.index].setMap(map);
    });
  }

  //Show details about single marker
  function showOnly(markerIndex) {
    // calls infowindow function
    populateInfoWindow(markers[markerIndex], largeInfoWindow);
    bounds.extend(markers[markerIndex].position);
    map.fitBounds(bounds);
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

      addLocationInfo(marker, infowindow);
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function () {
        infowindow.setMarker = null;
      });

      // Animates on opening infowindow
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        // stops animation after some time
        setTimeout(function () {
          marker.setAnimation(null);
        }, 750);
      }
    }
  }

  // Adds location info from 'foursquare api' to infowindow
  function addLocationInfo(marker, infowindow) {
    // console.log(marker);
    var req_url = 'https://api.foursquare.com/v2/venues/search?v=20161016';
    var client_id = 'XIQU3FJIHMPZEUPBBNOSQBO53M5M2BIDQQXYBDUGP5VQDSBZ';
    var client_secret = 'XDLSEQG2FOOR3L050IHVGYEA1YH5Y1Z4DTJXEPP0K41GNGGF';
    var ll = marker.getPosition().lat() + ',' + marker.getPosition().lng();
    var query = marker.title;

    req_url += '&client_id=' + client_id + '&client_secret=' + client_secret + '&ll=' + ll + '&query=' + query;

    // Makes ajax request to load data from third party api
    $.getJSON(req_url, function (data) {
      console.log(data);

      var place = data.response.venues[0];
      var markerHtml = '<strong>' + marker.title + '</strong><br>';

      if (place.categories.length) {
        markerHtml += '<strong>Category:</strong>' + place.categories[0].name + '<br>';
      }

      markerHtml += '<strong>Address:</strong>';
      if (place.location.address !== undefined) {
        markerHtml += place.location.address + '<br>';
      }

      markerHtml += place.location.city + ',' + place.location.country;

      infowindow.setContent(markerHtml);

    })
      .fail(function () {//Called when request fails
        infowindow.setContent("Error Loading Details");
      });

  }

  // Marker model
  function MarkerListViewModel() {
    var self = this;

    // creates marker filter value
    self.listFilter = ko.observable('');

    // initialises marker list
    self.markerList = markerList;

    //filters marker based on supplied filter value
    self.markers = ko.computed(function () {
      var filter = self.listFilter();
      if (filter === '') {
        return self.markerList;
      } else {
        var tempList = self.markerList.slice();
        return tempList.filter(function (marker) {
          return marker.title.toLowerCase().indexOf(filter.toLowerCase()) > -1;
        });
      }
    });

    self.filterList = function () {

    };

    // refreshes markers based on filter value
    self.refreshMarkers = function () {
      refreshMarkers(self.markers);
    };

    // calls when an item is clicked from list
    self.itemClicked = function (markerIndex) {
      showOnly(markerIndex);
    };
  }

  // mapLoadError shows error when google maps failed to load
  mapLoadError = function() {
    alert('Google maps failed to load. Try reloading the page.');
  };

  // Initialises the functiom on document load
  $(document).ready(function () {
    // initialises markers
    initMarkers();

    // Knockoutjs initialisation
    var MLVM = new MarkerListViewModel();
    ko.applyBindings(MLVM);

    // Adds function binding on filter value change
    MLVM.listFilter.subscribe(function () {
      MLVM.refreshMarkers();
    });

    // sidebar toggle for responsiveness
    $('.sidebar-toggle').click(function () {
      $('.opt-box').toggleClass('opt-hide');
    });
  });
}