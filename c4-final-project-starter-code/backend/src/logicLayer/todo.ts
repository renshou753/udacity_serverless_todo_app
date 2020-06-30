
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'

import { Data } from '../dataLayer/data'
import { TodoItem } from '../models/todoItem'

import { CreateTodoRequest } from '../requests/createTodoRequest'
import { UpdateTodoRequest } from '../requests/updateTodoRequest'
import { TodoUpdate } from '../models/todoUpdate'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

const data = new Data()

export async function getTodosPerUser(userId: string): Promise<TodoItem[]> {

  return await data.getTodos(userId)
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    userId: string
    ): Promise<TodoItem>{
    const todoId = uuid.v4()

    const newTodo: TodoItem = {
        userId: userId,
        todoId: todoId,
        createdAt: new Date().toISOString(),
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false
    }

    return await data.createTodo(newTodo)
}

export async function deleteTodo(userId: string, todoId: string): Promise<String>  {

    return data.deleteTodo(userId, todoId)
}

export async function generateUploadUrl(userId: string, todoId: string):  Promise < String >{
    return data.generateUploadUrl(userId, todoId)
}

export async function updateTodo(
    userId: string,
    todoId: string,
    updateTodoRequest: UpdateTodoRequest
): Promise<TodoUpdate> {

    const updatedTodo: TodoUpdate = {
        name: updateTodoRequest.name,
        dueDate: updateTodoRequest.dueDate,
        done: updateTodoRequest.done
    }

    return await data.updateTodo(userId, todoId, updatedTodo)
}

export async function todoExists(userId: string, todoId: string) {
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