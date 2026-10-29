---
doc_type: guide
slug: 06-themes
title: Export themes
truth_state: current
wiki_key: guide/06-themes
---
# Export themes

A theme sets the colors and fonts of an export. The viewer has two built-in
themes, and you can make custom themes.

## The built-in themes

| Theme | Look |
|---|---|
| **Ice Snowstorm** | A cold blue page with navy headings. Sans-serif text and headings. |
| **Clay** | A warm ivory page with a terracotta accent. Sans-serif text and serif headings. |

Ice Snowstorm is the default export theme. You cannot change or delete a
built-in theme.

## Open the Themes dialog

1. Click **Themes** in the toolbar.

You can also click **Edit themes** in the **Export** dialog.

The dialog shows the list of themes at the side. A built-in theme has
"(built-in)" after its name. Click a theme in the list to see its settings.

## Make a custom theme

1. In the theme list, click the theme to start from.
2. Click **New theme**.
3. In the **Name** box, type a name.
4. Set the **Page**, **Text**, **Headings**, and **Accent** colors.
5. Select the **Text font** and the **Heading font**.
6. Click **Save themes**.

A new theme starts as a copy of the selected theme, with the name "Copy of
*name*". A name can have 40 characters at most. You can have 24 custom themes
at most.

For each color, use the color picker or type a hex value, for example
`#1D4E89`. Each font is serif, sans-serif, or monospace.

## Change a custom theme

1. In the theme list, click the custom theme.
2. Change its name, colors, or fonts.
3. Click **Save themes**.

## Select the theme for export

1. In the theme list, click the theme.
2. Select **Use for export**.
3. Click **Save themes**.

The **Export** dialog then starts with this theme.

## Delete a custom theme

1. In the theme list, click the custom theme.
2. Click **Delete**.
3. Click **Save themes**.

If the deleted theme was the theme for export, Ice Snowstorm becomes the theme
for export.

## Save and cancel

The viewer saves nothing until you click **Save themes**. To close the dialog
with no change, click **Cancel** or press **Escape**.

**Save themes** is not available when a custom theme has a problem. The dialog
shows each problem:

- "A custom theme has no name. Type a name."
- "*Color* color of *theme* is not a hex color such as #1D4E89."

The viewer keeps your custom themes and the theme for export in the settings
file. They are there after a restart.
