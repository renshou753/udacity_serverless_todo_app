import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  const todoId = event.pathParameters.todoId
  const validTodoId = await todoExists(todoId)
  
  if (!validTodoId) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Todo item does not exist'
      })
    }
  }
  
  const parsedBody = JSON.parse(event.body)
  
  await docClient.update({
    TableName: todosTable,
    Key:{
        todoId: todoId
    },
    UpdateExpression: 'set #ts = :r, dueDate=:p, done=:d',
    ExpressionAttributeValues:{
        ":r":parsedBody.name,
        ":p":parsedBody.dueDate,
        ":d":parsedBody.done
    },
    ExpressionAttributeNames:{
        "#ts": "name"
    },
    ReturnValues:"UPDATED_NEW"
  }).promise()

  // TODO: Remove a TODO item by id
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      
    })
  }
}

async function todoExists(todoId: string) {
  const result = await docClient
    .get({
      TableName: todosTable,
      Key: {
        todoId: todoId
      }
    })
    .promise()

  console.log('Get todo: ', result)
  return !!result.Item
}
