import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
//import { TodoUpdate } from '../models/TodoUpdate';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

const docClient: DocumentClient = new DocumentClient()
const todosTable = process.env.TODOS_TABLE
const indexName = process.env.INDEX_NAME

// TODO: Implement the dataLayer logic

export class TodosAccess {


    static async getTodoItem(userId: string, todoId: string): Promise<TodoItem> {
        logger.info('getTodoItem', { userId, todoId })

        const result = await docClient.get({
            TableName: todosTable,
            Key: {
                userId,
                todoId
            }
        }).promise()

        const item = result.Item
        return item as TodoItem
    }

    static async getAllTodos(): Promise<TodoItem[]> {
        logger.info('getAllTodos')

        const result = await docClient.scan({
            TableName: todosTable
        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }

    static async getTodosForUser(userId: string): Promise<TodoItem[]> {
        logger.info('getTodosForUser', { userId })
        const result = await docClient.query({
            TableName: todosTable,
            IndexName: indexName,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }

    static async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
        logger.info('createTodoItem', { todoItem })
        await docClient.put({
            TableName: todosTable,
            Item: todoItem
        }).promise()

        return todoItem
    }

    static async deleteTodoItem(userId: string, todoId: string): Promise<void> {
        logger.info('deleteTodoItem', { userId, todoId })
        await docClient.delete({
            TableName: todosTable,
            Key: {
                userId,
                todoId
            }
        }).promise()
    }

    static async updateTodoItem(todoUpdate: UpdateTodoRequest, todoId: string, userId: string): Promise<void> {
        logger.info('updateTodoItem', { userId, todoId, todoUpdate })
        await docClient.update({
            TableName: todosTable,
            Key: {
                userId,
                todoId
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues: {
                ':name': todoUpdate.name,
                ':dueDate': todoUpdate.dueDate,
                ':done': todoUpdate.done
            },
            ExpressionAttributeNames: {
                '#name': 'name'
            }
        }).promise()
    }

    static async updateTodoAttachmentUrl(userId: string, todoId: string, attachmentUrl: string): Promise<void> {
        logger.info('updateTodoAttachmentUrl', { userId, todoId, attachmentUrl })
        await docClient.update({
            TableName: todosTable,
            Key: {
                userId,
                todoId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': attachmentUrl
            }
        }).promise()
    }

    static async generateUploadUrl(userId: string, todoId: string): Promise<string> {
        logger.info('generateUploadUrl', { userId, todoId })
        const s3 = new XAWS.S3({ signatureVersion: 'v4' })
        const urlExpiration = process.env.SIGNED_URL_EXPIRATION
        const bucketName = process.env.ATTACHMENT_S3_BUCKET

        const uploadUrl = s3.getSignedUrl('putObject', {
            Bucket: bucketName,
            Key: todoId,
            Expires: parseInt(urlExpiration)
        })

        await this.updateTodoAttachmentUrl(userId, todoId, `https://${bucketName}.s3.amazonaws.com/${todoId}`)  

        return uploadUrl
    }

    static async getUploadUrl(userId: string, todoId: string): Promise<string> {
        logger.info('getUploadUrl', { userId, todoId })
        const s3 = new XAWS.S3({ signatureVersion: 'v4' })
        const urlExpiration = process.env.SIGNED_URL_EXPIRATION
        const bucketName = process.env.ATTACHMENT_S3_BUCKET

        const uploadUrl = s3.getSignedUrl('putObject', {
            Bucket: bucketName,
            Key: todoId,
            Expires: parseInt(urlExpiration)
        })

        return uploadUrl
    }
}
