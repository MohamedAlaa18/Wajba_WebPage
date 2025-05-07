import { Injectable } from '@angular/core';

function getWindow(): any {
  return typeof window !== 'undefined' ? window : null;
}

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  constructor() { }

  get nativeWindow(): any {
    return getWindow();
  }
}
