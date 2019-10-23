// flow-typed signature: 5694d919d4fb0b5aa03d7218546d3a3e
// flow-typed version: <<STUB>>/react-intl_v^3.3.2/flow_v0.98.0

declare module "react-intl" {
  declare type $npm$ReactIntl$MessageDescriptor = {
    id: string,
    description?: string | Object,
    defaultMessage?: string,
    ...
  };

  declare type $npm$ReactIntl$IntlConfig = {
    locale: string,
    formats: Object,
    messages: { [id: string]: string, ... },
    defaultLocale?: string,
    defaultFormats?: Object,
    ...
  };

  declare type $npm$ReactIntl$IntlProviderConfig = {
    locale: string,
    timeZone?: string,
    formats?: Object,
    messages?: { [id: string]: string, ... },
    defaultLocale?: string,
    defaultFormats?: Object,
    ...
  };

  declare type MessageFormatPrimitiveValue =
    | string
    | number
    | boolean
    | null
    | void;

  declare type $npm$ReactIntl$IntlFormat = {
    formatDate: (value: any, options?: Object) => string,
    formatTime: (value: any, options?: Object) => string,
    formatRelativeTime: (value: any, options?: Object) => string,
    formatNumber: (value: any, options?: Object) => string,
    formatPlural: (value: any, options?: Object) => string,
    formatMessage: (
      messageDescriptor: $npm$ReactIntl$MessageDescriptor,
      values?: { [key: string]: string | number }
    ) => string,
    formatHTMLMessage: (
      messageDescriptor: $npm$ReactIntl$MessageDescriptor,
      values?: { [key: string]: string | number }
    ) => string,
    ...
  };

  declare type $npm$ReactIntl$IntlShape = $npm$ReactIntl$IntlConfig &
    $npm$ReactIntl$IntlFormat;

  declare type $npm$ReactIntl$DateTimeFormatOptions = {
    localeMatcher?: "best fit" | "lookup",
    formatMatcher?: "basic" | "best fit",
    timeZone?: string,
    hour12?: boolean,
    weekday?: "narrow" | "short" | "long",
    era?: "narrow" | "short" | "long",
    year?: "numeric" | "2-digit",
    month?: "numeric" | "2-digit" | "narrow" | "short" | "long",
    day?: "numeric" | "2-digit",
    hour?: "numeric" | "2-digit",
    minute?: "numeric" | "2-digit",
    second?: "numeric" | "2-digit",
    timeZoneName?: "short" | "long",
    ...
  };

  declare type $npm$ReactIntl$RelativeFormatOptions = {
    style?: "best fit" | "numeric",
    units?: "second" | "minute" | "hour" | "day" | "month" | "year",
    ...
  };

  declare type $npm$ReactIntl$NumberFormatOptions = {
    localeMatcher?: "best fit" | "lookup",
    style?: "decimal" | "currency" | "percent",
    currency?: string,
    currencyDisplay?: "symbol" | "code" | "name",
    useGrouping?: boolean,
    minimumIntegerDigits?: number,
    minimumFractionDigits?: number,
    maximumFractionDigits?: number,
    minimumSignificantDigits?: number,
    maximumSignificantDigits?: number,
    ...
  };

  declare type $npm$ReactIntl$PluralFormatOptions = {
    style?: "cardinal" | "ordinal",
    ...
  };

  declare type $npm$ReactIntl$PluralCategoryString =
    | "zero"
    | "one"
    | "two"
    | "few"
    | "many"
    | "other";

  declare type $npm$ReactIntl$DateParseable = number | string | Date;

  declare export function useIntl(): $npm$ReactIntl$IntlShape;

  declare export function defineMessages<
    T: { [key: string]: $Exact<$npm$ReactIntl$MessageDescriptor>, ... }
  >(
    messageDescriptors: T
  ): T;

  declare export class IntlProvider extends React$Component<
    $npm$ReactIntl$IntlProviderConfig & {
      children?: React$Node,
      ...
    }
  > {}

  declare export class FormattedMessage extends React$Component<
    $npm$ReactIntl$MessageDescriptor & {
      values?: Object,
      tagName?: string,
      children?:
        | ((...formattedMessage: Array<React$Node>) => React$Node)
        | (string => React$Node),
      ...
    }
  > {}
  declare export class FormattedHTMLMessage extends React$Component<
    $npm$ReactIntl$DateTimeFormatOptions & {
      values?: Object,
      tagName?: string,
      children?: (...formattedMessage: Array<React$Node>) => React$Node,
      ...
    }
  > {}
  declare export class FormattedDate extends React$Component<
    $npm$ReactIntl$DateTimeFormatOptions & {
      value: $npm$ReactIntl$DateParseable,
      format?: string,
      children?: (formattedDate: string) => React$Node,
      ...
    }
  > {}
  declare export class FormattedTime extends React$Component<
    $npm$ReactIntl$DateTimeFormatOptions & {
      value: $npm$ReactIntl$DateParseable,
      format?: string,
      children?: (formattedDate: string) => React$Node,
      ...
    }
  > {}
  declare export class FormattedRelativeTime extends React$Component<
    $npm$ReactIntl$RelativeFormatOptions & {
      value: $npm$ReactIntl$DateParseable,
      format?: string,
      updateIntervalInSeconds?: number,
      children?: (formattedDate: string) => React$Node,
      ...
    }
  > {}
  declare export class FormattedNumber extends React$Component<
    $npm$ReactIntl$NumberFormatOptions & {
      value: number | string,
      format?: string,
      children?: (formattedNumber: string) => React$Node,
      ...
    }
  > {}
  declare export class FormattedPlural extends React$Component<
    $npm$ReactIntl$PluralFormatOptions & {
      value: number | string,
      other: React$Node,
      zero?: React$Node,
      one?: React$Node,
      two?: React$Node,
      few?: React$Node,
      many?: React$Node,
      children?: (formattedPlural: React$Node) => React$Node,
      ...
    }
  > {}

  declare type IntlShape = $npm$ReactIntl$IntlShape;
  declare type MessageDescriptor = $npm$ReactIntl$MessageDescriptor;
}
