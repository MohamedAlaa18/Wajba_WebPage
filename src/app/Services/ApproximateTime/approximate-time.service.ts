import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApproximateTimeService {

  constructor() { }

  getApproximateTime(distanceKm: number): string {
    const averageSpeedKmh = 50;
    const timeInHours = distanceKm / averageSpeedKmh;
    const timeInMinutes = Math.round(timeInHours * 60);

    // Convert timeInMinutes to the current time
    const now = new Date();
    now.setMinutes(now.getMinutes() + timeInMinutes);

    // Calculate the difference between the future time and now in milliseconds
    const diffInMs = now.getTime() - new Date().getTime();

    // Convert the time difference to different units
    const minutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    // Return the formatted time based on the duration
    if (months >= 1) {
      return months === 1 ? 'in 1 month' : `in ${months} months`;
    } else if (weeks >= 1) {
      return weeks === 1 ? 'in 1 week' : `in ${weeks} weeks`;
    } else if (days >= 1) {
      return days === 1 ? 'in 1 day' : `in ${days} days`;
    } else if (hours >= 1) {
      return hours === 1 ? 'in 1 hour' : `in ${hours} hours`;
    } else if (minutes >= 1) {
      return minutes === 1 ? 'in 1 minute' : `in ${minutes} minutes`;
    } else {
      return 'Arriving now';
    }
  }

  getApproximateTimeWithISOString(distanceKm: number): string {
    const averageSpeedKmh = 50;
    const timeInHours = distanceKm / averageSpeedKmh;
    const timeInMinutes = Math.round(timeInHours * 60);

    const now = new Date();
    now.setMinutes(now.getMinutes() + timeInMinutes);

    return now.toISOString();
  }

  getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

}
