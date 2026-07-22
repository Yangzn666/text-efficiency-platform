/**
 * API配置工具
 * 自动检测设备类型，返回正确的API基础URL
 */

// 获取API基础URL
export const getApiBaseUrl = (): string => {
  // 检测是否为移动端访问
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  
  // 移动端使用局域网IP，PC端使用localhost
  // 注意：如果IP地址改变，需要更新这里的IP
  const baseUrl = isMobile ? 'http://192.168.1.103:6902' : 'http://localhost:6902'
  
  console.log(`📱 设备类型: ${isMobile ? '移动端' : 'PC端'}, API地址: ${baseUrl}`)
  
  return baseUrl
}

// 构建完整的API URL
export const buildApiUrl = (path: string): string => {
  const baseUrl = getApiBaseUrl()
  // 确保path以/开头
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}
