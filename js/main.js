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
    {title: 'Adalaj', location: {lat:23.168367, lng: 72.578154}, index:0},
    {title: 'Indroda Nature Park', location: {lat: 23.192648, lng: 72.646181},  index:1},
    {title: 'Akshardham', location: {lat: 23.233017, lng: 72.674728}, index:2},
    {title: 'Mahatma Mandir', location: {lat: 23.231685, lng: 72.633469}, index:3
    },
    {title: 'Sardar Patel Statue', location: {lat: 23.224083, lng: 72.647523}, index:4
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

    map.fitBounds(bounds)
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

      addLocationInfo(marker, infowindow);
      // infowindow.setContent('<div>' + marker.title + '</div>');
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

  function addLocationInfo(marker, infowindow) {
    console.log(marker);
    var req_url = 'https://api.foursquare.com/v2/venues/search?v=20161016';
    var client_id = 'XIQU3FJIHMPZEUPBBNOSQBO53M5M2BIDQQXYBDUGP5VQDSBZ';
    var client_secret = 'XDLSEQG2FOOR3L050IHVGYEA1YH5Y1Z4DTJXEPP0K41GNGGF';
    var ll = marker.getPosition().lat()+','+marker.getPosition().lng();
    var query = marker.title;

    req_url+='&client_id='+client_id+'&client_secret='+client_secret+'&ll='+ll+'&query='+query;

    $.getJSON( req_url, function(data) {
      console.log( data );

      var place = data.response.venues[0];
      var markerHtml = '<strong>'+marker.title+'</strong><br>';

      if (place.categories.length) {
        markerHtml+= '<strong>Category:</strong>'+place.categories[0].name+'<br>';
      }

      markerHtml+= '<strong>Address:</strong>';
      if (place.location.address !== undefined) {
        markerHtml+= place.location.address+'<br>';
      }

      markerHtml+=place.location.city+','+place.location.country;

      infowindow.setContent(markerHtml);

    })
      .fail(function() {
        infowindow.setContent("Error Loading Details");
      })

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

  $(document).ready(function () {
    initMarkers();
    var MLVM = new MarkerListViewModel()
    ko.applyBindings(MLVM);

    MLVM.listFilter.subscribe(function () {
      MLVM.refreshMarkers();
    })

    $('.sidebar-toggle').click(function () {
      $('.opt-box').toggleClass('opt-hide');
    })
  })
}