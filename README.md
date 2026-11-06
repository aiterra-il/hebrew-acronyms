<div dir="rtl">

# hebrew-acronyms · מילון ראשי תיבות בעברית

[![npm](https://img.shields.io/npm/v/hebrew-acronyms?color=2447D6)](https://www.npmjs.com/package/hebrew-acronyms)
[![license](https://img.shields.io/badge/license-MIT-3E96F9)](LICENSE)
![dependencies](https://img.shields.io/badge/dependencies-0-060B22)

מילון של 414 ראשי תיבות נפוצים בעברית, עם פונקציות לחיפוש, לזיהוי בטקסט ולפריסה למילים מלאות.

צה״ל ← צבא הגנה לישראל · מע״מ ← מס ערך מוסף · וכו׳ ← וכולי

**למה זה שימושי?**

- **סוכנים קוליים ו-TTS.** מנועי הקראה מקריאים את ״מנכ״ל״ כאותיות. `expand()` פורס את ראשי התיבות לפני שהטקסט נשלח להקראה.
- **חיפוש.** מי שמחפש ״מס ערך מוסף״ ימצא גם מסמכים שכתוב בהם מע״מ.
- **צ׳אטבוטים ו-NLP.** מזהים ראשי תיבות בטקסט, יודעים מה הם אומרים ולאיזה תחום הם שייכים.

הפונקציות עובדות עם גרשיים עבריים (״) ועם מירכאות רגילות ("), מתעלמות מניקוד ומזהות אותיות שימוש בתחילת המילה (ובצה״ל, למנכ״ל, שהרמטכ״ל).

## התקנה

```bash
npm install hebrew-acronyms
```

בלי תלויות. עובד ב-Node.js 18 ומעלה ובדפדפן, וכולל טיפוסים ל-TypeScript.

## שימוש

```js
import { expand, lookup, search, findAcronyms } from 'hebrew-acronyms'

expand('המנכ״ל אישר את הדו״ח של רו״ח')
// 'מנהל כללי אישר את דין וחשבון של רואה חשבון'

lookup('ובצה"ל')
// { acronym: 'צה״ל', key: 'צהל', prefix: 'וב',
//   meanings: [{ text: 'צבא הגנה לישראל', category: 'army' }] }

search('מס ערך')
// [{ acronym: 'מע״מ', ... }]

findAcronyms('חברה בע״מ, כולל מע״מ')
// [{ match: 'בע״מ', index: 5, entry: {...} }, { match: 'מע״מ', index: 16, entry: {...} }]
```

### ראשי תיבות עם כמה פירושים

ב״ב יכול להיות ״בני ברק״ וגם ״בבא בתרא״. כברירת מחדל `expand()` לא נוגע בראשי תיבות כאלה, כדי לא להחליף אותם בפירוש הלא נכון. כדי לקבל את הפירוש הראשון:

```js
expand('נסענו לב״ב', { ambiguous: 'first' })
```

## API

| פונקציה | מה היא עושה |
|---|---|
| `expand(text, { ambiguous })` | מחזירה את הטקסט עם ראשי תיבות פרוסים |
| `lookup(word)` | מחזירה את הרשומה של ראשי התיבות, או `null` |
| `search(query, { category, limit })` | מחפשת לפי ראשי התיבות או לפי הפירוש |
| `findAcronyms(text)` | מחזירה את כל ראשי התיבות בטקסט, עם המיקום שלהם |
| `normalize(value)` | מסירה גרשיים, מירכאות וניקוד |
| `acronyms` | המילון המלא |
| `categories` | התחומים: צבא, תורה, משפט, מדינה, עסקים, כללי, לימודים, רפואה, מידות |

## לנסות בלי קוד

את אותו המילון אפשר לחפש באתר: **[מילון ראשי תיבות של Aiterra](https://www.aiterra.co.il/tools/hebrew-acronyms)**.

## תרומה

חסרים ראשי תיבות או שיש טעות בפירוש? אפשר לפתוח [issue](https://github.com/aiterra-il/hebrew-acronyms/issues) או pull request לקובץ `data.js`.

---

נבנה ב-**[Aiterra](https://www.aiterra.co.il)**, סטודיו לבניית אתרים, אוטומציה וסוכני AI בישראל. רישיון MIT.

</div>

## English

A dictionary of 414 Hebrew acronyms (rashei teivot) with `lookup`, `search`, `findAcronyms` and `expand`, which turns acronyms such as צה״ל into full words (צבא הגנה לישראל) before the text goes to a TTS engine, voice agent or search index. It handles both gershayim (״) and ASCII quotes, strips nikud and recognises prefix letters (ו, ב, ה, ל, מ, ש, כ). It has no dependencies, works in Node 18+ and browsers, and ships TypeScript types. MIT, by [Aiterra](https://www.aiterra.co.il).
