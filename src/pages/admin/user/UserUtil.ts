export default class UserUtil {
  static getAccountTypeString = (type: string) => {
    return {
      general: '일반회원',
      business: '기업회원',
    }[type]
  }

  static getStatusString = (status: string) => {
    return {
      waiting_approval: '승인대기',
      active: '정상',
      idle: '휴면',
      waiting_inactive: '휴면대기',
      inactive: '탈퇴',
    }[status]
  }
}
