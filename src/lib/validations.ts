export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone: string): boolean {
  const re = /^\+?[0-9\s-]{8,15}$/;
  return re.test(phone);
}

export function validateAirportCode(code: string): boolean {
  return /^[A-Z]{3}$/.test(code.toUpperCase());
}