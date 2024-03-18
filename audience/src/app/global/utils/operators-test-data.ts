import { NotificationType, UINotification } from '@instigo-app/data-transfer-object';
import { ErrorType } from '@audience-app/global/utils/operators';

export interface AudiOperatorsTestCase<T, U = T> {
  case: T;
  expect: U | T;
}

function getBlankNotification(): UINotification {
  return {
    type: NotificationType.ERROR,
    content: undefined,
    title: undefined,
    options: undefined,
  };
}

export const notificationOptionsCases: AudiOperatorsTestCase<UINotification>[] = [
  {
    case: new UINotification({ type: NotificationType.ERROR, content: 'test' }),
    expect: new UINotification({ ...getBlankNotification(), content: 'test' }),
  },
  {
    case: new UINotification({
      type: NotificationType.ERROR,
      ...{ content: 'test', title: 'test title', options: {} },
    }),
    expect: new UINotification({
      ...getBlankNotification(),
      ...{ content: 'test', title: 'test title', options: {} },
    }),
  },
];
export const errorTypesTests: AudiOperatorsTestCase<ErrorType, UINotification>[] = [
  {
    case: { message: 'test message' },
    expect: new UINotification({ ...getBlankNotification(), content: 'test message' }),
  },
  {
    case: { error: { message: 'test error message' } },
    expect: new UINotification({ ...getBlankNotification(), content: 'test error message' }),
  },
  {
    case: { error: { description: 'test error description' } },
    expect: new UINotification({ ...getBlankNotification(), content: 'test error description' }),
  },
  {
    case: { error: { message: 'test error message', title: 'test error title' } },
    expect: new UINotification({
      ...getBlankNotification(),
      content: 'test error message',
      title: 'test error title',
    }),
  },
];
