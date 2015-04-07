/* global L, shoestring */

(function() {
  'use strict';

  L.mapbox.accessToken = 'pk.eyJ1IjoidGV4YXN0cmlidW5lIiwiYSI6Ilo2eDhZWmcifQ.19qcXfOTN6ulkGW5oouiPQ';
  var map = L.mapbox.map('map', 'examples.map-i86nkdio').setView([40, -74.50], 9);
  map.scrollWheelZoom.disable();
  var layer = L.mapbox.featureLayer().addTo(map);

  var tbody = shoestring('#tbody');
  var agendaEntries = shoestring('#agenda-entries');

  shoestring.get('assets/data/tracker.json', function(res) {
    var data = JSON.parse(res).reverse();
    var tableBody = '';

    for (var i = 0, len = data.length; i < len; i++) {
      if (data[i].lat && data[i].lon) {
        var marker = L.marker([data[i].lat, data[i].lon]);
        marker.bindPopup('<strong>' + data[i].location + '</strong><br>' + data[i].venue + '<br>' + data[i].date);
        layer.addLayer(marker);
      }

      tableBody += '<tr>' +
        '<td data-title="Date"><p>' + data[i].date + '</p></td>' +
        '<td data-title="Venue"><p>' + data[i].venue + '</p></td>' +
        '<td data-title="Location"><p>' + data[i].location + '</p></td>' +
        '<td data-title="Description">' + data[i].description_md + '</td>';
    }

    tbody.html(tableBody);
    map.fitBounds(layer.getBounds());
  });

  shoestring.get('assets/data/agenda.json', function(res) {
    var data = JSON.parse(res);
    var entries = '';

    for (var i = 0, len = data.length; i < len; i++) {
      entries += '<div class="entry">';
      entries += '<ul class="date">';
      entries += data[i].date ? '<li>' + data[i].date + '</li>' : '';
      entries += data[i].venue ? '<li>' + data[i].venue + '</li>' : '';
      entries += data[i].location ? '<li><span class="icon-map-marker"></span> ' + data[i].location + '</li>' : '';
      entries += '</ul>';

      entries += '<ul class="info">';
      entries += '<li><p>' + data[i].description + '</p></li>';
      entries += data[i].host ? '<li class="host"><strong>Host</strong>: ' + data[i].host + '</li>' : '';
      entries += '</ul>';
      entries += '</div>';
    }

    agendaEntries.html(entries);
  });
})();
