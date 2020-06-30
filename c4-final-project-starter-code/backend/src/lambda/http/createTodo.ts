import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../util'
import { createLogger } from '../../utils/logger'
import { createTodo } from '../../logicLayer/todo'
import { CreateTodoRequest } from '../../requests/createTodoRequest'
import 'source-map-support/register'


const logger = createLogger('Todo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  console.log('Processing event: ', event)
  logger.info("processing event ", event)
  const userId = getUserId(event)
  const newTodo: CreateTodoRequest = JSON.parse(event.body);
  
  if (newTodo.name == ""){
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'name cannot be empty'
      })
    }
  }
  
  const item = await createTodo(newTodo, userId)
  
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item
    })
  }
}
