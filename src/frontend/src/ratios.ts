export type RatioCategory =
  | "Profitability"
  | "Liquidity"
  | "Solvency"
  | "Efficiency"
  | "Valuation";

export interface RatioInput {
  key: string;
  label: string;
  placeholder: string;
}

export interface Ratio {
  id: string;
  name: string;
  category: RatioCategory;
  shortDescription: string;
  formula: string;
  formulaVars: { symbol: string; name: string; description: string }[];
  definition: string;
  eli5: string;
  inputs: RatioInput[];
  calculate: (vals: Record<string, number>) => number;
  format: "percent" | "ratio" | "times" | "x";
  interpretation: {
    bad: string;
    ok: string;
    good: string;
    badLabel: string;
    okLabel: string;
    goodLabel: string;
    badColor: string;
    okColor: string;
    goodColor: string;
    thresholdLow: number;
    thresholdHigh: number;
    higherIsBetter: boolean;
  };
  benchmarks: { industry: string; typical: string; good: string }[];
  example: {
    scenario: string;
    result: number;
    resultLabel: string;
    interpretation: string;
  };
}

export const RATIOS: Ratio[] = [
  {
    id: "roe",
    name: "Return on Equity (ROE)",
    category: "Profitability",
    shortDescription:
      "How much profit is generated from shareholders' investment.",
    formula: "Net Income / Shareholders' Equity × 100",
    formulaVars: [
      {
        symbol: "Net Income",
        name: "Net Income",
        description: "The company's total profit after all expenses and taxes.",
      },
      {
        symbol: "Equity",
        name: "Shareholders' Equity",
        description:
          "Total assets minus total liabilities — what owners actually own.",
      },
    ],
    definition:
      "Return on Equity measures how efficiently a company uses shareholders' money to generate profit. A higher ROE means the company is better at turning investment into profit.",
    eli5: "Imagine you give $100 to a lemonade stand. ROE tells you how many dollars of profit the stand made for every $100 you gave. If ROE is 20%, you earned $20 for every $100 invested!",
    inputs: [
      {
        key: "netIncome",
        label: "Net Income ($)",
        placeholder: "e.g. 5000000",
      },
      {
        key: "equity",
        label: "Shareholders' Equity ($)",
        placeholder: "e.g. 25000000",
      },
    ],
    calculate: (v) => (v.netIncome / v.equity) * 100,
    format: "percent",
    interpretation: {
      bad: "Below 10% — The company isn't generating great returns. Could indicate inefficiency or high costs.",
      ok: "10–15% — Decent returns. Company is performing adequately but has room to improve.",
      good: "Above 15% — Strong returns. The company is highly efficient at generating profit from equity.",
      badLabel: "Weak",
      okLabel: "Moderate",
      goodLabel: "Strong",
      badColor: "red",
      okColor: "yellow",
      goodColor: "green",
      thresholdLow: 10,
      thresholdHigh: 15,
      higherIsBetter: true,
    },
    benchmarks: [
      { industry: "Technology", typical: "15–25%", good: ">20%" },
      { industry: "Banking", typical: "10–15%", good: ">12%" },
      { industry: "Retail", typical: "10–20%", good: ">15%" },
      { industry: "Manufacturing", typical: "8–15%", good: ">12%" },
    ],
    example: {
      scenario:
        "Apple Inc. earned $100B net income with $62B in shareholders' equity.",
      result: 161,
      resultLabel: "161%",
      interpretation:
        "Apple's exceptionally high ROE reflects its strong brand, high margins, and share buybacks.",
    },
  },
  {
    id: "roa",
    name: "Return on Assets (ROA)",
    category: "Profitability",
    shortDescription:
      "How efficiently a company uses its assets to generate profit.",
    formula: "Net Income / Total Assets × 100",
    formulaVars: [
      {
        symbol: "Net Income",
        name: "Net Income",
        description: "Total profit after all expenses and taxes.",
      },
      {
        symbol: "Total Assets",
        name: "Total Assets",
        description:
          "Everything the company owns: cash, equipment, buildings, etc.",
      },
    ],
    definition:
      "Return on Assets shows how efficiently management uses the company's assets to generate earnings. It compares net income to total assets.",
    eli5: "Think of it this way: if a pizza shop has $10,000 worth of ovens, tables, and ingredients, ROA tells you how many dollars of profit they made from all that stuff.",
    inputs: [
      {
        key: "netIncome",
        label: "Net Income ($)",
        placeholder: "e.g. 5000000",
      },
      {
        key: "totalAssets",
        label: "Total Assets ($)",
        placeholder: "e.g. 50000000",
      },
    ],
    calculate: (v) => (v.netIncome / v.totalAssets) * 100,
    format: "percent",
    interpretation: {
      bad: "Below 5% — Low efficiency. The company isn't using its assets well.",
      ok: "5–10% — Decent efficiency. Assets are moderately productive.",
      good: "Above 10% — Excellent efficiency. Company generates strong returns from its assets.",
      badLabel: "Low",
      okLabel: "Average",
      goodLabel: "Excellent",
      badColor: "red",
      okColor: "yellow",
      goodColor: "green",
      thresholdLow: 5,
      thresholdHigh: 10,
      higherIsBetter: true,
    },
    benchmarks: [
      { industry: "Technology", typical: "8–15%", good: ">10%" },
      { industry: "Banking", typical: "1–2%", good: ">1.5%" },
      { industry: "Retail", typical: "4–8%", good: ">6%" },
      { industry: "Manufacturing", typical: "3–8%", good: ">5%" },
    ],
    example: {
      scenario:
        "A company with $50M in total assets generates $4M in net income.",
      result: 8,
      resultLabel: "8%",
      interpretation:
        "An 8% ROA is solid, meaning the company earns $8 of profit for every $100 of assets.",
    },
  },
  {
    id: "netProfitMargin",
    name: "Net Profit Margin",
    category: "Profitability",
    shortDescription:
      "Percentage of revenue that becomes profit after all expenses.",
    formula: "Net Income / Revenue × 100",
    formulaVars: [
      {
        symbol: "Net Income",
        name: "Net Income",
        description:
          "What's left after subtracting all costs, taxes, and interest.",
      },
      {
        symbol: "Revenue",
        name: "Revenue",
        description: "Total money earned from selling products or services.",
      },
    ],
    definition:
      "Net Profit Margin tells you how much of each dollar of revenue a company keeps as profit. It's one of the most important indicators of financial health.",
    eli5: "If you sold $100 worth of cookies and kept $15 after buying ingredients and paying rent, your net profit margin is 15%. Higher means you keep more of each sale!",
    inputs: [
      {
        key: "netIncome",
        label: "Net Income ($)",
        placeholder: "e.g. 10000000",
      },
      { key: "revenue", label: "Revenue ($)", placeholder: "e.g. 100000000" },
    ],
    calculate: (v) => (v.netIncome / v.revenue) * 100,
    format: "percent",
    interpretation: {
      bad: "Below 5% — Thin margins. Small cost increases could wipe out profits.",
      ok: "5–10% — Reasonable margins. Company is profitable but costs are significant.",
      good: "Above 10% — Strong margins. Company efficiently converts revenue to profit.",
      badLabel: "Thin",
      okLabel: "Moderate",
      goodLabel: "Strong",
      badColor: "red",
      okColor: "yellow",
      goodColor: "green",
      thresholdLow: 5,
      thresholdHigh: 10,
      higherIsBetter: true,
    },
    benchmarks: [
      { industry: "Software/SaaS", typical: "15–30%", good: ">20%" },
      { industry: "Retail", typical: "2–5%", good: ">4%" },
      { industry: "Healthcare", typical: "5–15%", good: ">10%" },
      { industry: "Manufacturing", typical: "3–8%", good: ">6%" },
    ],
    example: {
      scenario:
        "A retailer earns $500M in revenue and reports $25M in net income.",
      result: 5,
      resultLabel: "5%",
      interpretation:
        "A 5% margin is typical for retail — every $100 in sales yields $5 profit.",
    },
  },
  {
    id: "grossMargin",
    name: "Gross Margin",
    category: "Profitability",
    shortDescription:
      "Revenue remaining after subtracting direct production costs.",
    formula: "(Revenue − COGS) / Revenue × 100",
    formulaVars: [
      {
        symbol: "Revenue",
        name: "Revenue",
        description: "Total sales income.",
      },
      {
        symbol: "COGS",
        name: "Cost of Goods Sold",
        description:
          "Direct costs to produce the goods sold (materials, manufacturing).",
      },
    ],
    definition:
      "Gross Margin measures how much revenue remains after paying for the direct costs of producing goods. Higher gross margins indicate pricing power and production efficiency.",
    eli5: "If you sell a toy for $10 and it cost you $4 to make it, you kept $6. That's a 60% gross margin! It tells you how much room you have after making the product.",
    inputs: [
      { key: "revenue", label: "Revenue ($)", placeholder: "e.g. 100000000" },
      {
        key: "cogs",
        label: "Cost of Goods Sold ($)",
        placeholder: "e.g. 60000000",
      },
    ],
    calculate: (v) => ((v.revenue - v.cogs) / v.revenue) * 100,
    format: "percent",
    interpretation: {
      bad: "Below 20% — Low margins. High production costs eating into revenue.",
      ok: "20–40% — Average margins. Room for improvement in pricing or cost reduction.",
      good: "Above 40% — Strong margins. Excellent pricing power or low production costs.",
      badLabel: "Low",
      okLabel: "Average",
      goodLabel: "Excellent",
      badColor: "red",
      okColor: "yellow",
      goodColor: "green",
      thresholdLow: 20,
      thresholdHigh: 40,
      higherIsBetter: true,
    },
    benchmarks: [
      { industry: "Software", typical: "60–80%", good: ">70%" },
      { industry: "Consumer Goods", typical: "30–50%", good: ">40%" },
      { industry: "Grocery", typical: "20–30%", good: ">25%" },
      { industry: "Manufacturing", typical: "20–35%", good: ">30%" },
    ],
    example: {
      scenario: "A company has $200M in revenue and $120M in COGS.",
      result: 40,
      resultLabel: "40%",
      interpretation:
        "40% gross margin means the company keeps $40 of every $100 in revenue after production costs.",
    },
  },
  {
    id: "currentRatio",
    name: "Current Ratio",
    category: "Liquidity",
    shortDescription:
      "Ability to pay short-term obligations with current assets.",
    formula: "Current Assets / Current Liabilities",
    formulaVars: [
      {
        symbol: "Current Assets",
        name: "Current Assets",
        description:
          "Assets convertible to cash within one year (cash, receivables, inventory).",
      },
      {
        symbol: "Current Liabilities",
        name: "Current Liabilities",
        description:
          "Obligations due within one year (payables, short-term debt).",
      },
    ],
    definition:
      "The Current Ratio measures a company's ability to pay its short-term liabilities with its short-term assets. A ratio above 1 means assets exceed liabilities.",
    eli5: "Imagine you owe $100 in bills due next month. The current ratio tells you how many dollars you have available to pay those bills. If it's 2.0, you have $200 to pay $100 — you're safe!",
    inputs: [
      {
        key: "currentAssets",
        label: "Current Assets ($)",
        placeholder: "e.g. 50000000",
      },
      {
        key: "currentLiabilities",
        label: "Current Liabilities ($)",
        placeholder: "e.g. 25000000",
      },
    ],
    calculate: (v) => v.currentAssets / v.currentLiabilities,
    format: "ratio",
    interpretation: {
      bad: "Below 1.0 — Danger zone. Liabilities exceed assets; company may struggle to pay bills.",
      ok: "1.0–1.5 — Adequate but tight. Just enough to cover obligations.",
      good: "Above 1.5 — Comfortable liquidity. Company can easily meet short-term obligations.",
      badLabel: "Risky",
      okLabel: "Adequate",
      goodLabel: "Strong",
      badColor: "red",
      okColor: "yellow",
      goodColor: "green",
      thresholdLow: 1.0,
      thresholdHigh: 1.5,
      higherIsBetter: true,
    },
    benchmarks: [
      { industry: "Technology", typical: "1.5–3.0", good: ">2.0" },
      { industry: "Retail", typical: "1.0–2.0", good: ">1.5" },
      { industry: "Manufacturing", typical: "1.2–2.5", good: ">1.8" },
      { industry: "Services", typical: "1.0–2.0", good: ">1.5" },
    ],
    example: {
      scenario:
        "A company has $3M in current assets and $1.5M in current liabilities.",
      result: 2.0,
      resultLabel: "2.0x",
      interpretation:
        "A 2.0 current ratio means the company has twice as many current assets as current liabilities — healthy liquidity.",
    },
  },
  {
    id: "quickRatio",
    name: "Quick Ratio (Acid-Test)",
    category: "Liquidity",
    shortDescription:
      "Ability to meet short-term obligations without selling inventory.",
    formula: "(Current Assets − Inventory) / Current Liabilities",
    formulaVars: [
      {
        symbol: "Current Assets",
        name: "Current Assets",
        description: "All assets convertible to cash within a year.",
      },
      {
        symbol: "Inventory",
        name: "Inventory",
        description:
          "Goods held for sale — excluded because they may take time to sell.",
      },
      {
        symbol: "Current Liabilities",
        name: "Current Liabilities",
        description: "Short-term debts and obligations.",
      },
    ],
    definition:
      "The Quick Ratio is a stricter test of liquidity than the Current Ratio. It excludes inventory since it may not be quickly converted to cash.",
    eli5: "It's like asking: if you had to pay all your bills tomorrow, could you do it WITHOUT selling your products? It checks if you have enough cash and receivables.",
    inputs: [
      {
        key: "currentAssets",
        label: "Current Assets ($)",
        placeholder: "e.g. 50000000",
      },
      {
        key: "inventory",
        label: "Inventory ($)",
        placeholder: "e.g. 10000000",
      },
      {
        key: "currentLiabilities",
        label: "Current Liabilities ($)",
        placeholder: "e.g. 25000000",
      },
    ],
    calculate: (v) => (v.currentAssets - v.inventory) / v.currentLiabilities,
    format: "ratio",
    interpretation: {
      bad: "Below 0.5 — Very risky. Company relies heavily on inventory to pay bills.",
      ok: "0.5–1.0 — Acceptable. May need to sell inventory for some obligations.",
      good: "Above 1.0 — Strong. Can cover all short-term liabilities without selling inventory.",
      badLabel: "Risky",
      okLabel: "Fair",
      goodLabel: "Strong",
      badColor: "red",
      okColor: "yellow",
      goodColor: "green",
      thresholdLow: 0.5,
      thresholdHigh: 1.0,
      higherIsBetter: true,
    },
    benchmarks: [
      { industry: "Technology", typical: "1.0–2.5", good: ">1.5" },
      { industry: "Retail", typical: "0.3–0.8", good: ">0.5" },
      { industry: "Manufacturing", typical: "0.5–1.5", good: ">1.0" },
      { industry: "Services", typical: "0.8–1.5", good: ">1.0" },
    ],
    example: {
      scenario:
        "A retailer has $2M current assets, $800K inventory, and $1.5M current liabilities.",
      result: 0.8,
      resultLabel: "0.8x",
      interpretation:
        "Quick ratio of 0.8 is below 1 — the retailer would need some inventory sales to cover all bills.",
    },
  },
  {
    id: "debtToEquity",
    name: "Debt-to-Equity Ratio",
    category: "Solvency",
    shortDescription: "How much the company relies on debt vs. owner equity.",
    formula: "Total Debt / Total Equity",
    formulaVars: [
      {
        symbol: "Total Debt",
        name: "Total Debt",
        description:
          "All borrowed money (short-term + long-term loans, bonds).",
      },
      {
        symbol: "Total Equity",
        name: "Shareholders' Equity",
        description: "Total assets minus total liabilities.",
      },
    ],
    definition:
      "The Debt-to-Equity ratio compares total debt to shareholders' equity. It shows the financial leverage — how much of the business is financed by creditors vs. owners.",
    eli5: "If you borrowed $70 and used $30 of your own money to buy a $100 bike, your debt-to-equity is 2.3. The higher this number, the more in debt the company is compared to what owners actually own.",
    inputs: [
      {
        key: "totalDebt",
        label: "Total Debt ($)",
        placeholder: "e.g. 30000000",
      },
      {
        key: "equity",
        label: "Total Equity ($)",
        placeholder: "e.g. 20000000",
      },
    ],
    calculate: (v) => v.totalDebt / v.equity,
    format: "ratio",
    interpretation: {
      bad: "Above 2.0 — High leverage. Risk of financial distress if earnings drop.",
      ok: "1.0–2.0 — Moderate leverage. Acceptable for most industries.",
      good: "Below 1.0 — Low leverage. Company is mostly funded by equity — conservative and safe.",
      badLabel: "High Risk",
      okLabel: "Moderate",
      goodLabel: "Conservative",
      badColor: "red",
      okColor: "yellow",
      goodColor: "green",
      thresholdLow: 1.0,
      thresholdHigh: 2.0,
      higherIsBetter: false,
    },
    benchmarks: [
      { industry: "Technology", typical: "0.3–0.8", good: "<0.5" },
      { industry: "Banking", typical: "5–10+", good: "<8" },
      { industry: "Utilities", typical: "1.5–3.0", good: "<2.0" },
      { industry: "Manufacturing", typical: "0.5–1.5", good: "<1.0" },
    ],
    example: {
      scenario: "A company has $40M in total debt and $20M in equity.",
      result: 2.0,
      resultLabel: "2.0x",
      interpretation:
        "D/E of 2.0 means for every $1 of equity, the company has $2 of debt — moderately leveraged.",
    },
  },
  {
    id: "interestCoverage",
    name: "Interest Coverage Ratio",
    category: "Solvency",
    shortDescription:
      "How easily a company can pay interest on its outstanding debt.",
    formula: "EBIT / Interest Expense",
    formulaVars: [
      {
        symbol: "EBIT",
        name: "Earnings Before Interest & Taxes",
        description: "Operating profit before paying interest and taxes.",
      },
      {
        symbol: "Interest Expense",
        name: "Interest Expense",
        description: "The cost of borrowing — payments on loans and bonds.",
      },
    ],
    definition:
      "The Interest Coverage Ratio measures how many times a company can cover its interest payments with its earnings. A higher ratio means the company has a larger cushion.",
    eli5: "If your business earns $5,000 and your loan payment is $1,000, your interest coverage is 5x. It tells you how many times over you can pay the interest bill.",
    inputs: [
      { key: "ebit", label: "EBIT ($)", placeholder: "e.g. 10000000" },
      {
        key: "interestExpense",
        label: "Interest Expense ($)",
        placeholder: "e.g. 2000000",
      },
    ],
    calculate: (v) => v.ebit / v.interestExpense,
    format: "times",
    interpretation: {
      bad: "Below 1.5 — Dangerous. Company barely earns enough to cover interest.",
      ok: "1.5–3.0 — Manageable. Can cover interest but not by a large margin.",
      good: "Above 3.0 — Comfortable. Earnings well exceed interest obligations.",
      badLabel: "Dangerous",
      okLabel: "Manageable",
      goodLabel: "Comfortable",
      badColor: "red",
      okColor: "yellow",
      goodColor: "green",
      thresholdLow: 1.5,
      thresholdHigh: 3.0,
      higherIsBetter: true,
    },
    benchmarks: [
      { industry: "Technology", typical: "10–30x", good: ">15x" },
      { industry: "Retail", typical: "3–8x", good: ">5x" },
      { industry: "Utilities", typical: "2–4x", good: ">3x" },
      { industry: "Manufacturing", typical: "3–10x", good: ">5x" },
    ],
    example: {
      scenario: "A company earns $15M in EBIT and has $3M in interest expense.",
      result: 5.0,
      resultLabel: "5x",
      interpretation:
        "An interest coverage of 5x means the company earns 5 times its interest obligation — very safe.",
    },
  },
  {
    id: "assetTurnover",
    name: "Asset Turnover Ratio",
    category: "Efficiency",
    shortDescription:
      "How efficiently a company uses its assets to generate revenue.",
    formula: "Revenue / Total Assets",
    formulaVars: [
      {
        symbol: "Revenue",
        name: "Revenue",
        description: "Total net sales for the period.",
      },
      {
        symbol: "Total Assets",
        name: "Total Assets",
        description: "Average total assets (beginning + ending / 2).",
      },
    ],
    definition:
      "Asset Turnover measures how effectively a company uses its assets to generate revenue. A higher ratio means each dollar of assets generates more revenue.",
    eli5: "If a shop has $100 in equipment and makes $150 in sales, its asset turnover is 1.5. Higher means the shop is better at squeezing sales out of what it owns.",
    inputs: [
      { key: "revenue", label: "Revenue ($)", placeholder: "e.g. 100000000" },
      {
        key: "totalAssets",
        label: "Total Assets ($)",
        placeholder: "e.g. 50000000",
      },
    ],
    calculate: (v) => v.revenue / v.totalAssets,
    format: "times",
    interpretation: {
      bad: "Below 0.5 — Low efficiency. Assets are not generating enough revenue.",
      ok: "0.5–1.0 — Moderate efficiency. Assets are moderately productive.",
      good: "Above 1.0 — High efficiency. Generating strong revenue from assets.",
      badLabel: "Low",
      okLabel: "Moderate",
      goodLabel: "Efficient",
      badColor: "red",
      okColor: "yellow",
      goodColor: "green",
      thresholdLow: 0.5,
      thresholdHigh: 1.0,
      higherIsBetter: true,
    },
    benchmarks: [
      { industry: "Retail", typical: "1.5–3.0", good: ">2.0" },
      { industry: "Technology", typical: "0.5–1.0", good: ">0.8" },
      { industry: "Manufacturing", typical: "0.5–1.5", good: ">1.0" },
      { industry: "Utilities", typical: "0.2–0.5", good: ">0.4" },
    ],
    example: {
      scenario:
        "A retailer generates $300M in revenue with $150M in total assets.",
      result: 2.0,
      resultLabel: "2.0x",
      interpretation:
        "Asset turnover of 2x means $1 of assets generates $2 of revenue — excellent for retail.",
    },
  },
  {
    id: "inventoryTurnover",
    name: "Inventory Turnover",
    category: "Efficiency",
    shortDescription:
      "How many times inventory is sold and replaced in a period.",
    formula: "Cost of Goods Sold / Average Inventory",
    formulaVars: [
      {
        symbol: "COGS",
        name: "Cost of Goods Sold",
        description: "Direct cost to produce the goods sold during the period.",
      },
      {
        symbol: "Inventory",
        name: "Average Inventory",
        description: "Average of beginning and ending inventory values.",
      },
    ],
    definition:
      "Inventory Turnover shows how many times a company sells and replenishes its inventory during a period. High turnover means efficient inventory management.",
    eli5: "If your store starts with 100 toys, sells them all, restocks 100 more and sells those too — your turnover is 2. The higher this number, the faster you sell your products!",
    inputs: [
      {
        key: "cogs",
        label: "Cost of Goods Sold ($)",
        placeholder: "e.g. 80000000",
      },
      {
        key: "inventory",
        label: "Average Inventory ($)",
        placeholder: "e.g. 10000000",
      },
    ],
    calculate: (v) => v.cogs / v.inventory,
    format: "times",
    interpretation: {
      bad: "Below 3x — Slow-moving inventory. Risk of obsolescence and high storage costs.",
      ok: "3–6x — Average turnover. Normal for most industries.",
      good: "Above 6x — Fast-moving. Excellent inventory management and demand.",
      badLabel: "Slow",
      okLabel: "Average",
      goodLabel: "Fast",
      badColor: "red",
      okColor: "yellow",
      goodColor: "green",
      thresholdLow: 3,
      thresholdHigh: 6,
      higherIsBetter: true,
    },
    benchmarks: [
      { industry: "Grocery", typical: "15–25x", good: ">20x" },
      { industry: "Retail Apparel", typical: "3–6x", good: ">5x" },
      { industry: "Manufacturing", typical: "4–8x", good: ">6x" },
      { industry: "Automobile", typical: "8–12x", good: ">10x" },
    ],
    example: {
      scenario: "A manufacturer has $80M COGS and $10M average inventory.",
      result: 8.0,
      resultLabel: "8x",
      interpretation:
        "An inventory turnover of 8x means inventory is sold and replaced 8 times per year — very efficient.",
    },
  },
  {
    id: "peRatio",
    name: "Price-to-Earnings (P/E) Ratio",
    category: "Valuation",
    shortDescription: "How much investors pay per dollar of earnings.",
    formula: "Share Price / Earnings Per Share (EPS)",
    formulaVars: [
      {
        symbol: "Share Price",
        name: "Current Share Price",
        description: "The market price of one share of stock.",
      },
      {
        symbol: "EPS",
        name: "Earnings Per Share",
        description: "Net income divided by number of shares outstanding.",
      },
    ],
    definition:
      "The P/E Ratio tells you how much investors are willing to pay for each dollar of earnings. A high P/E may indicate growth expectations; a low P/E could mean undervaluation.",
    eli5: "If a company earns $1 per share and the stock costs $20, the P/E is 20. You're paying $20 to get $1 a year — which means it'd take 20 years to earn back your investment (at the same earnings).",
    inputs: [
      { key: "sharePrice", label: "Share Price ($)", placeholder: "e.g. 150" },
      {
        key: "eps",
        label: "Earnings Per Share (EPS) ($)",
        placeholder: "e.g. 6",
      },
    ],
    calculate: (v) => v.sharePrice / v.eps,
    format: "times",
    interpretation: {
      bad: "Above 40x — Potentially overvalued or very high growth expectations priced in.",
      ok: "15–40x — Fair value range for growth companies.",
      good: "Below 15x — Potentially undervalued. May offer good value.",
      badLabel: "Expensive",
      okLabel: "Fair",
      goodLabel: "Value",
      badColor: "red",
      okColor: "yellow",
      goodColor: "green",
      thresholdLow: 15,
      thresholdHigh: 40,
      higherIsBetter: false,
    },
    benchmarks: [
      { industry: "Technology", typical: "25–50x", good: "<35x" },
      { industry: "Utilities", typical: "12–18x", good: "<15x" },
      { industry: "Consumer Staples", typical: "15–25x", good: "<20x" },
      { industry: "Healthcare", typical: "20–35x", good: "<30x" },
    ],
    example: {
      scenario: "A stock trades at $150 per share with EPS of $10.",
      result: 15.0,
      resultLabel: "15x",
      interpretation:
        "A P/E of 15 is considered fair value — in line with historical market averages.",
    },
  },
  {
    id: "pbRatio",
    name: "Price-to-Book (P/B) Ratio",
    category: "Valuation",
    shortDescription: "Market value compared to the book value of the company.",
    formula: "Share Price / Book Value Per Share",
    formulaVars: [
      {
        symbol: "Share Price",
        name: "Market Price Per Share",
        description: "Current trading price of one share.",
      },
      {
        symbol: "BVPS",
        name: "Book Value Per Share",
        description:
          "Net assets (total assets minus liabilities) divided by shares outstanding.",
      },
    ],
    definition:
      "The P/B Ratio compares a stock's market price to its book value. A ratio below 1 may indicate undervaluation; above 1 means investors value the company above its asset worth.",
    eli5: "Book value is what you'd get if you sold all company stuff and paid all debts. P/B tells you how much more (or less) the stock market thinks the company is worth compared to that.",
    inputs: [
      { key: "sharePrice", label: "Share Price ($)", placeholder: "e.g. 50" },
      {
        key: "bookValuePerShare",
        label: "Book Value Per Share ($)",
        placeholder: "e.g. 20",
      },
    ],
    calculate: (v) => v.sharePrice / v.bookValuePerShare,
    format: "times",
    interpretation: {
      bad: "Above 5x — Significantly overvalued vs. book value. High risk.",
      ok: "1–3x — Reasonable premium. Typical for profitable businesses.",
      good: "Below 1x — Potentially undervalued. Buying assets at a discount.",
      badLabel: "Expensive",
      okLabel: "Fair",
      goodLabel: "Potential Value",
      badColor: "red",
      okColor: "yellow",
      goodColor: "green",
      thresholdLow: 1,
      thresholdHigh: 3,
      higherIsBetter: false,
    },
    benchmarks: [
      { industry: "Banking", typical: "0.8–2.0x", good: "<1.5x" },
      { industry: "Technology", typical: "4–15x", good: "<8x" },
      { industry: "Utilities", typical: "1–2x", good: "<1.5x" },
      { industry: "Manufacturing", typical: "1.5–4x", good: "<3x" },
    ],
    example: {
      scenario:
        "A bank stock trades at $30 with a book value per share of $25.",
      result: 1.2,
      resultLabel: "1.2x",
      interpretation:
        "P/B of 1.2 means investors pay a small 20% premium over the bank's net asset value — reasonable.",
    },
  },
  {
    id: "evEbitda",
    name: "EV/EBITDA",
    category: "Valuation",
    shortDescription:
      "Enterprise value relative to earnings before interest, taxes, depreciation, and amortization.",
    formula: "Enterprise Value / EBITDA",
    formulaVars: [
      {
        symbol: "EV",
        name: "Enterprise Value",
        description:
          "Market cap + total debt - cash. The total cost to acquire the company.",
      },
      {
        symbol: "EBITDA",
        name: "EBITDA",
        description:
          "Earnings Before Interest, Taxes, Depreciation & Amortization. Proxy for cash flow.",
      },
    ],
    definition:
      "EV/EBITDA compares the total value of a company (including debt) to its operating earnings. It's widely used for acquisitions and comparing companies with different capital structures.",
    eli5: "If you wanted to buy an entire business, you'd pay its market cap plus take on its debts. EV/EBITDA tells you how many years of cash profits it would take to pay back that total price.",
    inputs: [
      {
        key: "enterpriseValue",
        label: "Enterprise Value ($)",
        placeholder: "e.g. 100000000",
      },
      { key: "ebitda", label: "EBITDA ($)", placeholder: "e.g. 10000000" },
    ],
    calculate: (v) => v.enterpriseValue / v.ebitda,
    format: "times",
    interpretation: {
      bad: "Above 20x — Expensive. High growth expectations or overvaluation.",
      ok: "10–20x — Moderate valuation. Common for growth companies.",
      good: "Below 10x — Potentially undervalued. Good for value investors.",
      badLabel: "Expensive",
      okLabel: "Fair",
      goodLabel: "Value",
      badColor: "red",
      okColor: "yellow",
      goodColor: "green",
      thresholdLow: 10,
      thresholdHigh: 20,
      higherIsBetter: false,
    },
    benchmarks: [
      { industry: "Technology", typical: "15–30x", good: "<20x" },
      { industry: "Consumer Staples", typical: "10–15x", good: "<12x" },
      { industry: "Healthcare", typical: "12–20x", good: "<15x" },
      { industry: "Energy", typical: "5–10x", good: "<8x" },
    ],
    example: {
      scenario: "A company has an EV of $500M and EBITDA of $50M.",
      result: 10.0,
      resultLabel: "10x",
      interpretation:
        "EV/EBITDA of 10x is within the fair value range — it would take 10 years of EBITDA to pay back the enterprise value.",
    },
  },
];

export const CATEGORIES: {
  name: RatioCategory;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  description: string;
}[] = [
  {
    name: "Profitability",
    color: "text-teal-400",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500/30",
    icon: "TrendingUp",
    description: "How well does the company make money?",
  },
  {
    name: "Liquidity",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    icon: "Droplets",
    description: "Can the company pay its short-term bills?",
  },
  {
    name: "Solvency",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    icon: "Shield",
    description: "Is the company financially stable long-term?",
  },
  {
    name: "Efficiency",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    icon: "Zap",
    description: "How well does the company use its resources?",
  },
  {
    name: "Valuation",
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/30",
    icon: "DollarSign",
    description: "Is the stock cheap or expensive?",
  },
];
