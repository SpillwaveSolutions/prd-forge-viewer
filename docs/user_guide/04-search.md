---
doc_type: guide
slug: 04-search
title: Search a set
truth_state: current
wiki_key: guide/04-search
---
# Search a set

The search bar shows below the toolbar when a set is open. The search finds
items, for example a persona, a journey stage, or a functional requirement.

## Search for a term

1. Type one or more words in the **Search** box.
2. In the **in** list, select a category or **All categories**.
3. Click **Search**. You can also press **Return**.

The viewer shows the number of matches, for example "3 matches". Each result
shows:

- The score, from 0 to 100.
- The id of the item.
- The title of the item.
- The title of its section.

The best result is first and has the score 100. Each score after it shows how
good the match is, compared to the best result. The viewer shows 200 results
at most.

If no item matches, the viewer shows "No matches for *term*".

## How the search matches

- An item must contain every word that you type.
- A word also matches the start of a longer word. For example, `export` matches
  "exports".
- A match in the id counts most. A match in the title counts more than a match
  in the text.

## Categories

The **in** list has one category for each section that holds items, in
reading order. Each category has the title of its section. Select
**All categories** to search every section.

## Open a result

1. Click a result.

The viewer opens the section of the item and shows the item.

## Clear the results

1. Click **Clear**.

## The search index

The viewer keeps a search index for each set in the app data folder. It does
not write the index to the set folder. When a document changes, the viewer
updates the index before the next search.
