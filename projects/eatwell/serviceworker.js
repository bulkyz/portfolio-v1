const staticEatWell = "EatWell";
const assets = [
  "/",
  "/index.html",
  "/style.css",
  "/js.js",
  "/files/img/logoEatWell.svg",
  "/user1_data.csv",
  "/user1_data2.csv",
  "/user2_data.csv",
  "/user2_data2.csv",
  "/user3_data.csv",
  "/user3_data2.csv",
  "/user4_data.csv",
  "/user4_data2.csv",
  "/user5_data.csv",
  "/user5_data2.csv",
];

self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(staticEatWell).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});
