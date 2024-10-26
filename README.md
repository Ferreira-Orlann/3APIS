# 3APIS
3APIS 

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