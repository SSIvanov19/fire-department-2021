var coordinatesX = null;
var coordinatesY = null;
window.onload = () => {

    if (localStorage.isUserEnter == "true") {
        document.getElementById("names").value = JSON.parse(localStorage.getItem("activeUser")).fname + " " + JSON.parse(localStorage.getItem("activeUser")).lname;
    }

    var map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([27.461014, 42.510578]),
            zoom: 12
        })
    });

    map.on('click', (m) => {
        map.getLayers().getArray()
            .filter(layer => layer.get('name') === 'Marker')
            .forEach(layer => map.removeLayer(layer));

        let layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [
                    new ol.Feature({
                        geometry: new ol.geom.Point([m.coordinate[0], m.coordinate[1]])
                    })
                ]
            }),
            name: 'Marker'
        });
        map.addLayer(layer);

        coordinatesX = m.coordinate[0];
        coordinatesY = m.coordinate[1];
    });
}



function getInput() {
    let form = document.forms.signalForm;

    let am = new AccountManager(localStorage)

    let output = am.submitSignalForm(
        form.elements.title.value,
        form.elements.names.value,
        form.elements.type.value,
        coordinatesX,
        coordinatesY,
        form.elements.des.value
    );

    switch (output) {
        case 0:
            document.getElementById("error").innerHTML = "Signal submit!";
            break;
        case 1:
            document.getElementById("error").innerHTML = "Title can not be empty!";
            break;
        case 2:
            document.getElementById("error").innerHTML = "Names can not be empty!";
            break;
        case 3:
            document.getElementById("error").innerHTML = "There must be type selected!";
            break;
        case 4:
            document.getElementById("error").innerHTML = "The must be a description!";
            break;
        default:
            console.log("A wild error appeared");
            break;
    }
}