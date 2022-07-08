

## Explanation

At first, it was created two environments in this project: `dev` and `prod`.

Both of them were described in `yaml` file as `docker-compose.dev.yaml` and `docker-compose.prod.yaml`. Then, the `docker-compose.yaml` file was created with a symbolic link to the `docker-compose.prod.yaml`:

```bash
ln -s docker-compose.prod.yalm docker-compose.yaml
```

The project contains a ***Nginx***, a ***Nodejs*** and a ***MySQL*** instance.

### Network

Is is really important that the network includes all the services of related containers. So, inside each `docker-compose-*.yaml` was created the networks of each environment. By default, where there is not `dev` or `prod` tag, it will be assumed that it shall be `prod`.

**docker-compose-dev:**

```bash
version: '3'
services:
...
networks:
  nginx-nodejs-mysql-network-dev:
    driver: bridge
```



**docker-compose-prod:**

```bash
version: '3'
services:
...
networks:
  nginx-nodejs-mysql-network:
    driver: bridge
```



### MySQL

Inside `docker-commpose.dev.yaml`, create a  service called `mysql-dev` with the following characteristics.

```yaml
version: '3'
services:
  mysql-dev:
    restart: always
    build:
      context: ./mysql/build
      dockerfile: Dockerfile.dev
    image: rogeriocassares/mysql_nginx-nodejs-mysql:dev
    container_name: mysql_nginx-nodejs-mysql-dev
    environment:
      - MYSQL_DATABASE=nodedb
      - MYSQL_ROOT_PASSWORD=root
    command: --innodb-use-native-aio=0
    volumes:
      - ./mysql/dev/data:/var/lib/mysql
    tty: true
    networks:
      - nginx-nodejs-mysql-network
 ...

```

The compose file above allows to develop with MySQL database accessing the container `mysql_nginx-nodejs-mysql-dev`. Then, a volume will be shared between the container and the host. To create the production container, that volume shall be copied to the `Dockerfile` for initial or backup purposes or shared with volumes also to  maintain a copy of the database during the life cycle of the database.

To build, then run the container with compose:

```bash
docker-compose build mysql-dev
docker-compose up -d mysql-dev
```

Verify the container is ruinning:

```bash
docker-compose ps
            Name                          Command               State          Ports       
-------------------------------------------------------------------------------------------
mysql_nginx-nodejs-mysql-dev   docker-entrypoint.sh --inn ...   Up      3306/tcp, 33060/tcp
```

Access the container to create the database table:

```bash
docker exec -it mysql_nginx-nodejs-mysql-dev bash
bash-4.2# mysql -u root -p     
Enter password: 
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 5.7.38 MySQL Community Server (GPL)

Copyright (c) 2000, 2022, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| nodedb             |
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.00 sec)

mysql> use nodedb;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> create table people(id int not null auto_increment, name varchar(255), primary key(id));


mysql> desc people;
+-------+--------------+------+-----+---------+----------------+
| Field | Type         | Null | Key | Default | Extra          |
+-------+--------------+------+-----+---------+----------------+
| id    | int(11)      | NO   | PRI | NULL    | auto_increment |
| name  | varchar(255) | YES  |     | NULL    |                |
+-------+--------------+------+-----+---------+----------------+
2 rows in set (0.00 sec)
```



To stop the container:

```bash
docker-compose stop mysql-dev
```

After the database has been created, the `prod` image shall be created by copying the initial data of the `dev` environment to the `src` of the `Dockerfile.prod` build environment.

```bash
sudo cp -r mysql/dev/data mysql/build/src
```

Then, build the production image of the MySQL instance copying the data files inside the correct directory! The `Dockerfile.prod` shall be as bellow:

```dockerfile
FROM mysql:5.7.38
RUN rm -rf /var/lib/mysql
COPY ./src/data /var/lib/mysql
```









