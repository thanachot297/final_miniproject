// ======= กำหนดตัวแปร Element ต่าง ๆ =======
const home = document.getElementById("home");
const mapDiv = document.getElementById("map");
const contact = document.getElementById("contact");
const legend = document.getElementById("legend");
const searchContainer = document.getElementById("searchContainer");

// ======= ฟังก์ชันสลับหน้า =======
function hideAllSections() {
  home.style.display = "none";
  mapDiv.style.display = "none";
  contact.style.display = "none";
  legend.style.display = "none";
  searchContainer.style.display = "none";
}

function showHome() {
  hideAllSections();
  home.style.display = "block";
}

function showMap() {
  hideAllSections();
  mapDiv.style.display = "block";
  legend.style.display = "block";
  searchContainer.style.display = "flex";
  // ปรับขนาดแผนที่ใหม่หลังแสดงผล เพื่อไม่ให้ Tile หาย
  setTimeout(() => { map.invalidateSize(); }, 300);
}

function showContact() {
  hideAllSections();
  contact.style.display = "block";
}

// ======= สร้าง Map และ Layer Group =======
const hospitalLayer = L.layerGroup();
const universityLayer = L.layerGroup();

const map = L.map('mapCanvas')
  .addLayer(hospitalLayer)
  .addLayer(universityLayer)
  .setView([13.7563, 100.5018], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '© OpenStreetMap'
}).addTo(map);

// ======= ข้อมูลเขต (Districts) =======
const districts = [
  {
    "name": "เขตพระนคร",
    "population": 83493,
    "density": 5553.98,
    "lat": 13.752679,
    "lon": 100.497039
  },
  {
    "name": "เขตดุสิต",
    "population": 104478,
    "density": 5423.2,
    "lat": 13.781116,
    "lon": 100.516596
  },
  {
    "name": "เขตหนองจอก",
    "population": 78973,
    "density": 1572.57,
    "lat": 13.850388,
    "lon": 100.854563
  },
  {
    "name": "เขตบางรัก",
    "population": 178350,
    "density": 1439.94,
    "lat": 13.728009,
    "lon": 100.523484
  },
  {
    "name": "เขตบางเขน",
    "population": 111052,
    "density": 13293.27,
    "lat": 13.867649,
    "lon": 100.632533
  },
  {
    "name": "เขตบางกะปิ",
    "population": 96211,
    "density": 3420.96,
    "lat": 13.770532,
    "lon": 100.643088
  },
  {
    "name": "เขตปทุมวัน",
    "population": 65275,
    "density": 6803.02,
    "lat": 13.740334,
    "lon": 100.533236
  },
  {
    "name": "เขตป้อมปราบศัตรูพ่าย",
    "population": 99729,
    "density": 8349.72,
    "lat": 13.750222,
    "lon": 100.508841
  },
  // … (เพิ่มข้อมูลเขตอื่น ๆ ตามเดิมทั้งหมด)
  {
    "name": "เขตบางขุนเทียน",
    "population": 41646,
    "density": 7522.76,
    "lat": 13.600999,
    "lon": 100.426177
  },
  {
    "name": "เขตภาษีเจริญ",
    "population": 43914,
    "density": 7932.44,
    "lat": 13.72545,
    "lon": 100.442844
  },
  {
    "name": "เขตหนองแขม",
    "population": 78602,
    "density": 7370.09,
    "lat": 13.694298,
    "lon": 100.354977
  },
  {
    "name": "เขตราษฏร์บูรณะ",
    "population": 39310,
    "density": 20357.33,
    "lat": 13.674636,
    "lon": 100.499135
  }
];

// ======= ฟังก์ชันกำหนดสีตามความหนาแน่น =======
function getColor(d) {
  return d > 20000 ? '#800026' :
         d > 15000 ? '#BD0026' :
         d > 10000 ? '#E31A1C' :
         d > 7000  ? '#FD8D3C' :
         d > 4000  ? '#FED976' :
                     '#FFEDA0';
}

// ======= วาดวงกลม CircleMarker สำหรับแต่ละเขต =======
districts.forEach(d => {
  const popupText = `
    <strong>เขต:</strong> ${d.name}<br>
    <strong>ประชากร:</strong> ${d.population.toLocaleString('th-TH')} คน<br>
    <strong>ความหนาแน่น:</strong> ${d.density.toLocaleString('th-TH')} คน/ตร.กม.<br>
    <strong>พิกัด:</strong> (${d.lat.toFixed(6)}, ${d.lon.toFixed(6)})
  `;
  L.circleMarker([d.lat, d.lon], {
    radius: 9,
    fillColor: getColor(d.density),
    color: "#1f2937",
    weight: 1,
    fillOpacity: 0.85
  }).addTo(map).bindPopup(popupText);
});

// ======= วาด GeoJSON จุดเขต (District Boundaries) =======
var districtData = {
  "type": "FeatureCollection",
  "features": [
    // … (ข้อมูล GeoJSON เดิมทั้งหมด)
  ]
};

L.geoJSON(districtData, {
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
    const info = '<strong>เขต:</strong> ' + props.dname + '<br>' +
                 '<strong>ประชากร:</strong> ' + (props.population ? props.population.toLocaleString('th-TH') + ' คน' : '-') + '<br>' +
                 '<strong>ความหนาแน่น:</strong> ' + (props.density ? props.density.toLocaleString('th-TH') + ' คน/ตร.กม.' : '-') + '<br>' +
                 '<strong>ชาย:</strong> ~50%<br>' +
                 '<strong>หญิง:</strong> ~50%';
    layer.bindTooltip(info, { sticky: true });
  }
}).addTo(map);

// ======= เพิ่ม Marker โรงพยาบาล และ มหาวิทยาลัย =======
// ไอคอนโรงพยาบาล
const hospitalIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448513.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -28]
});
// ไอคอนมหาวิทยาลัย
const universityIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/7439/7439595.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -26]
});

// ตัวอย่าง Marker โรงพยาบาล
L.marker([13.89407763, 100.5614338], { icon: hospitalIcon })
  .addTo(hospitalLayer)
  .bindPopup("<strong>โรงพยาบาลมงกุฎวัฒนะ</strong><br>34/40 ถนนแจ้งวัฒนะ แขวงทุ่งสองห้อง เขตหลักสี่ กรุงเทพฯ 10210<br>📞 0 2574 5000 -9<br>📍 พิกัด: (13.89407763, 100.5614338)");

L.marker([13.88908289, 100.60683], { icon: hospitalIcon })
  .addTo(hospitalLayer)
  .bindPopup("<strong>โรงพยาบาลซีจีเอชโรงพยาบาลทั่วไปขนาดใหญ่</strong><br>290 ถนนพหลโยธิน แขวงอนุสาวรีย์ เขตบางเขน กทม. ประเทศไทย 10220<br>📞 0 2552 8777<br>📍 พิกัด: (13.88908289, 100.60683)");

L.marker([13.8462444, 100.5625848], { icon: hospitalIcon })
  .addTo(hospitalLayer)
  .bindPopup("<strong>โรงพยาบาลภัสรพิบาล เนอสซิ่งโฮม</strong><br>185 ซอยลาดพร้าว 71 (แยกสังคมสงเคราะห์ 5) ถนนลาดพร้าว<br>📞 0 2538 7458<br>📍 พิกัด: (13.7948129, 100.6072648)");

// ตัวอย่าง Marker มหาวิทยาลัย
L.marker([13.77127651, 100.5406394], { icon: universityIcon })
  .addTo(universityLayer)
  .bindPopup("<strong>มหาวิทยาลัย:</strong><br>มหาวิทยาลัยศรีปทุม (วิทยาเขตพญาไท)<br>📍 พิกัด: (13.77127651, 100.5406394)");

L.marker([13.72703019, 100.5230133], { icon: universityIcon })
  .addTo(universityLayer)
  .bindPopup("<strong>มหาวิทยาลัย:</strong><br>วิทยาลัยนานาชาติเซนต์เทเรซา (วิทยาเขตสุรวงศ์)<br>📍 พิกัด: (13.72703019, 100.5230133)");

L.marker([13.76716907, 100.5149959], { icon: universityIcon })
  .addTo(universityLayer)
  .bindPopup("<strong>มหาวิทยาลัย:</strong><br>สถาบันเทคโนโลยีจิตรลดา<br>📍 พิกัด: (13.76716907, 100.5149959)");

// เพิ่ม Layer Control
L.control.layers(null, {
  "🏥 โรงพยาบาล": hospitalLayer,
  "🎓 มหาวิทยาลัย": universityLayer
}, { collapsed: false }).addTo(map);

// ======= ฟังก์ชันค้นหาเขต =======
function searchDistrict() {
  const input = document.getElementById("searchInput").value.trim();
  const found = districts.find(d => d.name === input);
  if (found) {
    map.setView([found.lat, found.lon], 13);
    const popupContent = `
      <strong>เขต:</strong> ${found.name}<br>
      <strong>ประชากร:</strong> ${found.population.toLocaleString('th-TH')} คน<br>
      <strong>ความหนาแน่น:</strong> ${found.density.toLocaleString('th-TH')} คน/ตร.กม.<br>
      <strong>พิกัด:</strong> (${found.lat.toFixed(6)}, ${found.lon.toFixed(6)})
    `;
    L.popup()
      .setLatLng([found.lat, found.lon])
      .setContent(popupContent)
      .openOn(map);
  } else {
    alert("ไม่พบชื่อเขต: " + input);
  }
}

// ======= เมื่อโหลดหน้าเสร็จ ให้แสดง Sidebar Stats กับ Legend =======
document.addEventListener("DOMContentLoaded", function() {
  setTimeout(function() {
    document.getElementById("sidebar-stats").style.display = "block";
    document.getElementById("legend").style.display = "block";
  }, 500);
});
