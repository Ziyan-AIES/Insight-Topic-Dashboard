# Monthly Insight Agent Kit

This workspace is a reusable system for preparing your monthly AI ecosystem insight.

## What this kit gives you

- A structured workflow from raw links to strategic insights.
- A reusable agent prompt you can run every month.
- Intake templates so you can give clear inputs (English + Chinese links are supported).
- Output templates for both email report and presentation deck.
- A way to move from indirect influence (insight sharing) toward optional direct suggestions.

## Folder structure

- `prompts/monthly-insight-agent.md`: Main agent system prompt.
- `templates/monthly-input-template.md`: What you provide each month.
- `templates/monthly-output-template.md`: Standard output format for report and deck.
- `months/2026-07-july/kickoff.md`: July working file.

## Recommended workflow (each month)

1. Create a new month folder under `months/` (copy the July kickoff file).
2. Fill intake fields: links, observations, questions, and strategic context.
3. Run the agent using `prompts/monthly-insight-agent.md` plus the monthly kickoff.
4. Review first draft:
   - Correct facts
   - Refine trend names
   - Add your own interpretation
5. Ask agent for:
   - Email version (short)
   - Research version (full)
   - Deck version (slide-by-slide)
6. Rehearse with the speaking support section:
   - 60-second executive summary
   - 10-minute presentation script
   - Q&A prep with likely tough questions

## Suggested split into sub-agents

For heavy months, use specialized sub-agents:

- **Signal Collector**: Extract claims and evidence from links.
- **Trend Synthesizer**: Cluster signals into trend candidates.
- **Blindspot Hunter**: Find under-discussed trends and second-order effects.
- **Strategy Translator**: Convert trends into implications for product and org.
- **Deck Builder**: Turn findings into a slide narrative.
- **Presentation Coach**: Improve clarity and confidence for spoken delivery.

## Output standards

The final monthly insight should always include:

- Top 3 to 5 trends with confidence level.
- One to three under-the-radar trends.
- Evidence trail (source-linked, dated, and categorized).
- Strategic implications:
  - indirect influence (shared thinking)
  - optional direct suggestions (non-prescriptive)
- Contrarian view and risks.
- What to monitor next month.

## Language guidance

- Keep source extraction bilingual if needed (Chinese and English).
- Publish final insight in professional English.
- For presentation: simplify sentence length and avoid idioms.

## Next step

Open `months/2026-07-july/kickoff.md`, paste your links and initial ideas, then run the agent prompt in `prompts/monthly-insight-agent.md`.
