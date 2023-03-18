import request from '@/utils/request'

export function temperatureLine() {
  return request({
    url: '/statistics/temperatureLine',
    method: 'get'
  })
}

export function locationPie() {
  return request({
    url: '/statistics/locationPie',
    method: 'get'
  })
}

export function infectedSpanBar() {
  return request({
    url: '/statistics/infectedSpanBar',
    method: 'get'
  })
}

export function reportInfoBar() {
  return request({
    url: '/statistics/reportInfoBar',
    method: 'get'
  })
}

export function vaccinesNumPie() {
  return request({
    url: '/statistics/vaccinesNumPie',
    method: 'get'
  })
}

export function infectedNumLine() {
  return request({
    url: '/statistics/infectedNumLine',
    method: 'get'
  })
}

export function eachSeriousBar() {
  return request({
    url: '/statistics/eachSeriousBar',
    method: 'get'
  })
}

export function eachSeriousPie() {
  return request({
    url: '/statistics/eachSeriousPie',
    method: 'get'
  })
}

export function numOutEnterBar() {
  return request({
    url: '/statistics/numOutEnterBar',
    method: 'get'
  })
}

export function dayOutEnterLine() {
  return request({
    url: '/statistics/dayOutEnterLine',
    method: 'get'
  })
}

export function typeOutEnterRadar() {
  return request({
    url: '/statistics/typeOutEnterRadar',
    method: 'get'
  })
}




