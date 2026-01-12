// serviceWorkerRegistration.ts

const registerServiceWorker = async () => {
  if (!("serviceWorker" in navigator)) return;
  if (!("SyncManager" in window)) return;

  try {
    const registration = await navigator.serviceWorker.register(
      "/sw/service-worker.js", {scope:"/sw/"}
    );

    await navigator.serviceWorker.ready;
  
    await registration.sync.register("persist-to-database");
  } catch (error) {
    console.error("Service Worker registration or sync failed:", error);
  }
};

export { registerServiceWorker };
