const DB_NAME = "SafiProOrdersDB";
const DB_VERSION = 1;
const STORE_NAME = "orders";
// const BASE_URL = "http://localhost:8000"; // <-- hardcode public API URL server
const BASE_URL ="https://safipro-ffs2.onrender.com"; // <-- hardcode public API URL server


// -----------------------------
// IndexedDB helpers
// -----------------------------
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "_id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getOrders() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

async function deleteOrder(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// -----------------------------
// Background Sync
// -----------------------------
self.addEventListener("sync", (event) => {
  if (event.tag === "persist-to-database") {
    event.waitUntil(syncOrders());
  }
});

async function syncOrders() {
  const orders = await getOrders();

  for (const order of orders) {
    const {
      _id,
      order_no,
      createdAt,
      updatedAt,
      last_syced,
      sync_status,
      ...body
    } = order;
    const response = await fetch(`${BASE_URL}/admin/orders/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Force retry later
      throw new Error("Network sync failed");
    }
    if (response.ok) {
      await deleteOrder(order._id);
    }
  }
}
