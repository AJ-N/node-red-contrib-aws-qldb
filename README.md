# AWS Quantum DB Ledger Nodes for Node-Red

This was forked from [Node-RED Node TypeScript Starter](https://github.com/alexk111/node-red-node-typescript-starter)

AWS QLDB nodes for `node-red`. Currently only `insert-rows` is implemented as a proof-of-concept.

## Using (with node-red)

```bash
npm i node-red-contrib-aws-qldb
```

## Getting Started

Everything has been tested with node version: `v12.18.3`

```bash
# Install dependencies
npm i
# Might need typescript, maybe
npm i -g tsc typescript

# Run and test
# NOTE: The test involves live data (for now)
#    YOu need to export the following properties
export AWS_ACCESS_KEY_ID="...."
export AWS_SECRET_ACCESS_KEY=="...."
export AWS_REGION="us-east-1"
export AWS_LEDGER="your-ledger-name"
export AWS_TABLE="your-table-name"
npm run dev
```

## Building Node Set

Create a production build:

```bash
npm run build
```

Reference it in your node-red:

```bash
# From node-red local directory:
npm i /path/to/this/repo
```

### Local packaging

```bash
# Bundle it up
npm run build && npm pack
# -> produces artifact like: node-red-contrib-aws-qldb-0.1.0.tgz

# Copy to node red directory
cp node-red-contrib-aws-qldb-0.1.0.tgz /path/to/node-red/local
cd /path/to/node-red/local
# Install bundle
npm i node-red-contrib-aws-qldb-0.1.0.tgz
```

## TODO

* [ ] Use mocks in tests
* [ ] Uplevel configuration (or reuse regular aws one if possible)
* [ ] Add more nodes
  * [ ] Select
  * [ ] Update
  * [ ] Delete

## Submitting Changes

Create a pull request.

## License

MIT &copy; AJ Newton (see `./LICENSE`)

### Forked Project License

MIT &copy; Alex Kaul (see `./LICENSE.node-red-typescript-starter`)
