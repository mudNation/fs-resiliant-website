let cacheData='appV1'; 

this.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheData).then((cache) => {
            cache.addAll([
                'https://fs-resiliant-website.vercel.app/static/js/bundle.js',
                'https://fs-resiliant-website.vercel.app//index.html',
                'https://fs-resiliant-website.vercel.app//index.html/',
                'https://fs-resiliant-website.vercel.app//index.html/home',
                'https://fs-resiliant-website.vercel.app//index.html/signup',
                'https://fs-resiliant-website.vercel.app//index.html/add',
                'https://fs-resiliant-website.vercel.app//index.html/news',
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