export default class BaseApiResponse<T, E> {
  ok: boolean;
  message: string = "";
  data?: T;
  error?: E;

  constructor(ok: boolean, message: string, data?: T, error?: E) {
    this.ok = ok;
    this.message = message;
  }

  static ok<T>(message: string = "", data?: T) {
    return new BaseApiResponse(true, message, data);
  }

  static error<E>(message: string = "", error?: E) {
    return new BaseApiResponse(true, message, null, error);
  }
}
