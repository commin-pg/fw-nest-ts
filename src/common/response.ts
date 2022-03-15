import { HttpCode, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { SUCCESS_CODE } from "src/constants/message.constants";

export class CustomResponse<T> {
  constructor(private res: Response) {}
  OK(data: T) {
    return this.res.status(HttpStatus.OK).json({
      success: true,
      resultCode: SUCCESS_CODE.REQUEST_SUCCESS.RESULT_CODE,
      code: SUCCESS_CODE.REQUEST_SUCCESS.CODE,
      msg: SUCCESS_CODE.REQUEST_SUCCESS.MSG,
      data: data,
    });
  }

  _OK() {
    return this.res.status(HttpStatus.OK).json({
      success: true,
      resultCode: SUCCESS_CODE.REQUEST_SUCCESS.RESULT_CODE,
      code: SUCCESS_CODE.REQUEST_SUCCESS.CODE,
      msg: SUCCESS_CODE.REQUEST_SUCCESS.MSG,
    });
  }

  ERROR(resultCode: string, code: number, msg: string) {
    return this.res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      resultCode: resultCode,
      code: code,
      msg: msg,
    });
  }
}
