export class AppError extends Error {
  constructor(message, status) {
    if (message === "") {
      message = "Something Went Wrong!";
    }
    super(message);
    this.status = status;
  }
}
