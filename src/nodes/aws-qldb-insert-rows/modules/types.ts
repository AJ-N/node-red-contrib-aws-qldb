import { Node, NodeDef } from "node-red";
import { AwsQldbInsertRowsCredentials, AwsQldbInsertRowsOptions } from "../shared/types";

export interface AwsQldbInsertRowsNodeDef extends NodeDef, AwsQldbInsertRowsOptions {}

// export interface AwsQldbInsertRowsNode extends Node {}
export type AwsQldbInsertRowsNode = Node<AwsQldbInsertRowsCredentials>;
