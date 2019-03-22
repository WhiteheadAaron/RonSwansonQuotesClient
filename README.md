## Ron Swanson Quotes -- By Aaron Whitehead

### Technologies

I used React for the Frontend along with Node and Express for the backend. I also used Mongo/Mongoose for the database schemas. 

### Links to GitHub Files

Client: https://github.com/WhiteheadAaron/RonSwansonQuotesClient
Server: https://github.com/WhiteheadAaron/RonSwansonQuotesServer

### Front End Stories

My app completes all of the front end requirements, a user can easily click a button to receive a new quote as well as use the drop down filter to receive only quotes that are of a certain size.

### Back End Stories

I also completed the back end requirements. A user is able to give a quote a rating from 1-5, but they won't be allowed to vote twice. I keep track of which quotes they've voted on in that session, as well as on the database by IP Address. 

It also shows the user the average rating that each quote has received, if it has received a vote at all. My app is also able to dynamically update should the original API ever change. Each time it randomly chooses a quote, it checks to see if I have it stored along with ratings and IP Addresses in the database. If it doesn't, it creates an instance for that new quote. If it does, it retrieves the information that has been stored there.


