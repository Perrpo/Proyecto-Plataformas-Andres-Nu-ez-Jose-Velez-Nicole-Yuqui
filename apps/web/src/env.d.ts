/// <reference types="vite/client" />
/// <reference types="google.maps" />

export {}

declare global {
  interface Window {
    google: typeof google
  }
}


