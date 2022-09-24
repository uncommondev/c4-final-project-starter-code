import { TodosAccess } from './TodosAccess'
//import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'

// TODO: Implement businessLogic

//const TodosAccess = new TodosAccess()
// const attachmentUtils = new AttachmentUtils()
const logger = createLogger('todos')

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    logger.info('Getting all todos')
    return TodosAccess.getTodosForUser(userId)
}

export async function createTodo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
    logger.info('Creating todo')
    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const todoItem = {
        userId,
        todoId,
        createdAt,
        done: false,
        attachmentUrl: null,
        ...createTodoRequest
    }
    return TodosAccess.createTodoItem(todoItem)
}

export async function updateTodo(updateTodoRequest: UpdateTodoRequest, todoId: string, userId: string): Promise<void> {
    logger.info('Updating todo')
    return TodosAccess.updateTodoItem(updateTodoRequest, todoId, userId)
}

export async function deleteTodo(todoId: string, userId: string): Promise<void> {
    logger.info('Deleting todo')
    return TodosAccess.deleteTodoItem(todoId, userId)
}

export async function createAttachmentPresignedUrl(todoId: string, userId: string): Promise<string> {
    logger.info('Creating attachment presigned url')
    return TodosAccess.generateUploadUrl(todoId, userId)
    // const attachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
    // await TodosAccess.updateTodoAttachmentUrl(todoId, userId, attachmentUrl)
    // return attachmentUtils.getAttachmentUrl(todoId)
}

export async function getTodo(todoId: string, userId: string): Promise<TodoItem> {
    logger.info('Getting todo item')
    return TodosAccess.getTodoItem(todoId, userId)
}

export async function updateTodoAttachmentUrl(todoId: string, userId: string, attachmentUrl: string): Promise<void> {
    logger.info('Updating todo attachment url')
    return TodosAccess.updateTodoAttachmentUrl(todoId, userId, attachmentUrl)
}

export async function updateTodoItem(updateTodoRequest: UpdateTodoRequest, todoId: string, userId: string): Promise<void> {
    logger.info('Updating todo item')
    return TodosAccess.updateTodoItem(updateTodoRequest, todoId, userId)
}

export async function deleteTodoItem(todoId: string, userId: string): Promise<void> {
    logger.info('Deleting todo item')
    return TodosAccess.deleteTodoItem(todoId, userId)
}

export async function getTodoItem(todoId: string, userId: string): Promise<TodoItem> {
    logger.info('Getting todo item')
    return TodosAccess.getTodoItem(todoId, userId)
}
