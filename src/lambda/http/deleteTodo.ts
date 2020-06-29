import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../util'
import { createLogger } from '../../utils/logger'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'

const logger = createLogger('Todo')
const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  logger.info("processing event ", event)
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  const validTodoId = await todoExists(userId, todoId)
  
  
  if (!validTodoId) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Todo item does not exist'
      })
    }
  }
  
  await docClient.delete({
    TableName: todosTable,
    Key:{
        "userId": userId,
        "todoId": todoId
    }
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

async function todoExists(userId: string, todoId: string) {
  const result = await docClient
    .get({
      TableName: todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    })
    .promise()

  console.log('Get todo: ', result)
  return !!result.Item
}
