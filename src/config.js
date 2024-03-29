export const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appID: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

export const algoliaConfig = {
  appId: import.meta.env.VITE_ALGOLIA_APP_ID,
  searchKey: import.meta.env.VITE_ALGOLIA_SEARCH_KEY,
};

export const base64ContactEmail = "Yi55aWxkaXpAdHVkZWxmdC5ubA==";
