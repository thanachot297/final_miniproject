L.geoJSON(districtData, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 8,
      fillColor: getColor(feature.properties.density),
      color: "#1f2937",
      weight: 1,
      fillOpacity: 0.85
    });
  },
  onEachFeature: function (feature, layer) {
    const props = feature.properties;
    const popupContent = `
      <strong>เขต:</strong> ${props.dname}<br>
      <strong>ประชากร:</strong> ${props.population.toLocaleString()} คน<br>
      <strong>ความหนาแน่น:</strong> ${props.density.toLocaleString()} คน/ตร.กม.
    `;
    layer.bindPopup(popupContent);
  }
}).addTo(map); // <-- อันนี้คือ Marker

L.geoJSON(districtData, { // <-- อันนี้คือ Layer ที่สร้างขอบเขต แต่ไม่มี fill
  style: function (feature) {
    return {
      color: "#555",
      weight: 1.5,
      opacity: 0.5,
      fillOpacity: 0
    };
  },
  onEachFeature: function (feature, layer) {
    const props = feature.properties;
    const tooltipContent = `
      <strong>เขต:</strong> ${props.dname}<br>
      <strong>ประชากร:</strong> ${props.population.toLocaleString()} คน<br>
      <strong>ความหนาแน่น:</strong> ${props.density.toLocaleString()} คน/ตร.กม.
    `;
    layer.bindTooltip(tooltipContent, { permanent: false, direction: 'auto' });
  }
}).addTo(map);