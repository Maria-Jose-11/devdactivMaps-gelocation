import { Component, ElementRef, ViewChild } from '@angular/core';
import { CapacitorGoogleMaps } from '@capacitor-community/capacitor-googlemaps-native';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(mapView: ElementRef) { 
    this.mapView=mapView;
  }

  @ViewChild('map') mapView: ElementRef;

  ionViewDidEnter() {
    this.createMap();
  }

  createMap() {
    const boundingRect = this.mapView.nativeElement.getBoundingClientRect() as DOMRect;

    CapacitorGoogleMaps.create({
      width: Math.round(boundingRect.width),
      height: Math.round(boundingRect.height),
      x: Math.round(boundingRect.x),
      y: Math.round(boundingRect.y),
      zoom: 5
    });

    CapacitorGoogleMaps.addListener('onMapReady', async () => {
      CapacitorGoogleMaps.setMapType({
        type: "normal" // hybrid, satellite, terrain
      });

      this.showCurrentPosition();
    });
  }

  async showCurrentPosition() {
    Geolocation.requestPermissions().then(async premission => {
      const coordinates = await Geolocation.getCurrentPosition();

      // Create our current location marker
      CapacitorGoogleMaps.addMarker({
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
        title: 'My castle of loneliness',
        snippet: 'Come and find me!'
      });

      // Focus the camera
      CapacitorGoogleMaps.setCamera({
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
        zoom: 12,
        bearing: 0
      });
    });
  }

  ionViewDidLeave() {
    CapacitorGoogleMaps.close();
  }

}