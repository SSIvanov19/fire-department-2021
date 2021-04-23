let am = new AccountManager(localStorage);
const speed = 200;

let numberOfSingals;
let numberOfTeams;
let numberOfFires;
let numberOfFloods;
let numberOfRescues;
let numberOfFreeCars;
let numberOfCars;
let coordinatesX;
let coordinatesY;

window.onload = () => {
    getNumbers();

    updateCounter("numberOfSignals", numberOfSingals);
    updateCounter("numberOfTeams", numberOfTeams);
    updateCounter("numberOfFires", numberOfFires);
    updateCounter("numberOfFloods", numberOfFloods);
    updateCounter("numberOfRescues", numberOfRescues);
    updateCounter("numberOfFreeCars", numberOfFreeCars);
    updateCounter("numberOfCars", numberOfCars);

    if(coordinatesX && coordinatesY) {
        initMap(coordinatesX, coordinatesY, "map");
    } else {
        document.getElementById("map").style.display = "none";
    }
};

function getNumbers() {
    numberOfSingals = am.getNumberOfSignals() ?? 0;
    numberOfTeams = am.getNumberOfTeam() ?? 0;
    numberOfFires = am.getNumberOfFires() ?? 0;
    numberOfFloods = am.getNumberOfFloods() ?? 0;
    numberOfRescues = am.getNumberOfRescues() ?? 0;
    numberOfFreeCars = am.getNumberOfFreeCars() ?? 0;
    numberOfCars = am.getNumberOfCars() ?? 0;

    if (numberOfSingals != 0) {
        let signals = am.getAcceptedSignals();

        for (const signal of signals) {
            coordinatesX = [];
            coordinatesY = [];

            coordinatesX.push(signal.coordinatesX);
            coordinatesY.push(signal.coordinatesY);
        }
    }
}

function updateCounter(counterId, target) {
    let element = document.getElementById(counterId);
    target = Number(target);
    let count = +element.innerText;
    let inc = target / speed;

    if (count < target) {
        element.innerText = Math.ceil(count + inc);
        setTimeout(updateCounter, 100, counterId, target);
    } else {
        element.innerText = target;
    }
}

function initMap(coordinatesXs, coordinatesYs, id) {
    document.getElementById(id).innerHTML = "";

    let map = new ol.Map({
        target: id,
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

    let container = document.getElementById('popup');
    let content = document.getElementById('popup-content');
    let closer = document.getElementById('popup-closer');
   
   
    for (const coordinatesX of coordinatesXs) {
        for (const coordinatesY of coordinatesYs) {
            let layer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [
                        new ol.Feature({
                            geometry: new ol.geom.Point([coordinatesX, coordinatesY])
                        })
                    ]
                }),
                name: 'Marker'
            });
            
            map.addLayer(layer)
        }
    }
  
    let overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    });

    map.addOverlay(overlay);
   
    closer.onclick = function() {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };

    map.on('singleclick', function (event) {
        if (map.hasFeatureAtPixel(event.pixel) === true) {
            var coordinate = event.coordinate;
   
            content.innerHTML = '<b>Активен сигнал</b>';
            overlay.setPosition(coordinate);
        } else {
            overlay.setPosition(undefined);
            closer.blur();
        }
    });

    setTimeout(function () { map.updateSize(); }, 200);
}