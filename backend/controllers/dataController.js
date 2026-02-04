const { dynamoDbClient, kmsClient, PutItemCommand, GetItemCommand, EncryptCommand, DecryptCommand } = require('../config/awsConfig');
const { v4: uuidv4 } = require('uuid');

// Store encrypted data in DynamoDB
exports.addData = async (req, res) => {
  const { data } = req.body;
  
  if (!data) {
    return res.status(400).send('Data field is required');
  }
  
  try {
    const dataId = uuidv4();
    
    // Encrypt data using KMS
    const encryptParams = {
      KeyId: process.env.KMS_KEY_ID,
      Plaintext: Buffer.from(JSON.stringify(data)),
    };
    const encryptedData = await kmsClient.send(new EncryptCommand(encryptParams));

    // Store encrypted data in DynamoDB
    const paramsDynamoDB = {
      TableName: 'SecureData',
      Item: {
        id: { S: dataId },
        encryptedData: { B: encryptedData.CiphertextBlob },
      },
    };

    await dynamoDbClient.send(new PutItemCommand(paramsDynamoDB));

    res.status(200).json({ 
      message: 'Data added successfully',
      id: dataId 
    });
  } catch (err) {
    console.error('Error storing data:', err);
    res.status(500).send('Error storing data: ' + err.message);
  }
};

// Retrieve encrypted data from DynamoDB
exports.getData = async (req, res) => {
  const { id } = req.params;

  try {
    const params = {
      TableName: 'SecureData',
      Key: { id: { S: id } },
    };

    const result = await dynamoDbClient.send(new GetItemCommand(params));
    
    if (!result.Item) {
      return res.status(404).send('Data not found');
    }

    // Decrypt the data using KMS
    const decryptParams = {
      CiphertextBlob: result.Item.encryptedData.B,
    };
    const decryptedData = await kmsClient.send(new DecryptCommand(decryptParams));

    res.status(200).json({ data: JSON.parse(decryptedData.Plaintext.toString()) });
  } catch (err) {
    res.status(500).send('Error retrieving data: ' + err.message);
  }
};