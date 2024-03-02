export interface ICommonConstant {
  id: string
  name: string
  type: string
  priority: number
  display: boolean
  main_display: boolean
}

export const getConstantsIds = (constants: ICommonConstant[]): number[] => {
  return constants.map((it) => Number(it.id))
}

export const getConstantFromConstants = (
  constants: ICommonConstant[],
  constant?: ICommonConstant,
): ICommonConstant | undefined => {
  if (constant === null || constant === undefined) {
    return undefined
  }
  return constants.find((it) => it.id === constant.id)
}

export const getConstantId = (constants: ICommonConstant[], name: string): number => {
  let constant = constants.find((it) => it.name.substring(0, name.length) == name)
  if (constant === undefined) {
    return 0
  } else {
    return Number(constant.id)
  }
}
