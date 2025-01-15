import { maxRubValue, minRubValue } from "../constants";
import checkSetValue from "../utils/checkSetValue";

test("test", () => {
    expect(checkSetValue(minRubValue, maxRubValue, 5000)).toBe("lessMin");
    expect(checkSetValue(minRubValue, maxRubValue, 700000000000)).toBe("moreMax");
    expect(checkSetValue(minRubValue, maxRubValue, 25000)).toBe("fit");
});

