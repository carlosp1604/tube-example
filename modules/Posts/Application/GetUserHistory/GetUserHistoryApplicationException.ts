import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'

export class GetUserHistoryApplicationException extends ApplicationException {
  public static invalidPerPageValueId = 'get_user_history_invalid_per_page_value'
  public static invalidPageValueId = 'get_user_history_invalid_page_value'
  public static invalidFilterTypeId = 'get_user_history_invalid_filter_type'
  public static invalidFilterValueId = 'get_user_history_invalid_filter_value'
  public static invalidSortingOptionId = 'get_user_history_invalid_sorting_option'
  public static invalidSortingCriteriaId = 'get_user_history_invalid_sorting_criteria'
  public static viewedByFilterMissingId = 'get_user_history_viewed_by_filter_missing'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, GetUserHistoryApplicationException.prototype)
  }

  public static invalidPerPageValue (minLimit: number, maxLimit: number): GetUserHistoryApplicationException {
    return new GetUserHistoryApplicationException(
      `PerPage must be a positive integer in range [${minLimit} - ${maxLimit}]`,
      this.invalidPerPageValueId
    )
  }

  public static invalidPageValue (): GetUserHistoryApplicationException {
    return new GetUserHistoryApplicationException(
      'Page must be a integer greater or equal to 0',
      this.invalidPageValueId
    )
  }

  public static invalidFilterType (filter: string): GetUserHistoryApplicationException {
    return new GetUserHistoryApplicationException(
      `Filter ${filter} is not a valid filter`,
      this.invalidFilterTypeId
    )
  }

  public static invalidFilterValue (): GetUserHistoryApplicationException {
    return new GetUserHistoryApplicationException(
      'Filter must be a not empty string and must not include special characters',
      this.invalidFilterValueId
    )
  }

  public static invalidSortingOption (sortingOption: string): GetUserHistoryApplicationException {
    return new GetUserHistoryApplicationException(
      `Sorting option ${sortingOption} is not a valid sorting option`,
      this.invalidSortingOptionId
    )
  }

  public static invalidSortingCriteria (sortingCriteria: string): GetUserHistoryApplicationException {
    return new GetUserHistoryApplicationException(
      `Sorting criteria ${sortingCriteria} is not a valid sorting criteria`,
      this.invalidSortingCriteriaId
    )
  }

  public static viewedByIdFilterMissing (): GetUserHistoryApplicationException {
    return new GetUserHistoryApplicationException(
      "You must provide a userId in the viewedBy filter to get the user's saved post",
      this.viewedByFilterMissingId
    )
  }
}