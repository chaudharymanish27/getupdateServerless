'use strict';
const AWS = require('aws-sdk');

module.exports.get = async (event) => {
    const ownername = event.queryStringParameters.OwnerName;
    try {
        const scanParams = {
          TableName: process.env.DYNAMODB_CUSTOMER_TABLE,
          Key: {
              'OwnerName': ownername
            } 
        };  
        const dynamodb = new AWS.DynamoDB.DocumentClient();
        const result = await dynamodb.get(scanParams).promise();  
        if ( ! result.Item)
          {
          const defaultvalue =  {
            "OwnerName":  ownername ,            
              "videoEdit":{
               "videoEditing":"Manual",
                "videofilter":{
                  "imageEffect":"",
                  "soundEffect":"",
                  "label":"",
                  "fontName":"",
                  "colorName":""
                }
              },
               "videoEffect":{
                 "AllEffect":false,
                  "superSlowMotion":true,
                   "ballIn":false
               },
               "videoDestination":{
                 "socialMediaType":"",
                 "socialMediaName":""
               }
             };       
            const putParams = {
              TableName:  process.env.DYNAMODB_CUSTOMER_TABLE,
              Item: defaultvalue
            };
            await dynamodb.put(putParams).promise();
            const result = await dynamodb.get(scanParams).promise();
            return {
              statusCode: 200,
              body: JSON.stringify({      
                data : result.Item,
                OwnerName :ownername
              }),
            };
        }

        return {
          statusCode: 200,
          body: JSON.stringify({      
            OwnerName :ownername,
            data  : result.Item
          }),
        };

    } 
  catch (error) 
  {
    return {
      statusCode: 500,     
      body: JSON.stringify({      
        error:  error.message
        }),     
     } 
  }
};