document.addEventListener('DOMContentLoaded', function() {
    const homeLink = document.getElementById('home-link');
    const mapLink = document.getElementById('map-link');
    const homeSection = document.getElementById('home-section');
    const mapSection = document.getElementById('map-section');
    const mapDiv = document.getElementById('map');

    let map; // ประกาศตัวแปร map ภายนอกเพื่อให้เข้าถึงได้ภายหลัง

    // ฟังก์ชันสำหรับแสดงส่วนต่างๆ
    function showSection(sectionToShow) {
        homeSection.style.display = 'none';
        mapSection.style.display = 'none';
        sectionToShow.style.display = 'block';
    }

    // ตัวฟังเหตุการณ์สำหรับแถบนำทาง
    homeLink.addEventListener('click', function(e) {
        e.preventDefault();
        showSection(homeSection);
    });

    mapLink.addEventListener('click', function(e) {
        e.preventDefault();
        showSection(mapSection);
        // สร้างแผนที่เมื่อส่วนแผนที่ถูกแสดงครั้งแรกเท่านั้น
        if (!map) {
            initializeMap();
        } else {
            // ทำให้ขนาดไม่ถูกต้องเพื่อให้แผนที่โหลดไทล์ได้อย่างถูกต้องหลังจากเปลี่ยนสไตล์การแสดงผล
            map.invalidateSize();
        }
    });

    // เริ่มต้นแสดงส่วนหน้าแรกเมื่อโหลดหน้าเว็บ
    showSection(homeSection);

    function initializeMap() {
        map = L.map('map').setView([13.7563, 100.5018], 10); // กำหนดจุดศูนย์กลางที่กรุงเทพฯ

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // --- ข้อมูลความหนาแน่นประชากร (ตัวอย่างสมมติ) ---
        // คุณจะต้องแทนที่ข้อมูลนี้ด้วยข้อมูล GeoJSON จริงของคุณ
        // แต่ละฟีเจอร์ (เขต) ควรมีออบเจกต์ 'properties' ที่มีฟิลด์ 'populationDensity'
        const districtData = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {
                        "name": "เขตพระนคร",
                        "populationDensity": 8000 // คนต่อ ตร.กม.
                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [[100.4900, 13.7600], [100.4950, 13.7650], [100.5000, 13.7600], [100.4900, 13.7600]]
                        ]
                    }
                },
                {
                    "type": "Feature",
                    "properties": {
                        "name": "เขตปทุมวัน",
                        "populationDensity": 15000 // คนต่อ ตร.กม.
                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [[100.5300, 13.7400], [100.5350, 13.7450], [100.5400, 13.7400], [100.5300, 13.7400]]
                        ]
                    }
                },
                {
                    "type": "Feature",
                    "properties": {
                        "name": "เขตบางกะปิ",
                        "populationDensity": 5000 // คนต่อ ตร.กม.
                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [[100.6200, 13.7600], [100.6250, 13.7650], [100.6300, 13.7600], [100.6200, 13.7600]]
                        ]
                    }
                },
                {
                    "type": "Feature",
                    "properties": {
                        "name": "เขตดินแดง",
                        "populationDensity": 12000 // คนต่อ ตร.กม.
                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [[100.5500, 13.7800], [100.5550, 13.7850], [100.5600, 13.7800], [100.5500, 13.7800]]
                        ]
                    }
                },
                {
                    "type": "Feature",
                    "properties": {
                        "name": "เขตวัฒนา",
                        "populationDensity": 10000 // คนต่อ ตร.กม.
                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [[100.5700, 13.7300], [100.5750, 13.7350], [100.5800, 13.7300], [100.5700, 13.7300]]
                        ]
                    }
                }
            ]
        };

        // ฟังก์ชันสำหรับกำหนดสีตามความหนาแน่นของประชากร
        function getColor(d) {
            return d > 12000 ? '#800026' :
                   d > 10000 ? '#BD0026' :
                   d > 8000  ? '#E31A1C' :
                   d > 6000  ? '#FC4E2A' :
                   d > 4000  ? '#FD8D3C' :
                   d > 2000  ? '#FEB24C' :
                   d > 0     ? '#FED976' :
                               '#FFEDA0';
        }

        // สไตล์สำหรับฟีเจอร์ GeoJSON
        function style(feature) {
            return {
                fillColor: getColor(feature.properties.populationDensity),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }

        // เพิ่มเลเยอร์ GeoJSON ลงในแผนที่
        L.geoJson(districtData, {
            style: style,
            onEachFeature: function(feature, layer) {
                if (feature.properties && feature.properties.name && feature.properties.populationDensity) {
                    layer.bindPopup(`<b>${feature.properties.name}</b><br>ความหนาแน่น: ${feature.properties.populationDensity} คน/ตร.กม.`);
                }
            }
        }).addTo(map);

        // --- เพิ่ม Legend ---
        const legend = L.control({position: 'bottomright'});

        legend.onAdd = function (map) {
            const div = L.DomUtil.create('div', 'info legend');
            const densities = [0, 2000, 4000, 6000, 8000, 10000, 12000]; // ช่วงความหนาแน่นประชากร
            const labels = [];
            let from, to;

            div.innerHTML += '<h4>ความหนาแน่นประชากร</h4>';

            for (let i = 0; i < densities.length; i++) {
                from = densities[i];
                to = densities[i + 1];

                labels.push(
                    '<i style="background:' + getColor(from + 1) + '"></i> ' +
                    from + (to ? '&ndash;' + to : '+') + ' คน/ตร.กม.'
                );
            }

            div.innerHTML += labels.join('<br>');
            return div;
        };

        legend.addTo(map);
    }
});