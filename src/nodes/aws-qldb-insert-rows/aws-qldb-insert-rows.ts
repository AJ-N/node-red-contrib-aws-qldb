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
    const node = this;

    // Set connection settings
    const {
      awsAccessKeyId: accessKeyId,
      awsSecretAccessKey: secretAccessKey,
      region,
    } =  config;
    AWSConfig.update({
      accessKeyId,
      secretAccessKey,
      region,
    });

    // Create instance
    const qldbDriver = createQldbDriver(config.ledger);

    // The messages should be coming in with payload being array of rows
    node.on("input", async (msg, send, done) => {


      try {

        // NOTE: Due to some weird issue with how node-red sends things in, we need to serialize / un-serialize
        //       Otherwise, ion-js will complain about serialization
        const payload = JSON.parse(JSON.stringify(msg.payload));

        // Format appropriately and send it
        const result : Result = await qldbDriver.executeLambda(async (txn: TransactionExecutor) => {
          return await insertDocument(txn, config.table, payload)
        }) as Result;

        // Convert to list of document IDs (TODO - Expose this property in UI)
        if (config.returnDocumentIds === true) {
          msg.payload = result.getResultList().map((r: any) => r._fields.documentId);
        } else {
          msg.payload = result;
        }

        // We are done! Forward along
        send(msg);

      } catch (e) {
        // Pass errors to some catch-all
        node.error(e);
        // NOTE: Uncomment this to view full error message in node-red stderr
        // throw e;
      }
      done();
    });
  }

  RED.nodes.registerType("aws-qldb-insert-rows", AwsQldbInsertRowsNodeConstructor);
};

/**
 * Insert the given list of documents into a table in a single transaction.
 *    NOTE: Taken from <https://docs.aws.amazon.com/qldb/latest/developerguide/getting-started.nodejs.step-3.html>
 * @param txn The {@linkcode TransactionExecutor} for lambda execute.
 * @param tableName Name of the table to insert documents into.
 * @param documents List of documents to insert.
 * @returns Promise which fulfills with a {@linkcode Result} object.
 */
 async function insertDocument(
  txn: TransactionExecutor,
  tableName: string,
  documents: any
): Promise<Result> {
  const statement: string = `INSERT INTO ${tableName} ?`;
  let result: Result = await txn.execute(statement, documents);
  return result;
}

/**
 * Create a driver for creating sessions.
 *    Note: Taken from <https://docs.aws.amazon.com/qldb/latest/developerguide/getting-started.nodejs.step-2.html>
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

export = nodeInit;
