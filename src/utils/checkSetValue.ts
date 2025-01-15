import { CheckResult } from "../types/CheckResult";

export default function checkSetValue(minValue: number, maxValue: number, newValue: number):CheckResult{
  if (newValue < minValue) return "lessMin";
  if (newValue > maxValue) return "moreMax";
  return "fit";
}