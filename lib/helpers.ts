import { format, parseISO } from 'date-fns'

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString)
    return format(date, 'MMM dd, yyyy')
  } catch {
    return dateString
  }
}

export function formatTime(timeString: string): string {
  try {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  } catch {
    return timeString
  }
}

export function formatDateTime(dateString: string, timeString: string): string {
  try {
    const date = parseISO(dateString)
    const [hours, minutes] = timeString.split(':')
    date.setHours(parseInt(hours), parseInt(minutes))
    return format(date, 'MMM dd, yyyy h:mm a')
  } catch {
    return `${formatDate(dateString)} at ${formatTime(timeString)}`
  }
}



export function getDepartmentFromRollNumber(rollNumber: string): string {
  // Try to extract department code from Thapar format first
  const thaparMatch = rollNumber.toUpperCase().match(/^\d{4}(CS|ME|EE|CE|CH|BT|MM|PH|MA|MC|MS|MT)\d{5}$/)
  if (thaparMatch) {
    const deptCode = thaparMatch[1]
    const departments: Record<string, string> = {
      'CS': 'Computer Science',
      'ME': 'Mechanical Engineering',
      'EE': 'Electrical Engineering',
      'CE': 'Civil Engineering',
      'CH': 'Chemical Engineering',
      'BT': 'Biotechnology',
      'MM': 'Metallurgical Engineering',
      'PH': 'Physics',
      'MA': 'Mathematics',
      'MC': 'Mathematics and Computing',
      'MS': 'Mathematics and Scientific Computing',
      'MT': 'Mathematics and Statistics'
    }
    return departments[deptCode] || deptCode
  }
  
  // If not Thapar format, return empty string
  return ''
}

export function getYearFromRollNumber(rollNumber: string): number {
  // Try to extract year from Thapar format first
  const thaparMatch = rollNumber.match(/^(\d{4})/)
  if (thaparMatch) {
    const year = parseInt(thaparMatch[1])
    const currentYear = new Date().getFullYear()
    const calculatedYear = currentYear - year + 1
    // Ensure year is between 1 and 5
    if (calculatedYear >= 1 && calculatedYear <= 5) {
      return calculatedYear
    }
  }
  return 1
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
