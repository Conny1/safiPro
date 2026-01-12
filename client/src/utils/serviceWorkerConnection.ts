// serviceWorkerRegistration.ts

const registerServiceWorker = async () => {
  if (!("serviceWorker" in navigator)) return;
  if (!("SyncManager" in window)) return;

  try {
    const registration = await navigator.serviceWorker.register(
      "/service-worker.js"
    );

    await navigator.serviceWorker.ready;
  
    await registration.sync.register("persist-to-database");
  } catch (error) {
    console.error("Service Worker registration or sync failed:", error);
  }
};

export { registerServiceWorker };
