import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-delivery-form',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './delivery-form.component.html',
  styleUrls: ['./delivery-form.component.scss']
})
export class DeliveryFormComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();

  center: google.maps.LatLngLiteral = {
    lat: 25.276987,
    lng: 51.520008
  };
  zoom = 8;
  map: google.maps.Map | undefined;
  searchBox: google.maps.places.SearchBox | undefined;
  marker: google.maps.Marker | undefined;
  locationSelected = false;

  deliveryForm: FormGroup;

  constructor(private fb: FormBuilder, private renderer: Renderer2) {
    this.deliveryForm = this.fb.group({
      location: [null, Validators.required]  // Add validators here
    });
  }

  ngOnInit(): void {
    this.initializeMap();
  }

  toggleScroll(isDisabled: boolean) {
    const mapContainer = document.getElementById('map-container');
    if (isDisabled) {
      if (mapContainer) {
        this.renderer.addClass(mapContainer, 'no-scroll');
      }
    } else {
      if (mapContainer) {
        this.renderer.removeClass(mapContainer, 'no-scroll');
      }
    }
  }

  initializeMap() {
    if (typeof google === 'undefined' || !google.maps.places) {
      console.error('Google Maps API or Places library is not available.');
      return;
    }

    const mapOptions: google.maps.MapOptions = {
      center: this.center,
      zoom: this.zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
    };

    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, mapOptions);

    const geolocationButtonDiv = document.createElement('div');
    const geolocationButtonUI = this.createGeolocationButton();
    geolocationButtonDiv.appendChild(geolocationButtonUI);
    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(geolocationButtonDiv);

    this.map.setOptions({
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER
      }
    });

    const input = document.getElementById('search-input') as HTMLInputElement;
    if (input) {
      this.searchBox = new google.maps.places.SearchBox(input);

      this.searchBox.addListener('places_changed', () => {
        const places = this.searchBox?.getPlaces();
        if (places && places.length > 0) {
          const place = places[0];
          if (place.geometry) {
            this.setMapLocation({
              lat: place.geometry.location!.lat(),
              lng: place.geometry.location!.lng()
            }, place.name || 'Searched Location');
            this.locationSelected = true;
            this.deliveryForm.get('location')?.setValue(place.formatted_address || 'Searched Location');
          }
        }
        this.toggleScroll(false);
      });
    }

    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng != null) {
        this.setMapLocation(event.latLng.toJSON(), 'Clicked Location');
        this.locationSelected = true;
        this.deliveryForm.get('location')?.setValue(`Lat: ${event.latLng.lat()}, Lng: ${event.latLng.lng()}`);
      }
    });
  }

  createGeolocationButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.classList.add('geolocation-button');
    button.title = 'Detect your current location';

    const svg = `
      <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect y="0.670349" width="32" height="32" rx="4" fill="white"/>
        <g clip-path="url(#clip0_2797_6112)">
          <path d="M20.2427 20.2463L16 24.489L11.7573 20.2463C10.9182 19.4072 10.3468 18.3381 10.1153 17.1742C9.88378 16.0104 10.0026 14.804 10.4567 13.7076C10.9109 12.6113 11.6799 11.6742 12.6666 11.0149C13.6533 10.3556 14.8133 10.0037 16 10.0037C17.1867 10.0037 18.3467 10.3556 19.3334 11.0149C20.3201 11.6742 21.0891 12.6113 21.5433 13.7076C21.9974 14.804 22.1162 16.0104 21.8847 17.1742C21.6532 18.3381 21.0818 19.4072 20.2427 20.2463ZM15.3333 15.337H13.3333V16.6703H15.3333V18.6703H16.6667V16.6703H18.6667V15.337H16.6667V13.337H15.3333V15.337Z" fill="#555457"/>
        </g>
        <defs>
          <clipPath id="clip0_2797_6112">
            <rect width="16" height="16" fill="white" transform="translate(8 8.67035)"/>
          </clipPath>
        </defs>
      </svg>
    `;

    button.style.cssText = `
      margin-top: 16rem;
      margin-right: 0.5rem;
      background-color: rgba(255, 255, 255, 1);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 45px;
      height: 45px;
      opacity: 1;
      border-radius: 50%;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    `;

    button.innerHTML = svg;

    button.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const pos: google.maps.LatLngLiteral = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.setMapLocation(pos, 'You are here');
          this.locationSelected = true;
          this.deliveryForm.get('location')?.setValue('You are here');
        }, () => {
          console.error('Geolocation failed.');
        });
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    });

    return button;
  }

  setMapLocation(location: google.maps.LatLngLiteral, title: string) {
    this.center = location;
    this.map?.setCenter(this.center);
    this.zoom = 15;

    if (this.marker) {
      this.marker.setMap(null);
    }

    this.marker = new google.maps.Marker({
      position: this.center,
      map: this.map,
      title: title
    });

    this.getAddressFromCoordinates(location);
  }

  getAddressFromCoordinates(location: google.maps.LatLngLiteral) {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        let humanReadableAddress = results[0].formatted_address;

        const filteredComponents = results[0].address_components.filter(component => {
          return !component.types.includes('plus_code') && !component.types.includes('postal_code');
        });

        if (filteredComponents.length > 0) {
          humanReadableAddress = filteredComponents.map(component => component.long_name).join(', ');
        }

        console.log(results[0]);

        const locationDisplay = document.getElementById('selected-location') as HTMLInputElement;
        if (locationDisplay) {
          locationDisplay.value = humanReadableAddress; // Update input field value
        }

        // Update form control value
        this.deliveryForm.get('location')?.setValue(humanReadableAddress);
      } else {
        console.error('Geocoder failed due to: ' + status);

        const locationDisplay = document.getElementById('selected-location') as HTMLInputElement;
        if (locationDisplay) {
          locationDisplay.value = `Lat: ${location.lat}, Lng: ${location.lng}`; // Update input field value
        }

        // Update form control value
        this.deliveryForm.get('location')?.setValue(`Lat: ${location.lat}, Lng: ${location.lng}`);
      }
    });
  }

  onSubmit() {
    if (this.deliveryForm.invalid) {
      this.deliveryForm.markAllAsTouched();
    } else {
      // Extract form values
      const formData = this.deliveryForm.value;

      // Extract latitude and longitude from the map center
      const latLng = {
        lat: this.center.lat,
        lng: this.center.lng
      };

      // Combine form data with latitude and longitude
      const bookingData = {
        ...formData,
        latLng,
        type: 'delivery',
      };

      console.log('Booking data submitted:', bookingData);

      // Save the combined data to local storage
      localStorage.setItem('bookingData', JSON.stringify(bookingData));

      this.closeModal.emit();
    }
  }

}
