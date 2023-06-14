import iconSvg from '../../../assets/marker-icon.svg';

export default async () => {
    const mapEl = document.getElementById('map');
    if (!mapEl) {
        return;
    }

    try {
        const L = await import('leaflet');
        await import('leaflet-gesture-handling');

        const defaultLatlng = [54.4526626, 17.0398293];
        const map = L.map(mapEl, {
            center: defaultLatlng,
            zoom: 13,
            gestureHandling: true
        });
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);



        const coordsInput = document.querySelector('#coordinates')
        const nameInput = document.querySelector('#location-name')
        const descriptionInput = document.querySelector('#location-description')
        const form = document.querySelector('form')
        const marker = L.marker(defaultLatlng).addTo(map);


        const icon = L.icon({
            iconUrl: iconSvg,
            // shadowUrl: 'leaf-shadow.png',

            iconSize: [38, 95],
            shadowSize: [50, 64],
            iconAnchor: [22, 94],
            shadowAnchor: [4, 62],
            popupAnchor: [-3, -76]
        });


        const locStr = localStorage.getItem('locations') || '[]';
        let locs = JSON.parse(locStr);
        console.log(locs)
        locs.forEach(loc => {
            L.marker([loc.coords[0], loc.coords[1]], { icon: icon }).addTo(map);
        });

        map.addEventListener('dblclick', (event) => {
            coordsInput.value = event.latlng.lat.toString() + '\n' + event.latlng.lng.toString();

            const { latlng } = event;
            map.panTo(latlng);
            marker.setLatLng(latlng);

        })

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            L.marker([marker.getLatLng().lat, marker.getLatLng().lng], { icon: icon }).addTo(map);

            const locationsString = localStorage.getItem('locations') || '[]';
            let locations = JSON.parse(locationsString);

            locations.push({
                name: nameInput.value,
                description: descriptionInput.value,
                coords: [marker.getLatLng().lat, marker.getLatLng().lng]
            })

            localStorage.setItem('locations', JSON.stringify(locations))

            console.log('Saved to local storage:', locations)
        })

    } catch (error) {
        console.log(error);
    }
};
