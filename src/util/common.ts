import { ICategory } from '../pages/admin/category/product-category/Category'
import moment from 'moment'

export default class Common {
  static getYoutubeIdFromURL = (url: any) => {
    if (url.includes('https://youtube.com/shorts/')) {
      return url.replace('https://youtube.com/shorts/', '')
    }
    if (url.includes('https://www.youtube.com/shorts/')) {
      return url.replace('https://www.youtube.com/shorts/', '')
    }

    var youtubeId: any
    url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
    if (url[2] !== undefined) {
      youtubeId = url[2].split(/[^0-9a-z_\-]/i)
      youtubeId = youtubeId[0]
    } else {
      youtubeId = url
    }

    return youtubeId
  }

  static getCategoryString = (
    category1: ICategory | undefined | null,
    category2: ICategory | undefined | null,
    category3: ICategory | undefined | null,
  ) => {
    if (category1 === undefined || category1 === null) {
      return ''
    }

    if (category2 === undefined || category2 === null) {
      return category1.name
    }

    if (category3 === undefined || category3 === null) {
      return `${category1.name} > ${category2.name}`
    }

    return `${category1.name} > ${category2.name} > ${category3.name}`
  }

  static getDateTime = (dateTime: string | null) => {
    if (dateTime === '' || dateTime === null) {
      return ''
    }
    return moment(dateTime).format('yyyy-MM-DD HH:mm')
  }

  static getDate = (dateTime: string | null) => {
    if (dateTime === null) {
      return null
    }
    return new Date(moment(dateTime).format('yyyy-MM-DD'))
  }

  static getRecent7Days = () => {
    var daysAgo: string[] = []
    for (var i = 0; i < 7; i++) {
      daysAgo = [...daysAgo, moment().subtract(i, 'days').format('MM/DD')]
    }
    return daysAgo.reverse()
  }

  static getToDate = (date?: Date) => {
    if (date === null || date === undefined) {
      return undefined
    }

    date.setDate(date.getDate() + 1)
    return date
  }

  /**
   * 현재 시각의 상태(진행예정, 진행중, 종료) 얻기.
   */
  static getDateStatusString = (startDate: Date, endDate: Date) => {
    let startDateString = moment(startDate).format('yyyy-MM-DD')
    let endDateString = moment(endDate).format('yyyy-MM-DD')
    let currentDateString = moment().format('yyyy-MM-DD')
    if (currentDateString < startDateString) {
      return '진행예정'
    } else if (currentDateString <= endDateString) {
      return '진행중'
    } else {
      return '종료'
    }
  }

  static getThumbnailUrl = (p_url: string) => {
    return (
      p_url.substring(0, p_url.lastIndexOf(".")) +
      "_thumb" +
      p_url.substring(p_url.lastIndexOf("."))
    );
  };
  
  static getLatLonFromAddress = async (address: string) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBREJJ673HbmYXyLWaVb4Tg06y65470_xw`
    try {
      let response = await fetch(url)
      let result = await response.json() // {results: [{geometry: {location: {lat: x, lng: y}}}], status: 'OK'}
      console.log('geocode result', result)
      if (result.status === 'OK') {
        if (result.results.length > 0) {
          return result.results[0].geometry.location
        }
      }
    } catch (error) {
      return undefined
    }
    return undefined
  }

  static getFileNameFromUrl = (url: string) => {
    let lastIndex = url.lastIndexOf('-')
    if (lastIndex > 0) {
      return decodeURI(url.substring(lastIndex + 1))
    }
    return url
  }

  static getPointHistoryType = (type: string) => {
    if (type === 'direct') {
      return '직접등록'
    } else {
      return ''
    }
  }
}
