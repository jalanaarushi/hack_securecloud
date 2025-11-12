const { DynamoDBClient, PutItemCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { KMSClient, EncryptCommand, DecryptCommand } = require('@aws-sdk/client-kms');

const dynamoDbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const kmsClient = new KMSClient({ region: process.env.AWS_REGION });

module.exports = { dynamoDbClient, kmsClient, PutItemCommand, GetItemCommand, EncryptCommand, DecryptCommand };