# Full Cycle - Docker - Challenge - Nginx-Nodejs-Mysql

*Target: Create a Docker environment that the client shall acess the Nginx at 8080 port, then Nginx shall do a reverse proxy to a Nodejs instance. When the Nodejs instance be accessed it should write a fixed name, then return all names written in a table inside the MySQL database*



## Pre-Requirements

- [Docker](https://github.com/rogeriocassares/Tools/tree/main/Docker) 
- docker-compose



## Quick -Start

Run docker-compose environment:

```
docker-compose up -d
```

Access the browser to see the web interface:

[http://localhost:8080](http://localhost:8080)

