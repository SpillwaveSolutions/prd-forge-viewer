---
doc_type: guide
slug: 04-search
title: Search a set
truth_state: current
wiki_key: guide/04-search
---
# Search a set

The search finds items, for example a persona, a journey stage, or a
functional requirement. The search is in a drawer at the right of the window.

## Open the search drawer

1. Open a set.
2. Click **Search** in the toolbar, next to **Export**. You can also press
   Command-F.

The drawer opens from the right. The cursor is in the search box.

The **Search** button shows only when a set is open. When no set is open,
Command-F does nothing.

## Close the search drawer

Do one of these steps:

- Click **Close** in the drawer.
- Press **Escape**.
- Click **Search** in the toolbar.

When the drawer is not pinned, it also closes when you open a result.

The drawer keeps your last results. When you open the drawer again, the
results show.

## Pin the drawer

1. Click **Pin** in the drawer.

The button changes to **Pinned**. The drawer stays open beside the document,
and the document moves to make space for it. You can open one result after
another and read each one. **Escape** does not close a pinned drawer. Click
**Close** or **Search** to close it.

To unpin the drawer, click **Pinned**. The viewer keeps the pin in the settings
file for the next time you open it.

## Search for a term

1. Type one or more words in the **Search** box.
2. Below **Categories**, select one or more categories, or select
   **All categories**.
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

The categories are a row of checkboxes below **Categories**. There is one
category for each section that holds items, in reading order. Each category
has the title of its section.

- Select one or more categories to search only those sections.
- Select **All categories** to search every section. This clears the other
  categories.
- If you clear the last selected category, the viewer selects
  **All categories** again.

## Open a result

1. Click a result.

The viewer opens the section of the item and shows the item. If the drawer is
not pinned, it closes.

## Clear the results

1. Click **Clear**.

## The search index

The viewer keeps a search index for each set in the app data folder. It does
not write the index to the set folder. When a document changes, the viewer
updates the index before the next search.
