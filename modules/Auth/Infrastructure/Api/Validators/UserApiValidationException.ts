import { ZodIssue } from 'zod'
import { ZodApiValidationException } from '~/modules/Exceptions/Infrastructure/ZodApiValidationException'

export class UserApiValidationException extends ZodApiValidationException {
  public static createUserRequestId = 'validator_exception_create_user_request'
  public static verifyEmailAddressRequestId = 'validator_exception_verify_email_address_request'
  public static validateTokenRequestId = 'validator_exception_validate_token_request'
  public static changeUserPasswordRequestId = 'validator_exception_change_user_password_request'
  public static getUserByUsernameRequestId = 'validator_exception_get_user_by_username_request'
  public static addSavedPostRequestId = 'validator_exception_add_saved_post_request_id'
  public static deleteSavedPostRequestId = 'validator_exception_delete_saved_post_request_id'

  public static createUserValidation (issues: ZodIssue[]): UserApiValidationException {
    return new UserApiValidationException(
      this.createUserRequestId,
      issues
    )
  }

  public static verifyEmailAddressRequest (issues: ZodIssue[]): UserApiValidationException {
    return new UserApiValidationException(
      this.verifyEmailAddressRequestId,
      issues
    )
  }

  public static validateTokenRequest (issues: ZodIssue[]): UserApiValidationException {
    return new UserApiValidationException(
      this.validateTokenRequestId,
      issues
    )
  }

  public static changeUserPasswordRequest (issues: ZodIssue[]): UserApiValidationException {
    return new UserApiValidationException(
      this.changeUserPasswordRequestId,
      issues
    )
  }

  public static getUserByUsernameRequest (issues: ZodIssue[]): UserApiValidationException {
    return new UserApiValidationException(
      this.getUserByUsernameRequestId,
      issues
    )
  }

  public static addSavedPostRequest (issues: ZodIssue[]): UserApiValidationException {
    return new UserApiValidationException(
      this.addSavedPostRequestId,
      issues
    )
  }

  public static deleteSavedPostRequest (issues: ZodIssue[]): UserApiValidationException {
    return new UserApiValidationException(
      this.deleteSavedPostRequestId,
      issues
    )
  }
}
