export const SUCCESS_CODE = {
  LOGIN_SUCCESS: { RESULT_CODE: "RESULT_2001", CODE: 2001, MSG: "로그인 성공" },
  AUTH_SUCCESS: {
    RESULT_CODE: "RESULT_2002",
    CODE: 2002,
    MSG: "토큰 인증 성공",
  },
  JOIN_SUCCESS:{
      RESULT_CODE:'RESULT_2003',
      CODE:2003,
      MSG:"회원가입 성공"
  }
};

export const ERROR_CODE = {
  LOGIN_FAIL: { RESULT_CODE: "RESULT_4001", CODE: 4001, MSG: "로그인 실패" },
  AUTH_FAIL: { RESULT_CODE: "RESULT_4002", CODE: 4002, MSG: "토큰 만료" },
  JOIN_FAIL: {RESULT_CODE : "RESULT_4003", CODE:4003, MSG:"회원가입 실패"}
};
