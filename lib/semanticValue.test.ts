import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  moneyDeltaRole,
  transactionStatusValueRole,
  vipBenefitDisplayRole,
  vipMaintainDaysRole,
  valueRoleClass,
} from "./semanticValue";

describe("semanticValue", () => {
  it("maps transaction status", () => {
    assert.equal(transactionStatusValueRole("completed"), "success");
    assert.equal(transactionStatusValueRole("pending"), "warning");
    assert.equal(transactionStatusValueRole("failed"), "danger");
  });

  it("maps money delta", () => {
    assert.equal(moneyDeltaRole(10), "success");
    assert.equal(moneyDeltaRole(-1), "danger");
    assert.equal(moneyDeltaRole(0), "neutral");
  });

  it("maps vip benefit rows", () => {
    assert.equal(vipBenefitDisplayRole("cashback", "0.5%"), "reward");
    assert.equal(vipBenefitDisplayRole("diamond-deposit", "+5%"), "accent");
    assert.equal(vipBenefitDisplayRole("vip-manager", "—"), "muted");
    assert.equal(vipBenefitDisplayRole("fast-withdraw", "✓"), "success");
  });

  it("maps maintain days", () => {
    assert.equal(vipMaintainDaysRole(0), "warning");
    assert.equal(vipMaintainDaysRole(3), "emphasis");
  });

  it("exposes role classes", () => {
    assert.equal(valueRoleClass("reward"), "cosmic-value--reward");
  });
});
