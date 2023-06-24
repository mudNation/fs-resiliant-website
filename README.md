# fs-resiliant-website

The web application makes use of firebase for the back end. this stores all the user details, news json and relevant ratings from users. 

The app allows users to fetch the web pages in offline mode. 

The web app lets you create an account and sign in. If you are offline and try to do either of the two, you are notified that you are offline. 

when a user has loged in, they can then access the website even though they are offline. They can search the news articles, both offline and online. 

The home page shows the news articles, but only ten at a time and is navigated via the pagination at the bottom. 

Users can view each article and can also add their rating by voting up or down for the article. When a user rates an article the app remembers this shows them
which vote they made previously, but only when online. 

An extra feature that was added was allowing the users create articles, this was also made it easier to upload the 100 required articles. 

When a user tries to upload a news, or rate a news when offline, they are notified of their status, but the changes are saved and synced once the user 
comes back online

Whenever the user goes offline or online when using the app, they are also notified of their status. 
