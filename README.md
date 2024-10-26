# 3APIS
RailRoad ltd is a company which aim to produce the best experience for your local and national commute.

Your task is to produce a full API using Node.js and Express.js (Fastify.js is also possible) to allow users to access information about train station or other relevant data. This should also allow people to "book" a ticket from one stop to another and provide an interface for specific user (let's call them employee) to verify the validity of the ticket

The API needs to be REST compliant (method, endpoint …).

[Specifications](3apis_specifications.pdf)

## Installation

#### Windows
```
    npm install
    copy .\node_modules\@tensorflow\tfjs-node\deps\lib\tensorflow.dll .\node_modules\@tensorflow\tfjs-node\lib\napi-v8\tensorflow.dll
```

## Running

```
    npm run start
```

## .env Example

```
EXPRESS_PORT=3000
JWT_KEY="MPXIXZMJ1utIjW3DmBLlPIPk1BivEtiEu23y5XAwx4dF8uBVdWJmpMBgrZb0WtDt"
DB_URL=""
HASH_SALT="$2b$10$ikTx0RfnbUi/YiZB/MuVvO"
DOC=true
UPLOAD_FILE_MAX_SIZE=50000000
PAGING_PAGE_SIZE_MAX=50
PAGING_DEFAULT_PAGE_SIZE=5
```

You only need to specify a valid MongoDB URI




Github Repository: https://github.com/Ferreira-Orlann/3APIS