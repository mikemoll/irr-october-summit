
// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var placeSearch, autocomplete;

var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    neighborhood: 'long_name',
    sublocality: 'long_name', // neighborhood
    administrative_area_level_1: 'short_name',
    administrative_area_level_2: 'short_name', // city
    country: 'long_name',
    postal_code: 'short_name'

};
var componentFormNames = {
    street_number: 'streetNumber',
    route: 'streetName',
    locality: 'city',
    neighborhood: 'neighbourhood',
    sublocality: 'neighbourhood',
    administrative_area_level_1: 'province',
    administrative_area_level_2: 'city',
    country: 'country',
    postal_code: 'postalCode'
};

function initAutocomplete() {
    // Create the autocomplete object, restricting the search predictions to
    // geographical location types.
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('autocomplete'), { types: ['geocode'] });

    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    autocomplete.setFields(['address_component', 'url']);

    // When the user selects an address from the drop-down, populate the
    // address fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();

    for (var component in componentFormNames) {
        document.getElementById(componentFormNames[component]).value = '';
        document.getElementById(componentFormNames[component]).disabled = false;
    }

    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
        place.address_components[i].types.forEach(addressType => {
            if (componentFormNames[addressType]) {
                var val = place.address_components[i][componentForm[addressType]];
                document.getElementById(componentFormNames[addressType]).value = val;
            }
        });
    }
    toggleAddressThings();
    document.getElementById('googleStreetView').value = place.url;
    document.getElementById('addressbox').style.display = "block";
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
        });
    }
}
