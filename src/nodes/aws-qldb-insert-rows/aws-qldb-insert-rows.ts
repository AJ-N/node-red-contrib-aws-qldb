import { NodeInitializer } from "node-red";
import { AwsQldbInsertRowsNode, AwsQldbInsertRowsNodeDef } from "./modules/types";
import { QldbDriver, Result, TransactionExecutor, RetryConfig } from "amazon-qldb-driver-nodejs"
import { ClientConfiguration } from "aws-sdk/clients/qldbsession";
import { config as AWSConfig } from 'aws-sdk';

/** Main function for the node */
const nodeInit: NodeInitializer = (RED): void => {
  function AwsQldbInsertRowsNodeConstructor(
    this: AwsQldbInsertRowsNode,
    config: AwsQldbInsertRowsNodeDef
  ): void {
    RED.nodes.createNode(this, config);

    // Set connection settings
    const {
      awsAccessKeyId: accessKeyId,
      awsSecretAccessKey: secretAccessKey,
      awsRegion: region,
    } =  config;
    AWSConfig.update({
      accessKeyId,
      secretAccessKey,
      region,
    });

    // Create instance
    const qldbDriver = createQldbDriver(config.ledger);

    this.on("input", async (msg, send, done) => {

      // Sanity check payload
      if (!Array.isArray(msg.payload)) {
        throw `Input must be an array`;
      }

      // Format appropriately
      const documents = msg.payload as any[];
      const result : Result = await qldbDriver.executeLambda(async (txn: TransactionExecutor) => {
        return await insertDocument(txn, config.table, documents)
      }) as Result;

      // Convert to list of document IDs
      if (config.returnDocumentIds === true) {
        msg.payload = result.getResultList().map((r: any) => r._fields.documentId);
      } else {
        msg.payload = result;
      }
      send(msg);
      done();
    });
  }

  RED.nodes.registerType("aws-qldb-insert-rows", AwsQldbInsertRowsNodeConstructor);
};

/**
 * Insert the given list of documents into a table in a single transaction.
 * @param txn The {@linkcode TransactionExecutor} for lambda execute.
 * @param tableName Name of the table to insert documents into.
 * @param documents List of documents to insert.
 * @returns Promise which fulfills with a {@linkcode Result} object.
 */
 async function insertDocument(
  txn: TransactionExecutor,
  tableName: string,
  documents: object[]
): Promise<Result> {
  const statement: string = `INSERT INTO ${tableName} ?`;
  let result: Result = await txn.execute(statement, documents);
  return result;
}

/**
 * Create a driver for creating sessions.
 * @param ledgerName The name of the ledger to create the driver on.
 * @param serviceConfigurationOptions The configurations for the AWS SDK client that the driver uses.
 * @returns The driver for creating sessions.
 */
 function createQldbDriver(
  ledgerName: string,
  serviceConfigurationOptions: ClientConfiguration = {}
): QldbDriver {
  const retryLimit = 4;
  const maxConcurrentTransactions = 10;
  //Use driver's default backoff function (and hence, no second parameter provided to RetryConfig)
  const retryConfig: RetryConfig = new RetryConfig(retryLimit);
  const qldbDriver: QldbDriver = new QldbDriver(ledgerName, serviceConfigurationOptions, maxConcurrentTransactions, retryConfig);
  return qldbDriver;
}

export default nodeInit;
