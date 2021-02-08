import moment from 'moment';
import { ValidationErrors } from '~/models/validationErrors.enum';

class ValidationService {
  private emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  validateEmail(email: string): ValidationErrors | boolean {
    return this.emailRegex.exec(email) !== null
      ? true
      : ValidationErrors.EMAIL_INVALID;
  }

  validatePasswordLength(password: string): ValidationErrors | boolean {
    if (password.length < 8) {
      return ValidationErrors.PASSWORD_TO_SHORT;
    } else if (password.length > 64) {
      return ValidationErrors.PASSWORD_TO_LONG;
    }
    return true;
  }

  validatePasswordMatch(
    password: string,
    passwordMatch: string
  ): ValidationErrors | boolean {
    return password === passwordMatch
      ? true
      : ValidationErrors.PASSWORD_NOT_MATCHING;
  }

  validateTextField(
    text: string
  ): ValidationErrors.VALID | ValidationErrors.TEXTFIELD_EMPTY {
    return !!text ? ValidationErrors.VALID : ValidationErrors.TEXTFIELD_EMPTY;
  }

  validateTextFieldLength(
    text: string,
    length: number,
    error: ValidationErrors
  ): ValidationErrors | boolean {
    return text.length === length ? true : error;
  }

  validateDate(
    date: string,
    format: string
  ): ValidationErrors.DATE_INVALIDE | ValidationErrors.VALID {
    return !!date
      ? moment(date, format, true).isValid()
        ? ValidationErrors.VALID
        : ValidationErrors.DATE_INVALIDE
      : ValidationErrors.DATE_INVALIDE;
  }

  validateScope(selected: string[]): ValidationErrors | boolean {
    return selected.length > 0 ? true : ValidationErrors.SCOPE_EMPTY;
  }
}

export const validationService: ValidationService = new ValidationService();
