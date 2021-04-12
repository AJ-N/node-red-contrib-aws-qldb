# Node-contrib-aws-qldb - AWS Quantum DB Ledger (Insert Node)

This was forked from [Node-RED Node TypeScript Starter](https://github.com/alexk111/node-red-node-typescript-starter)

## Getting Started

```bash
# Install dependencies
npm i

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

## TODO

* [ ] Use mocks in tests
* [ ] Uplevel configuration (or reuse regular aws one if possible)
* [ ] Add more nodes
  * [ ] Select
  * [ ] Update
  * [ ] Delete

## License

MIT &copy; AJ Newton (see `./LICENSE`)

### Forked Project License

MIT &copy; Alex Kaul (see `./LICENSE.node-red-typescript-starter`)
