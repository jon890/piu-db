const ErrorCode = {
  NOT_EXIST_ROOM: { code: "NOT_EXIST_ROOM", message: "방이 존재하지 않습니다" },
  PARTICIPATE_ROOM_RESTRICTED: {
    code: "PARTICIPATE_ROOM_RESTRICTED",
    message: "해당 방의 참여가 제한되어있습니다",
  },
  NOT_PARTICIPATED_ROOM: {
    code: "NOT_PARTICIPATED_ROOM",
    message: "참여중인 방이 아닙니다",
  },
} as const;

export class BusinessException extends Error {
  constructor(readonly errorCode: keyof typeof ErrorCode) {
    const customErrorCode = ErrorCode[errorCode];
    super(customErrorCode.message);

    this.name = "BusinessException";
    this.errorCode = errorCode;
  }

  static newInstance(errorCode: keyof typeof ErrorCode) {
    return new BusinessException(errorCode);
  }
}

export async function handleBusinessException<T>(func: () => Promise<T>) {
  try {
    const data = await func();
    return { ok: true, ...data };
  } catch (e) {
    if (e instanceof BusinessException) {
      return { ok: false, errorCode: e.errorCode, message: e.message };
    } else {
      throw e;
    }
  }
}
