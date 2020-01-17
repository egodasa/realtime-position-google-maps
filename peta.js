/*
 * Kode ini dibuat oleh Ego Dafma Dasa
 * https://github.com/egodasa
 */
var map, id, infoWindow, markerLokasi;
/*
 * kegunaan variabel global diatas:
 * map : untuk menampung instance dari google maps
 * id : menampung instance geolocation realtime (mirip seperti cara menampung setInterval pada variabel), agar nanti proses realtime bisa dihentikan
 * infoWindow : sama dengan variabel map
 * markerLokasi : variabel yang akan menampung marker posisi user sekarang. Setiap posisi user berubah, maka marker ini akan diubah posisinya.
 */
function initMap() {
  map = new google.maps.Map(document.getElementById("peta"), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 13
  });
  infoWindow = new google.maps.InfoWindow;
  markerLokasi = buatMarker(-34.397, 150.644, map);
  perhatikanPosisiUser();
}

// memantau posisi user secara realtime
function perhatikanPosisiUser() {
  if(navigator.geolocation) {
    id = navigator.geolocation.watchPosition(setPosisiUser, 
      function(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 3000,
        maximumAge: 0
      });
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

// stop memantau posisi user
function stopPerhatikanPosisiUser () {
  navigator.geolocation.clearWatch(id);
}

// ubah posisi marker ke posisi tertentu sesuai geolokasi
function setPosisiUser(position)
{
  gantiStatusLokasi("Mencari lokasi Anda...");
  var pos = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
  ambilPosisiUser(pos.lat, pos.lng);
  gantiPosisiMarker(markerLokasi, pos.lat, pos.lng);
  gantiStatusLokasi("Lokasi Anda ditemukan.");
}


// kode untuk menangani kejadian error saat geolokasi error
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  if(browserHasGeolocation) {
    gantiStatusLokasi("Error: Gagal mencari lokasi Anda. Pastikan GPS Anda hidup atau <a href='' onclick='window.location.reload();'>Refresh Halaman</a>");
  } else {
    gantiStatusLokasi("Error: Browser Anda tidak mendukung pencarian lokasi. Silahkan ganti atau perbarui browser Anda.");
  }
  infoWindow.open(map);
}

// buat marker baru dan menambahkannya ke peta
function buatMarker(lat, lng, peta)
{
  return new google.maps.Marker({
    position: {lat: lat, lng: lng},
    map: peta,
    animation: google.maps.Animation.DROP,
    title: 'Lokasi Anda saat ini'
  });
}

// ganti posisi marker 
function gantiPosisiMarker(marker, lat, lng) {
    var pos = {
      lat: lat,
      lng: lng
    };
    infoWindow.setPosition(pos);
    map.setCenter(pos);
    
    var latlng = new google.maps.LatLng(lat, lng);
    marker.setPosition(latlng);
}

// ganti pesan status lokasi
function gantiStatusLokasi(status) {
  document.getElementById("status_lokasi").innerHTML = status;
}

// ambil posisi user dan memasukkannya kedalam form
function ambilPosisiUser(lat, lng) {
  document.getElementsByName("latitude")[0].value = lat;
  document.getElementsByName("longitude")[0].value = lng;
}

