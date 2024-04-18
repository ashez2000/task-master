export class AppError extends Error {
  constructor(message = 'Internal Server Error', statusCode = 500) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
  }
}
