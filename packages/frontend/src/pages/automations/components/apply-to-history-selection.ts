import {
  AUTOMATION_PROTECTED_CATEGORY_SOURCES,
  CATEGORIZATION_SOURCE,
  type RecordId,
  type TransactionAutomationModel,
  type TransactionModel,
} from '@bt/shared/types';

export type AutomationMatchBadgeKey = 'manual' | 'ai' | 'subscriptionKept' | 'alreadyApplied';

export type AutomationApplyRule = Pick<TransactionAutomationModel, 'id' | 'actions'>;

export const getBadgeKey = ({
  tx,
  ruleId,
}: {
  tx: TransactionModel;
  ruleId: RecordId;
}): AutomationMatchBadgeKey | null => {
  const source = tx.categorizationMeta?.source;

  switch (source) {
    case CATEGORIZATION_SOURCE.manual:
      return 'manual';
    case CATEGORIZATION_SOURCE.ai:
      return 'ai';
    case CATEGORIZATION_SOURCE.subscriptionRule:
      return 'subscriptionKept';
    case CATEGORIZATION_SOURCE.userRule:
      return tx.categorizationMeta?.ruleId === ruleId ? 'alreadyApplied' : null;
    case CATEGORIZATION_SOURCE.mccRule:
    case CATEGORIZATION_SOURCE.payeeRule:
    case undefined:
      return null;
    default:
      source satisfies never;
      return null;
  }
};

/** Mirrors the server: a protected category stamp survives, so a category-only rule would write nothing. */
export const isLocked = ({ tx, rule }: { tx: TransactionModel; rule: AutomationApplyRule }): boolean => {
  const source = tx.categorizationMeta?.source;
  if (!source || !AUTOMATION_PROTECTED_CATEGORY_SOURCES.includes(source)) return false;
  return rule.actions.every((action) => action.type === 'set_category');
};

export const isPreselected = ({ tx, rule }: { tx: TransactionModel; rule: AutomationApplyRule }): boolean => {
  if (isLocked({ tx, rule })) return false;
  const badge = getBadgeKey({ tx, ruleId: rule.id });
  return badge !== 'manual' && badge !== 'ai' && badge !== 'alreadyApplied';
};
