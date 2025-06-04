// สร้างแผนที่
var map = L.map('map').setView([13.7563, 100.5018], 11); // กทม.

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// โหลด geoJSON
fetch('geoJ.geojson')
  .then(response => response.json())
  .then(data => {
    // สร้างสเกลสี
    function getColor(d) {
      return d > 20000 ? '#800026' :
             d > 15000 ? '#BD0026' :
             d > 10000 ? '#E31A1C' :
             d > 5000  ? '#FC4E2A' :
             d > 2000  ? '#FD8D3C' :
             d > 1000  ? '#FEB24C' :
             d > 500   ? '#FED976' :
                         '#FFEDA0';
    }

    function style(feature) {
      return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
      };
    }

    // ใส่ layer ลงแผนที่
    L.geoJson(data, {
      style: style,
      onEachFeature: function (feature, layer) {
        layer.bindPopup('<b>' + feature.properties.name + '</b><br>ความหนาแน่น: ' + feature.properties.density + ' คน/ตร.กม.');
      }
    }).addTo(map);
  });
