let cacheData='appV1'; 

this.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheData).then((cache) => {
            cache.addAll([
                `${process.env.PUBLIC_URL}/static/js/bundle.js`,
                `${process.env.PUBLIC_URL}/index.html`,
                `${process.env.PUBLIC_URL}/index.html/`,
                `${process.env.PUBLIC_URL}/index.html/home`,
                `${process.env.PUBLIC_URL}/index.html/signup`,
                `${process.env.PUBLIC_URL}/index.html/add`,
                `${process.env.PUBLIC_URL}/index.html/news`,
            ])
        })
    )
})


this.addEventListener("fetch", (event)=>{
    if(!navigator.onLine){
        event.respondWith(
            caches.match(event.request).then((resp) => {
                if(resp){
                    return resp; 
                }
            })
        )
    }
})