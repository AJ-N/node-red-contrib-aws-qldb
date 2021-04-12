export interface AwsQldbInsertRowsOptions {
  /** Name of the ledger we are connecting to */
  ledger: string,
  /** Name of the table in the QLDB to upload to */
  table: string,

  /** If true (default) return document IDs instead of full Result from insertion */
  returnDocumentIds: boolean,

  /** Region to connect to */
  region: string,
  /** Access Key ID configured in your AWS account (TODO - Pull from AWS configuration node) */
  awsAccessKeyId: string,
  /** Access Key Secret Key configured in your AWS account (TODO - Pull from AWS configuration node) */
  awsSecretAccessKey: string,
}
