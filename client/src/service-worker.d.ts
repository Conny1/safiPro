/// <reference lib="webworker" />

// Extend the ServiceWorkerRegistration type to include Background Sync
interface ServiceWorkerRegistration {
  /**
   * Background Sync manager
   */
  sync: ServiceWorkerRegistrationSyncManager;
}

/**
 * Background Sync Manager interface
 */
interface ServiceWorkerRegistrationSyncManager {
  /**
   * Registers a sync event with the given tag.
   * The browser will fire the sync when network is available.
   */
  register(tag: string): Promise<void>;
}
