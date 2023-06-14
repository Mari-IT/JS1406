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
            gestureHandling: true,
            doubleClickZoom: false,
            scrollWheelZoom: true
        });
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        const coordsInput = document.querySelector('#coordinates')
        const nameInput = document.querySelector('#location-name')
        const descriptionInput = document.querySelector('#location-description')
        const form = document.querySelector('form')
        const removeBtn = document.querySelector('#remove-btn')
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

        let locStr = localStorage.getItem('locations') || '[]';
        let locs = JSON.parse(locStr);
        console.log(locs)
        locs.forEach(loc => {
            let m = L.marker([loc.coords[0], loc.coords[1]], { icon: icon }).addTo(map)
                .bindPopup(`${loc.coords[0]} ${loc.coords[1]}\n${loc.name}\n${loc.description}`);

            m.addEventListener('click', () => {
                nameInput.value = loc.name;
                descriptionInput.value = loc.description;
                coordsInput.value = loc.coords[0].toString() + '\n' + loc.coords[1].toString();
                removeBtn.classList.remove('hidden');
                
                removeBtn.onclick = () => {
                    const locsStr = localStorage.getItem('locations') || '[]';
                    let locsArr = JSON.parse(locsStr);

                    const crds = coordsInput.value.split('\n');

                    localStorage.setItem('locations', JSON.stringify(locsArr.filter(x => !(x.coords[0].toString() === crds[0] && x.coords[1].toString() === crds[1]))))

                    m.remove()
                }

                m.openPopup();
            })
        });

        map.addEventListener('dblclick', (event) => {
            coordsInput.value = event.latlng.lat.toString() + '\n' + event.latlng.lng.toString();
            nameInput.value = '';
            descriptionInput.value = '';

            const { latlng } = event;
            map.panTo(latlng);
            marker.setLatLng(latlng);
            removeBtn.classList.add('hidden')
        })

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const locationsString = localStorage.getItem('locations') || '[]';
            let locations = JSON.parse(locationsString);

            const newLocation = {
                name: nameInput.value,
                description: descriptionInput.value,
                coords: [marker.getLatLng().lat, marker.getLatLng().lng]
            }

            const crds = coordsInput.value.split('\n');
            let edited = false;
            locations.forEach((l, i, a) => {
                console.log(l.coords[0].toString() == crds[0] && l.coords[1].toString() == crds[1])
                if (l.coords[0].toString() == crds[0] && l.coords[1].toString() == crds[1]) {
                    a[i].name = nameInput.value;
                    a[i].description = descriptionInput.value;
                    localStorage.setItem('locations', JSON.stringify(locations));

                    edited = true;
                }
            })
            if (edited) return;

            
            locations.push(newLocation)
            localStorage.setItem('locations', JSON.stringify(locations))

            let m = L.marker([marker.getLatLng().lat, marker.getLatLng().lng], { icon: icon }).addTo(map)
                .bindPopup(`${newLocation.coords[0]} ${newLocation.coords[1]}\n${newLocation.name}\n${newLocation.description}`);

            m.addEventListener('click', () => {
                nameInput.value = newLocation.name;
                descriptionInput.value = newLocation.description;
                coordsInput.value = newLocation.coords[0].toString() + '\n' + newLocation.coords[1].toString();
                removeBtn.classList.remove('hidden');

                removeBtn.onclick = () => {
                    const locsStr = localStorage.getItem('locations') || '[]';
                    let locsArr = JSON.parse(locsStr);

                    const crds = coordsInput.value.split('\n');

                    localStorage.setItem('locations', JSON.stringify(locsArr.filter(x => !(x.coords[0].toString() === crds[0] && x.coords[1].toString() === crds[1]))))

                    m.remove()
                }
                m.openPopup();
            })

            console.log('Saved to local storage:', locations);
            nameInput.value = '';
            descriptionInput.value = '';
        })



    } catch (error) {
        console.log(error);
    }
};
