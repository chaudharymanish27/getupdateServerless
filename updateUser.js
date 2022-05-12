'use strict';
const AWS = require('aws-sdk');

module.exports.update = async (event) => {

  try {
      const requestBody = JSON.parse(event.body)
      const scanParams = {
          TableName: process.env.DYNAMODB_CUSTOMER_TABLE,
          Key : {
          'OwnerName': requestBody.OwnerName
          },
          UpdateExpression: 'set ' + requestBody.updateKey  +' = :value',
          ExpressionAttributeValues:{
          ":value": requestBody.updateValue
          },
          ReturnValues:"UPDATED_NEW"
      };
      const dynamodb = new AWS.DynamoDB.DocumentClient();
      await dynamodb.update(scanParams).promise();
      const getParams = {
          TableName: process.env.DYNAMODB_CUSTOMER_TABLE,
          Key: {
            'OwnerName': requestBody.OwnerName
            } 
          };  
      const result = await dynamodb.get(getParams).promise()
      return {
        statusCode: 200,
        body: JSON.stringify({      
          data  : result.Item
        }), 
      };
    
  } catch (error) {
    return {
      statusCode: 500,     
      body: JSON.stringify({      
        error:  error.message
        }),     
     } 
}
    
};